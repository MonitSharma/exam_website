# React (vendored)

UMD builds of React 18.3.1, copied from unpkg so the deployed site has no
third-party runtime dependency:

- `react.production.min.js` / `react-dom.production.min.js` — used by the
  production build (`build.js`).
- `react.development.js` / `react-dom.development.js` — used by `index.html`
  during local development, for component stack traces and warnings. These are
  excluded from `dist/` by `build.js`.

`index.html` still loads `@babel/standalone` from a CDN with an integrity hash:
it is 3.1 MB, is only needed for the Babel-in-browser dev loop, and never ships.

To update, bump the version in all four URLs together:

    curl -fsSL https://unpkg.com/react@<v>/umd/react.production.min.js -o vendor/react/react.production.min.js
