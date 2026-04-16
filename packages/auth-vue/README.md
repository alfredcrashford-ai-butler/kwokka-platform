# @kwokka/auth-vue

Auth component for vue, fully integrated with Kwokka services.

## Geting started

### 1. Install package

```sh
npm install --save @kwokka/auth-vue
```

### 2. Use component

```vue
<template>
  <KwokkaAuth
    v-model:state="state"
    :hcaptchakey="hcaptchakey"
    :styles="styles"
    :endpoint="endpoint"
    @signin="onSignin($event)"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { KwokkaAuth, KwokkaAuthState } from '@kwokka/auth-vue';

  const state = ref(KwokkaAuthState.Initial);
  const states = ref(KwokkaAuthState);
  const styles = ref({ /* styles go here */ });
  const hcaptchakey = '********-****-****-****-************'
  const endpoint = ref('http://localhost:8081/owl');
  const onSignin = (data) => console.log(data);
</script>
```

This creates an auth component, that would automatically include all available authentication options, fully integrated with Kwokka platform.

## Styling

The auth component appearance is fully customizable and the API provides a convenient interface for styles tuning. Consider the following interface:

```ts
export interface KwokkaAuthStyles {
  card?: Block;
  button?: Block;
  input?: Block;
  inputBox?: Block;
  inputLabel?: Block;
  icon?: Block;
  loader?: Loader;
  passwordBox?: Block;
  passwordInput?: Block;
  passwordButton?: Block;
  passwordButtonIcon?: Block;
  backButton?: Block;
  heading?: Block;
  optionsList?: Block;
  emailButton?: Block;
  anonButton?: Block;
  delimiter?: Block;
  suggestionIcon?: Block;
  suggestion?: Block;
  suggestionPositive?: Block;
  suggestionNegative?: Block;
  success?: Block;
  successHeading?: Block;
  successCaption?: Block;
  email?: {
    emailInput?: Block;
    passwordInput?: Block;
    suggestionList?: Block;
    submit?: Block;
  };
  anon?: {
    retryButton?: Block;
  };
}
```

This is the interface of a style object, that you can provide to the `<KwokkaAuth />` component. Each field, marked as `Block` can have the following properties:

```ts
interface Block {
  border?: string;
  padding?: string;
  margin?: string;
  gap?: string;
  borderRadius?: string;
  maxWidth?: string;
  minWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
  fontWeight?: string;
  filter?: string;
  nineBoxWidth?: string;
  nineBoxHeight?: string;
  nineBoxTopLeft?: string;
  nineBoxTop?: string;
  nineBoxTopRight?: string;
  nineBoxLeft?: string;
  nineBoxCenter?: string;
  nineBoxRight?: string;
  nineBoxBottomLeft?: string;
  nineBoxBottom?: string;
  nineBoxBottomRight?: string;
  color?: string;
  background?: string;
}
```

Additionally, `Loader` can have any styles:

```ts
interface Loader {
  style?: string;
}
```

Example:

```vue
<template>
  <KwokkaAuth v-model:state="state" :styles="styles" />
</template>

<script setup>
  import { ref } from 'vue';
  import { KwokkaAuth, KwokkaAuthState } from '@kwokka/auth-vue';

  const state = ref(KwokkaAuthState.Initial);
  const styles = ref({
    button: {
      padding: '2px 14px',
      height: '44px',
      minWidth: '120px',
    },
    loader: {
      style: `
        width: 48px; height: 48px; border: 5px solid currentColor;
        border-bottom-color: transparent; border-radius: 50%; display: inline-block;
        animation: kwokka-auth-loader-animation 1s linear infinite;
      `,
    },
  });
</script>
```

## I18n

The auth component uses `vue-i18n` as a peer dependency for translations. It requires the following keys to be provided in translation:

```json
{
  "auth": {
    "heading": "Sign In",
    "back": "Go back",
    "or": "OR",
    "successHeading": "Success!",
    "successCaption": "You are going to be redirected to main page now...",
    "email": {
      "addCredentialName": "E-Mail",
      "name": "With E-Mail",
      "emailPlaceholder": "Enter your email",
      "passwordPlaceholder": "Enter your password",
      "signIn": "Sign in",
      "forgotPassword": "Forgot password?",
    },
    "anon": {
      "name": "Enter as a guest",
      "retry": "Retry",
    },
    "resetPasswordRequest": {
      "heading": "Reset password",
      "description": "Please, provide your email address in the field above and we will send you the recovery instructions.",
      "inputPlaceholder": "Enter your email",
      "submit": "Submit",
    },
    "resetPassword": {
      "heading": "Reset password",
      "description": "Please, provide a new reliable password in the input field below.",
      "inputPlaceholder": "Enter your password",
      "submit": "Submit",
    },
    "suggestions": {
      "emailValid": "Email is valid",
      "passwordLengthValid": "Password has 6 to 30 characters",
      "passwordHasUppercaseLetter": "Password has at least one uppercase letter",
      "passwordHasLowercaseLetter": "Password has at least one lowercase letter",
      "passwordHasNumber": "Password has at least one number",
      "passwordHasOnlyAllowedCharacters": "Password consists of upper- and lower- case letters, numbers, and allowed special characters (!$%&?).",
    },
    "addCredentialSubmit": "Submit",
    "conditions": "By signing in you accept our {0}.",
    "conditionsPP": "Privacy Policy"
  }
}
```

## API

The following section provides a brief description on the API of `@kwokka/auth-vue`.

### Props

##### `state` **REQUIRED**

This is a `v-model` prop. It must be provided to the component to function properly. It can be used to change the state of the container of `<KwokkaAuth />` component.

##### `hcaptchakey` **REQUIRED**

String that represents site key for hcaptcha. Used to integrate with hcaptcha service.

##### `styles` *OPTIONAL*

Object containing styles settings. Default: `{}`.

##### `endpoint` *OPTIONAL*

String containing the base url of authentication service. Default: `https://api.kwokka.co/owl`.

### Emits

##### `update:state`

This is a `v-model` event. It is used to synchronously update the value of `state` prop.

##### `signin`

Emitted whenever there is a successful sign-in. Contains the following payload:

```ts
interface SigninPayload {
  access: string;
  refresh: string;
}
```

##### `signup`

Emitted whenever there is a successful sign-up. Contains the following payload:

```ts
interface SignupPayload {
  accountId: string;
}
```

##### `error`

Emitted whenever there is an exception or unexpected error.

## Dev

The following section provides some instructions on the development process of `@kwokka/auth-vue`.

### Environment

- Node.js (v22.14.0)

### Commands

##### `npm install` - Install dependencies

##### `npm run start` - Run development server

##### `npm run build` - Production build

##### `npm run dev` - Run dev server with test setup

##### `npm run lint` - Lint and fix files

##### `npm run format` - Format all files using prettier

## Copyright

> Copyright 2025 Georgii Sharadze
>
> All rights reserved.
