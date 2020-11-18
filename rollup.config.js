import * as fs from 'fs';
import template from 'lodash.template';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import html, { makeHtmlAttributes } from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy';

const production = process.env.NODE_ENV !== 'development';

const babelConfig = {
  extensions: ['.js', '.mjs', '.html', '.svelte', '.ts'],
  babelHelpers: 'bundled',
  exclude: ['node_modules/@babel/**', 'static/**', 'build/**', 'public/**'],
  presets: [
    ['@babel/preset-env', { targets: { esmodules: true } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};

export default {
  input: 'src/index.js',
  output: {
    dir: 'public',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
    sourcemap: production ? true : 'inline',
    format: 'esm',
  },
  plugins: [
    svelte({
      preprocess: require('./svelte.config').preprocess,
      // enable run-time checks when not in production
      dev: !production,
      // extract any component CSS out into
      // a separate file — better for performance
      // css: css => {
      //     css.write('public/bundle.css');
      // },
      // Instead, emit CSS as a file for processing through rollup
      emitCss: true,
    }),
    postcss({
      extract: true,
    }),

    resolve({
      mainFields: ['module', 'browser', 'main'],
      extensions: ['.mjs', '.js', '.json', '.ts', '.svelte'],
      dedupe: (importee) =>
        importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    copy({
      targets: [{ src: 'static/**/*', dest: 'public/' }],
    }),
    commonjs(),
    babel(babelConfig),

    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    html({
      title: 'A Svelte Website',
      template: ({ attributes, files, publicPath, title }) => {
        let templateFile = fs.readFileSync('src/index.html');

        // This is adapted from the default template function in the HTML plugin.
        const scripts = (files.js || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            return `<script src="${publicPath}${fileName}"${attrs}></script>`;
          })
          .join('\n');

        const links = (files.css || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.link);
            return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
          })
          .join('\n');

        let exec = template(templateFile.toString());
        return exec({
          attributes,
          title,
          scripts,
          links,
          htmlAttributes: makeHtmlAttributes(attributes.html),
        });
      },
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
