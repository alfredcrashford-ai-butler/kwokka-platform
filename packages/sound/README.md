# @kwokka/sound

Sound manager for kwokka projects.

## Installation

```sh
npm install --save @kwokka/sound
```

## Usage

```ts
const soundConfig = {
  sfx: [
    {
      id: 'main_theme',
      group: 'music',
      src: '/assets/music/main_theme.mp3',
      preload: true,
      gain: 0.75,
      loop: true,
    }
  ],
};

const instance = new KwokkaSound(soundConfig);
instance.setup();

// play main theme in loop
const sfx = instance.play('main_theme');
// stop after 30 seconds
setTimeout(() => sfx.stop(), 30000);
```

## Environment

- Node.js (v22.14.0)

### Commands

##### `npm install` - Install dependencies

##### `npm run build` - Production build

##### `npm run lint` - Lint and fix files

##### `npm run format` - Format all files using prettier

## Copyright

> Copyright 2025 Georgii Sharadze
>
> All rights reserved.
