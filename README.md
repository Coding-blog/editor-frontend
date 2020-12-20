# editor-frontend

This is the frontend of coding blog editor panel.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [TyFON](https://loreanvictor.github.io/tyfon/)

<br>

## Dev Setup

1. clone and cd into the cloned folder:
```bash
git clone git@github.com:Coding-blog/editor-frontend.git
cd editor-frontend
```

2. [run backend on dev](https://github.com/Coding-blog/editor-backend#dev-setup)

👉 You can skip this if you want to connect to prod server or some other server

3. install server SDK:

```bash
tyfon i --env dev
```

👉 For connecting to prod server, do this instead:

```bash
tyfon i --env prod
```

4. install dependencies:

```bash
npm i
```

5. run it:

```bash
npm start
```

its now accessible on [`http://localhost:3000`](http://localhost:3000).

👉 you need a key to authenticate, ask a maintainer for it.

<br/>

## Prod Setup:

This repo will automatically be deployed to GitHub Pages (`gh-pages` branch) whenever there is a commit to `main`.

👉 If you want to deploy somewhere else, setup dev, but connect to prod server:

```bash
tyfon i --env prod
```

then build stuff:

```bash
npm run build
```

and put `dist/` folder on some CDN or static host.

<br><br>


