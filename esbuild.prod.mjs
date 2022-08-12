import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {htmlPlugin} from '@craftamap/esbuild-plugin-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexTemplate = fs.readFileSync(
  path.resolve(__dirname, 'index.html'),
  'utf8'
);

const devScript = '<script type="module" src="./out/index.js"></script>';
const baseUrl = '<base href="/" />';

esbuild.build({
  entryPoints: ['src/index.ts'],
  entryNames: 'bundle-[hash]',
  bundle: true,
  metafile: true,
  minify: true,
  outdir: 'dist/',
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/index.ts'],
          filename: 'index.html',
          scriptLoading: 'module',
          define: {
            baseHref: process.env.BASE_HREF || '/',
          },
          htmlTemplate: indexTemplate
            .replace(devScript, '')
            .replace(baseUrl, '<base href="<%- define.baseHref %>" />'),
        },
      ],
    }),
  ],
});
