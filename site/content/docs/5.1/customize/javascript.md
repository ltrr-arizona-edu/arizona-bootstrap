---
layout: docs
title: JavaScript
description: Learn how the JavaScript build pipeline compiles, transpiles, lints, and packages the project scripts, and how to add new source files.
group: customize
toc: true
---

The project's JavaScript is built from the `package.json` scripts and a few helper files in the `build/` directory. These scripts compile the source code into the distributable files under `dist/js/`, lint the sources, and generate minified output for production use.

## Package scripts

The main JavaScript-related scripts are defined in `package.json`:

```json
"js": "npm-run-all js-compile js-minify",
"js-compile": "npm-run-all --aggregate-output --parallel js-compile-*",
"js-lint": "eslint --cache --cache-location .cache/.eslintcache --report-unused-disable-directives --ext .html,.js,.mjs,.md .",
"js-minify": "npm-run-all --aggregate-output --parallel js-minify-*",
"dist": "npm-run-all --aggregate-output --parallel css js"
```

These scripts are meant to be run from the project root. The `dist` script builds both the CSS and the JavaScript in one pass, while `npm run js` focuses only on JavaScript.

## Compile and transpile

The JavaScript compilation step is powered by Rollup and Babel.

```sh
npm run js-compile
```

This runs the `js-compile-*` tasks in parallel:

- `js-compile-standalone` builds the UMD bundle.
- `js-compile-standalone-esm` builds the ES module bundle.
- `js-compile-bundle` builds a single bundle with Popper bundled in.
- `js-compile-plugins` builds each plugin file from the `js/src/` directory as its own distribution artifact.

The actual bundling logic lives in `build/rollup.config.mjs`. That file sets the Rollup input to the package entry points in `js/index.umd.js` and `js/index.esm.js`, marks `@popperjs/core` as an external dependency unless the bundle variant is being created, and applies `@babel/preset-env` so the output is transpiled for the target browsers.

The `build/build-plugins.mjs` utility scans both the project's `js/src/**/*.js` files and the Bootstrap plugin sources in `node_modules/bootstrap/js/src/**/*.js`. It writes a separate UMD bundle for each file in the corresponding `js/dist/` location, which is how individual plugin modules can be consumed independently.

## Linting and minification

Before shipping production assets, the project lints and minifies the JavaScript.

```sh
npm run js-lint
npm run js-minify
```

The lint step runs ESLint across the repository using `--ext .html,.js,.mjs,.md`, so it checks source files, HTML script blocks, Markdown examples, and module scripts together. The minification step then compresses the built files with Terser and writes `.min.js` variants along with sourcemaps.

The generated files live in `dist/js/`, including:

- `arizona-bootstrap.js`
- `arizona-bootstrap.esm.js`
- `arizona-bootstrap.bundle.js`
- the corresponding `.min.js` files and sourcemaps

## How the package is assembled

The main package entry points are defined in `package.json`:

```json
"main": "dist/js/arizona-bootstrap.js",
"files": [
  "dist/{css,js}/**/*.{css,js,map,svg}",
  "js/{src,dist}/**/*.{js,map}",
  "scss/**/*.scss"
]
```

This tells npm which files to publish. The compiled JavaScript is distributed from `dist/js`, while the original source files and generated plugin bundles remain under `js/src` and `js/dist` so the project can still be customized or extended from source.

## Adding additional JavaScript files

To add a new JavaScript module:

1. Create a new file under `js/src/`.
2. Write it as an ES module and export the function or class your code provides.
3. Import it into `js/index.umd.js` and `js/index.esm.js`.
4. Add it to the default export object (or call it immediately if it needs to run on page load).
5. Run `npm run js` or `npm run watch-js-main` to rebuild the distribution files.

For example:

```js
// js/src/custom-feature.js
export default function enableCustomFeature() {
  document.querySelectorAll('[data-custom-feature]').forEach(element => {
    element.classList.add('is-enabled')
  })
}
```

```js
// js/index.umd.js
import enableCustomFeature from './src/custom-feature.js'

export default {
  // existing exports...
  enableCustomFeature
}

enableCustomFeature()
```

The same pattern applies to `js/index.esm.js`, except those exports are written as ES module exports. Because `build/build-plugins.mjs` scans `js/src/`, newly added files will also be built as separate plugin bundles automatically when you run the compile step.

## Watching for local development

The repository also includes watchers for live rebuilds during development:

```sh
npm run watch
```

This runs the CSS and JS watchers in parallel, including:

- `watch-css-main`
- `watch-css-docs`
- `watch-js-main`
- `watch-js-docs`

The `watch-js-main` script watches `js/src/` and re-runs the JavaScript lint and compile steps whenever a source file changes, which is the fastest way to iterate on custom JavaScript while keeping the built assets in sync.
