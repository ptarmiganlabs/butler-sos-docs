# Contribution Guidelines

:::info Open Source
Butler SOS is an open source project, using the [MIT license](https://choosealicense.com/licenses/mit/).

This means that all source code, documentation etc is available as-is, at no cost.

**It however also means that anyone interested can - and is encouraged to - contribute to the project!**
:::

Butler SOS is developed in [Node.js](https://nodejs.org), with support from various [NPM](https://www.npmjs.com/) modules.

All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

## Creating an Issue

If you've found a problem - or have a feature suggestion - with Butler SOS itself or the documentation, but you're not sure how to fix it yourself, please create an issue in the [Butler SOS repo](https://github.com/ptarmiganlabs/butler-sos/issues/).

:::warning Security/Disclosure
If you discover a serious bug with Butler SOS that may pose a security problem, please disclose it confidentially to [security@ptarmiganlabs.com](mailto:security@ptarmiganlabs.com) first, so that it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.
:::

## Development Concepts

Some of the main tools/processes used during development of Butler SOS are:

### Visual Studio Code (VSC)

Any IDE supporting Node.js can be used, but VSC works really well. Open Source and a huge ecosystem of extensions.

### GitHub

Used to store source code, track issues, change requests etc.

GitHub Actions used to build Docker images.

### Release Please

[Release Please](https://github.com/googleapis/release-please) is used to create release notes.  
It also enforces consistent versioning when new (sometimes breaking) features are added, bugs fixed etc.

This means that as of Butler SOS 6.0 you can have more trust in the [semantic versioning](https://semver.org) of Butler SOS releases.

### ESLint + Prettier

Used to enforce a uniform source code format that also follow best practices defined in ESLint.

ESLint shows code issues within Visual Studio Code, but standalone reports can also be created:

```bash
➜ npx eslint . --format table

/Users/goran/code/butler-sos/src/butler-sos.js

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 31       │ 18       │ error    │ Unexpected require().                                  │ global-require       ║

/Users/goran/code/butler-sos/src/lib/appnamesextract.js

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 29       │ 37       │ error    │ A constructor name should not start with a             │ new-cap              ║
║          │          │          │ lowercase letter.                                      │                      ║

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 13 Errors                                                                                                      ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ 4 Warnings                                                                                                     ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

To format all source code files:

```bash
➜  npm run format:prettier

> butler-sos@13.0.0 format:prettier
> npx prettier --config .prettierrc.yaml "./**/*.{ts,css,less,js}" --write

butler-sos.js 97ms
docker-healthcheck.js 13ms
globals.js 90ms
lib/appnamesextract.js 35ms
lib/healthmetrics.js 27ms
...
```

## Documentation

This documentation site is built with [VitePress](https://vitepress.dev/), a modern static site generator powered by Vue.

To contribute to the documentation:

1. Fork the [butler-sos-docs repository](https://github.com/ptarmiganlabs/butler-sos-docs)
2. Make your changes in the `vitepress-site/docs` directory
3. Test locally with `npm run dev`
4. Submit a pull request

## Getting Help

If you need help contributing or have questions about Butler SOS development:

- Post in the [Discussions forum](https://github.com/ptarmiganlabs/butler-sos/discussions)
- Check existing [Issues](https://github.com/ptarmiganlabs/butler-sos/issues)
- Review the [source code](https://github.com/ptarmiganlabs/butler-sos)
