
<a name="readmemd"></a>

# useGTM
React implementation for Google Tag Manager

<a name="_librarymd"></a>

usegtm - v1.0.0

# usegtm - v1.0.0

## Table of contents

### Functions

- [GTM](#gtm)
- [useGTM](#usegtm)

## Functions

### GTM

▸ **GTM**(`options`: GTMArgs & { `children?`: ReactNode ; `events?`: GTMEvents  }): *Element*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options` | GTMArgs & { `children?`: ReactNode ; `events?`: GTMEvents  } |

**Returns:** *Element*

Defined in: [index.tsx:79](https://github.com/rhdeck/usegtm/blob/606ebfb/src/index.tsx#L79)

___

### useGTM

▸ **useGTM**(`options`: *Partial*<GTMArgs\> & { `events?`: GTMEvents  }): *object*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `options` | *Partial*<GTMArgs\> & { `events?`: GTMEvents  } |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `auth?` | *string* |
| `dataLayerName` | *string* |
| `events?` | GTMEvents |
| `id` | *string* |
| `preview?` | *boolean* |
| `sendEvent` | (`key`: *string*, `value`: *string*) => *void* |
| `sendEvents` | (`events`: GTMEvents) => *void* |

Defined in: [index.tsx:92](https://github.com/rhdeck/usegtm/blob/606ebfb/src/index.tsx#L92)
