# Hugo Archive

This directory contains the archived Hugo-based documentation site that was previously the primary documentation for Butler SOS. The site has been migrated to VitePress, but this archive is kept for reference and to ensure that no content was lost during the migration.

## Contents

This archive contains:

- `content/` - Original Hugo content files (Markdown)
- `layouts/` - Hugo layout templates
- `static/` - Static assets (images, CSS, JS)
- `assets/` - Additional assets
- `resources/` - Hugo generated resources
- `docs/` - Built Hugo site output
- Configuration files: `hugo.yaml`, `hugo._toml`
- `go.mod`, `go.sum` - Go module files for Hugo
- `.hugo_build.lock` - Hugo build lock file
- `.gitmodules` - Git submodules configuration (for themes: hugo-notice, plausible-hugo)
- `package.json`, `package-lock.json` - Node.js dependencies used by Hugo build

## Running the Hugo Site Locally

If you need to run the archived Hugo site for reference:

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.110.0 or later recommended)
- [Dart Sass](https://sass-lang.com/dart-sass) (for SCSS processing)
- Git (for theme submodules)

### Steps

1. Navigate to the hugo-archive directory:

   ```bash
   cd hugo-archive
   ```

2. Initialize and update the theme submodules:

   ```bash
   git submodule update --init --recursive
   ```

3. Install Node.js dependencies (if any):

   ```bash
   npm install
   ```

4. Start the Hugo development server:

   ```bash
   hugo server --config hugo.yaml
   ```

5. Open your browser to `http://localhost:1313`

## Building the Hugo Site

To build the static site:

```bash
hugo --config hugo.yaml --gc --minify
```

The built site will be in the `docs/` directory.

## Migration Notes

- The site was migrated to VitePress on December 7, 2025
- Migration documentation can be found in the `vitepress-migration-docs/` directory at the repository root
- The VitePress site is now the primary documentation site

## Theme Information

This site uses custom Hugo themes which are included as Git submodules:

- [hugo-notice](https://github.com/martignoni/hugo-notice.git) - For notice/alert blocks
- [plausible-hugo](https://github.com/divinerites/plausible-hugo) - For Plausible analytics integration

## Questions or Issues

If you have questions about the migration or need to reference the archived Hugo site, please open an issue in the repository.
