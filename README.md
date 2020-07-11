# A starter template for Svelte, TailwindCSS and Storybook

I forked this from https://github.com/jerriclynsjohn/svelte-storybook-tailwind and modified to add various features I like to have in my projects.

This repo also contains a `remove-storybook.sh` script for projects that don't need to use Storybook.

## Rollup Configuration

- Chunked Build Output with ES Modules.
- Transpilation through Babel with Typescript support.
- Rollup replace plugin for `process.env.NODE_ENV`. Some NPM packages require this to be usable at all and it's also useful at other times.
- HTML templating support
- Copy static files from the `static` directory instead of having to place them in `public`.

## CSS Build Pipeline

- TailwindCSS with Tailwind UI styles plugin
- PurgeCSS (production only)
- cssnano (production only)
