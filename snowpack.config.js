module.exports = {
  "scripts": {},
  "plugins": [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss'
  ],
  mount: {
    public: '/',
    src: '/_dist_',
  },
}
