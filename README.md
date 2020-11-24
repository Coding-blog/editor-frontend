<img width="156px" src="https://raw.githubusercontent.com/loreanvictor/callbag-jsx/2dce75006b1046ae28edfb8f4ba4af164b167f56/docs/assets/callbag-jsx.svg"/>

# Starter project for [`callbag-jsx`](https://github.com/loreanvictor/callbag-jsx)

1. [Use this template](https://github.com/loreanvictor/callbag-jsx-starter-ts/generate)
1. Clone your repo and `cd` to it
1. Install dependencies: `npm i`
1. Start dev server: `npm start`
    1. Entry file is in `src/index.tsx`
    1. Dev version is served on `localhost:3000`
1. Build your app: `npm run build`
    1. Build files are in `dist/`

👉 Don't forget to [read the docs](https://loreanvictor.github.io/callbag-jsx/).

<br><br>

## Stack

- [Typescript](https://www.typescriptlang.org/) for transpilation
  - Configuration in `tsconfig.json`

- [Webpack](https://webpack.js.org) for bundling and dev server
  - Configuration in `webpack.common.js`
  - Dev specific config in `webpack.dev.js`
  - Prod specific config in `webpack.prod.js`

- [ESLint](https://eslint.org) for linting
  - [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for using ESLint on Typescript
  - Configuration in `.eslintrc`
