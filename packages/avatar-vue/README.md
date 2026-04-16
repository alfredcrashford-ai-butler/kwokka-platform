# @kwokka/avatar-vue

Avatar components for vue, fully integrated with Kwokka services.

## Components

TODO: add readme with api refs and components and examples

## I18n

The components use `vue-i18n` as a peer dependency for translations. It requires the following keys to be provided in translation:

```json
{
  "avatar": {
    "setup": {
      "description": "",
      "nameLabel": "",
      "namePlaceholder": "",
      "next": "",
      "avatarCaption": ""
  },
  "settings": {
    "background": "",
    "image": "",
    "confirm": "",
    "nameLabel": "",
    "namePlaceholder": ""
  }
}
```

## API

The following section provides a brief description on the API of `@kwokka/auth-vue`.

### Props

##### `state` **REQUIRED**

This is a `v-model` prop. It must be provided to the component to function properly. It can be used to change the state of the container of `<KwokkaAuth />` component.

##### `styles` _OPTIONAL_

Object containing styles settings. Default: `{}`.

##### `endpoint` _OPTIONAL_

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
