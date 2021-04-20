import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { stringify } from "querystring";
interface GTMArgs {
  id: string;
  auth?: string;
  preview?: boolean;
  dataLayerName: string;
}
interface GTMEvents {
  [key: string]: any;
}
const DEFAULT_DATA_LAYER = "_default";
const context = createContext({ id: "", dataLayerName: DEFAULT_DATA_LAYER });
const { Provider: GTMProvider } = context;
let registeredIframes: { [id: string]: HTMLElement } = {};
let registeredScripts: { [idAndDataLayerName: string]: HTMLElement } = {};
function makeIFrame(options: { id: string; preview?: boolean; auth?: string }) {
  const { id, preview, auth } = options;
  if (registeredIframes[id]) return;
  //build the search string
  const queryString = stringify({
    id,
    gtm_auth: auth,
    gtm_preview: preview,
    gtm_cookies_win: "x",
  });

  const snippet = `
    <iframe src="https://www.googletagmanager.com/ns.html?${queryString}"
      height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`;

  const noscript = document.createElement("noscript");
  noscript.innerHTML = snippet;
  document.head.insertBefore(noscript, document.head.childNodes[0]);
  registeredIframes[id] = noscript;
}
function makeScript(options: {
  events?: GTMEvents;
  auth?: string;
  preview?: boolean;
  dataLayerName: string;
  id: string;
}) {
  const { events, auth, preview, dataLayerName, id } = options;
  if (registeredScripts[`${id}-${dataLayerName}`]) return;
  const queryString = stringify({
    gtm_auth: auth,
    gtm_preview: preview,
    gtm_cookies_win: "x",
  });
  const snippet = `
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js', ${JSON.stringify(
        events
      ).slice(1, -1)}});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+'${queryString}';
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','${dataLayerName}','${id}');`;
  const script = document.createElement("script");
  script.innerHTML = snippet;
  document.head.insertBefore(script, document.head.childNodes[0]);
  registeredScripts[`${id}-${dataLayerName}`] = script;
}
function addEvents(dataLayerName: string, events: GTMEvents) {
  //@ts-ignore
  if (!window[dataLayerName]) window[dataLayerName] = [];
  //@ts-ignore
  window[dataLayerName].push(JSON.stringify(events));
}

export function GTM(
  options: GTMArgs & { events?: GTMEvents; children?: ReactNode }
) {
  const { children, ...gtmArgs } = options;
  const gtmValues = useGTM(gtmArgs);
  const value = useMemo(() => {
    return {
      ...gtmValues,
    };
  }, [gtmValues]);
  return <GTMProvider value={value}>{children}</GTMProvider>;
}

export function useGTM(options: Partial<GTMArgs> & { events?: GTMEvents }) {
  const gtmContext = useContext(context);
  const gtmOptions = useMemo(() => ({ ...gtmContext, ...options }), [
    options,
    gtmContext,
  ]);
  useEffect(() => {
    if (!gtmOptions.id) throw new Error("ID is required for GTM to work");
    makeIFrame(gtmOptions);
    makeScript(gtmOptions);
    if (options.events) addEvents(gtmOptions.dataLayerName, options.events);
  }, [gtmOptions, options]);
  useEffect(() => {});
  return useMemo(
    () => ({
      ...gtmOptions,
      sendEvent: (key: string, value: string) => {
        addEvents(gtmOptions.dataLayerName, { key: value });
      },
      sendEvents: (events: GTMEvents) => {
        addEvents(gtmOptions.dataLayerName, events);
      },
    }),
    [gtmOptions]
  );
}
