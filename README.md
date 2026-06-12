# Butler SOS documentation site

This repository contains the [VitePress](https://vitepress.dev/) based documentation for [Butler SOS](https://github.com/ptarmiganlabs/butler-sos), which is an open source monitoring tool for [Qlik Sense](https://www.qlik.com/us/products/qlik-sense).

The doc site created from this repository is available at [butler-sos.ptarmiganlabs.com](https://butler-sos.ptarmiganlabs.com).

## Development

To run the documentation site locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run serve
```

## Deployment

The site is automatically deployed to Cloudflare Pages when changes are pushed to the `master` branch.
