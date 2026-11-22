# Repository Guidelines

## Project Structure

ShopLedger is an Express application for retail and wholesale billing, inventory, and customer credit (khata). `server.js` mounts the `/api` routes from `routes/`, serves the static frontend, and exposes the printable invoice view. Put business rules in `lib/`, alongside the existing pricing, tax, inventory, order, ledger, and reporting modules. The browser UI lives in `public/index.html`, `public/css/style.css`, and `public/js/app.js`. `config.js` holds application defaults, and `lib/store.js` reads and writes `data/db.json`.

## Build and Run Locally

Run these commands from the repository root. The app runs directly on Node.js and serves its browser assets as source files.

- `npm ci` installs dependencies from `package-lock.json`.
- `npm start` starts the server. Open `http://localhost:3000` to use the app.
- In PowerShell, set `$env:PORT = '3001'` before `npm start` to use a different port.

## Coding Style and Naming

Match the surrounding JavaScript with two-space indentation, single quotes, semicolons, and camelCase identifiers such as `getSellableStock`. Use CommonJS (`require`, `module.exports`, or `exports`) for server modules and plain JavaScript in the browser. Follow existing lowercase filenames and group routes by resource. Keep HTTP handling in `routes/` and reuse domain logic in `lib/`. There is no configured formatter or linter.

## Testing Guidelines

`npm test` is a placeholder that exits with an error. The repository has no configured test framework, test naming convention, or coverage threshold. Run `node --check` on edited JavaScript files and smoke-test the affected API or browser flow. For order changes, verify totals, stock, and customer balances where applicable. Use a disposable copy of the app for checks that write to `data/db.json`.

## Commits and Pull Requests

Recent commit subjects are short and lowercase. Follow the descriptive examples, such as `support hsn gst slabs and coupon maxDiscount caps`. In the pull request, explain the behavior change and how you verified it. Link the related issue when one exists and attach screenshots for visible UI or invoice changes.
