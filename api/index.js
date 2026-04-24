'use strict';

/**
 * Vercel Serverless entry. `vercel.json` rewrites all paths to `/api`, which runs this file.
 * Requires `npm run build` so `dist/main.js` exists (see project Build Command).
 */
module.exports = require('../dist/main.js').default;
