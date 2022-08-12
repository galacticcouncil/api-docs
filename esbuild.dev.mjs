import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  metafile: true,
  watch: process.env.ESBUILD_WATCH === 'true',
  sourcemap: true,
  outdir: 'out/',
});
