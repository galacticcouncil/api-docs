# Router

The website is using `@vaadin/router` with History API fallback for SPA routing.

- For local dev `npm run dev` see: `(--app-index index.html)` in **_package.json_** `serve` script
- For DEV build `npm run build` see: `({ historyApiFallback: true })` in **_rollup.config.js_** `serve` plugin