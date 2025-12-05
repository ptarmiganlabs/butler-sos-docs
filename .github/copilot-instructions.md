````instructions
---
applyTo: '**'
---

# Butler SOS Documentation Site

Butler SOS documentation site documents [Butler SOS](https://github.com/ptarmiganlabs/butler-sos), an open source monitoring and operations tool for Qlik Sense Enterprise on Windows. The site is currently hosted at butler-sos.ptarmiganlabs.com.

**IMPORTANT - Migration in Progress**: This repository is transitioning from Hugo to VitePress for documentation:

- **Current state**: Hugo-based site (content in `/content`, built with Hugo)
- **Migration target**: VitePress-based site (will be in `/vitepress-site`)
- **Reference project**: Butler docs has already completed this migration successfully
- **During migration**: Both systems may coexist temporarily
- **Goal**: All new work should prepare for or implement VitePress structure

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

**Current Hugo System (Legacy - Being Replaced):**

- All documentation work is currently in `/content` directory
- Static assets (images, etc.) are in `/static/`
- Configuration is in `hugo.yaml` and `hugo._toml`
- Built output goes to `/docs/` directory
- Uses Docsy theme via Git submodules

**Target VitePress System (Future State):**

- All documentation work will be in `/vitepress-site`
- Content files will be in `/vitepress-site/docs/docs/` organized by topic
- Static assets (images, OpenAPI specs, etc.) will be in `/vitepress-site/docs/public/`
- Configuration will be in `/vitepress-site/docs/.vitepress/config.ts`
- Custom components will be in `/vitepress-site/docs/.vitepress/components/`
- Theme customization will be in `/vitepress-site/docs/.vitepress/theme/`
- **Source code repository**: The main Butler SOS project is at github.com/ptarmiganlabs/butler-sos. The doc site shall correctly reflect the current state of that project, i.e. create content that describes the current features, configuration options, and behavior of Butler SOS.
- Reference Butler docs migration for similar structure and scripts. Available locally at `/Users/goran/code/butler-docs/vitepress-migration-docs` if you have access, otherwise online at https://github.com/ptarmiganlabs/butler-docs/tree/main/vitepress-migration-docs

### Hugo System (Current - Legacy)

**Setup and Development:**

- Install Hugo extended version
- Use Docsy theme (already configured via submodules)
- Serve locally: `hugo server --disableFastRender` -- includes hot reload
- Build for production: `hugo -e production --baseURL https://butler-sos.ptarmiganlabs.com`

**Working Directory:**

- Content editing: `/content/en/docs/` directory
- Static assets: `/static/` directory

### VitePress System (Target - Future)

**Prerequisites:**

- Node.js 18+ and npm installed
- Git for version control

**Setup and Development (once migration is complete):**

- Navigate to VitePress directory: `cd /Users/goran/code/butler-sos-docs/vitepress-site`
- Install dependencies: `npm install` -- takes 10-20 seconds. Set timeout to 60+ seconds.
- Fetch Butler SOS version info: `npm run pre:version` -- fetches current Butler SOS version from GitHub
- Start development server: `npm run dev` -- takes 2-5 seconds, opens at http://localhost:5173
  - Development server includes hot reload for instant preview of changes
  - The pre:version script runs automatically before dev server starts
- Build the site: `npm run build` -- takes 10-30 seconds depending on content size
  - Builds static site to `/vitepress-site/docs/.vitepress/dist`
  - Includes automatic version fetching via pre:version script
- Preview production build: `npm run serve` -- serves the built site locally
- Deploy to GitHub Pages: `npm run deploy` -- builds and publishes to gh-pages branch

**Working Directory:**

- All VitePress commands should be run from `/vitepress-site` directory
- Do not run VitePress commands from repository root

## Validation

**Hugo System (Current):**

- Validate by running `hugo server --disableFastRender` from repository root
- Check that content renders correctly at http://localhost:1313
- Verify navigation and shortcodes work correctly
- For production validation: `hugo -e production --baseURL https://butler-sos.ptarmiganlabs.com` and check for build errors

**VitePress System (Target):**

- ALWAYS validate documentation changes by running the development server: `npm run dev` (from `/vitepress-site` directory)
- Check that content renders correctly at http://localhost:5173
- Verify navigation works and pages are accessible
- For production validation: `npm run build` and check for build errors
- Build output goes to `/vitepress-site/docs/.vitepress/dist`
- Verify build succeeds with exit code 0
- Preview production build: `npm run serve` to test the built site
- Check console for any errors or warnings during development
- Validate images and static assets load correctly from `/vitepress-site/docs/public/`
- Always use lower case paths and file names for images and assets in VitePress

**VitePress images (Target):**

- ALWAYS use the `<ResponsiveImage>` component for including images with captions and zoom functionality, for example:
   ```markdown
   <ResponsiveImage
   src="./unblock-butler-sos-windows-1.png"
   alt="Unblocking the Butler SOS zip file on Windows Server"
   caption="Unblocking the Butler SOS zip file on Windows Server"
   maxWidth="450px"
   />
   ```

**VitePress alerts (Target):**
- VitePress uses `::: info`, `::: tip`, `::: warning`, `::: danger` blocks for callouts, where Hugo uses shortcodes.
  For example:
   ```markdown
   ::: info
   This is an informational message.
   :::
   ```
   ``` markdown
   :::tip
   This is a tip message.
   :::
   ```
   ```markdown
   ::: warning
   This is a warning message.
   :::
   ```
   ```markdown
   ::: danger
   This is a danger message.
   :::
   ```



## Build Details

**Hugo System (Current - Legacy):**

- **Hugo Version**: Extended version required for Docsy theme
- **Theme**: Docsy via Git submodules
- **Build Output**: Static files in `/docs` directory
- **Hot Reload**: Available via hugo server

**VitePress System (Target - Future):**

- **Node Version**: Requires Node.js 18+
- **Package Manager**: npm (package-lock.json present)
- **Build Time**: 10-30 seconds depending on content size
- **Dev Server**: Hot reload enabled, typically starts in 2-5 seconds
- **Build Output**: Static files in `/vitepress-site/docs/.vitepress/dist`
- **Dependencies**:
  - VitePress 1.6.4+ (static site generator)
  - Vue 3.5+ (component framework)
  - Mermaid 11+ (diagram rendering)
  - vitepress-plugin-mermaid 2+ (Mermaid integration)
  - vitepress-openapi (API documentation)
  - swagger-ui-dist and swagger-ui-react (OpenAPI rendering)
- **Version Fetching**: Automatic Butler SOS version fetching from GitHub via pre:version script
- **Caching**: VitePress uses `.vitepress/cache` for faster rebuilds

## Migration Strategy

**Key Steps for Hugo to VitePress Migration:**

1. **Create VitePress structure**:
   - Create `/vitepress-site` directory
   - Set up package.json with VitePress dependencies
   - Create `/vitepress-site/docs/.vitepress/config.ts` for site configuration

2. **Content migration**:
   - Convert Hugo content from `/content/en/docs/` to VitePress Markdown in `/vitepress-site/docs/docs/`
   - Update front matter from Hugo format to VitePress format
   - Convert Hugo shortcodes to VitePress custom components or Markdown syntax
   - Reorganize content structure as needed for VitePress conventions

3. **Asset migration**:
   - Move static files from `/static/` to `/vitepress-site/docs/public/`
   - Update image references to use VitePress paths (e.g., `/img/...`)
   - Ensure all assets are properly linked

4. **Configuration**:
   - Port navigation structure from `hugo.yaml` to VitePress `config.ts`
   - Set up sidebar configuration
   - Configure theme, search, and plugins
   - Set up version fetching script for Butler SOS

5. **Testing**:
   - Verify all pages render correctly
   - Test navigation and internal links
   - Validate images and assets load properly
   - Check responsive design and mobile view
   - Test build process

6. **Deployment**:
   - Configure GitHub Pages deployment
   - Set up GitHub Actions if needed
   - Test production build and deployment
   - Update DNS/hosting if necessary

**Reference Butler Migration**:

- Butler docs successfully migrated from Hugo to VitePress
- Review Butler's VitePress structure at `/Users/goran/code/butler-docs/vitepress-site/` (if available in workspace)
- Use Butler's copilot instructions as template
- Adapt Butler's scripts and configuration for Butler SOS

## Common Tasks

### Repository Structure (During Migration)

````

butler-sos-docs/
├── README.md
├── VITEPRESS_MIGRATION_SUMMARY.md # Migration documentation (to be created)
├── vitepress-site/ # VitePress documentation (TARGET - to be created)
│ ├── package.json # VitePress dependencies and scripts
│ ├── docs/ # Documentation root
│ │ ├── index.md # Homepage
│ │ ├── .vitepress/ # VitePress configuration
│ │ │ ├── config.ts # Main site configuration
│ │ │ ├── theme/ # Custom theme files
│ │ │ ├── components/ # Vue components
│ │ │ ├── cache/ # Build cache
│ │ │ ├── dist/ # Build output (generated)
│ │ │ └── version.js # Butler SOS version info (generated)
│ │ ├── docs/ # Documentation content
│ │ │ ├── getting-started/
│ │ │ ├── concepts/
│ │ │ ├── examples/
│ │ │ ├── reference/
│ │ │ ├── about/
│ │ │ ├── legal-stuff.md
│ │ │ └── security.md
│ │ └── public/ # Static assets
│ │ ├── img/ # Images
│ │ ├── openapi/ # OpenAPI specifications
│ │ └── favicons/ # Site icons
│ └── scripts/ # Build scripts
│ └── fetch-butler-sos-version.mjs
├── content/ # CURRENT Hugo content
│ └── en/
│ └── docs/
├── static/ # CURRENT Hugo static files
├── docs/ # CURRENT Hugo build output
├── hugo.yaml # CURRENT Hugo config
├── hugo.\_toml # CURRENT Hugo config
└── themes/ # CURRENT Hugo themes (submodules)

```

### Key Commands

**Hugo System (Current - Legacy):**

- `hugo server --disableFastRender` - Start development server with hot reload at http://localhost:1313
- `hugo -e production --baseURL https://butler-sos.ptarmiganlabs.com` - Build production site

**VitePress System (Target - all commands run from `/vitepress-site` directory):**

- `npm install` - Install all dependencies (10-20 seconds)
- `npm run pre:version` - Fetch current Butler SOS version from GitHub
- `npm run dev` - Start development server with hot reload at http://localhost:5173 (includes pre:version)
- `npm run build` - Build production static site to `docs/.vitepress/dist` (includes pre:version)
- `npm run serve` - Preview production build locally (includes pre:version)
- `npm run deploy` - Build and deploy to GitHub Pages gh-pages branch

**Important Notes:**

- Hugo commands run from repository root
- VitePress commands run from `/vitepress-site` directory
- Development server provides instant feedback with hot module replacement
- All VitePress npm scripts automatically fetch Butler SOS version info before running
- Build output is optimized for production with minification and tree-shaking

### Configuration Files

**Hugo System (Current - Legacy):**

- `/hugo.yaml` - Main Hugo configuration
- `/hugo._toml` - Additional Hugo configuration
- `/go.mod` and `/go.sum` - Go module dependencies

**VitePress System (Target - Future):**

- `/vitepress-site/package.json` - Dependencies and npm scripts
- `/vitepress-site/docs/.vitepress/config.ts` - Main site configuration (navigation, theme, plugins)
- `/vitepress-site/docs/.vitepress/theme/index.ts` - Custom theme configuration
- `/vitepress-site/scripts/fetch-butler-sos-version.mjs` - Butler SOS version fetching script
- `/vitepress-site/docs/.vitepress/version.js` - Generated Butler SOS version info (auto-created)

### Content Structure

**Hugo System (Current - Legacy):**

- Content in `/content/en/docs/` directory
- Uses Hugo front matter and shortcodes
- Organized by Hugo conventions

**VitePress System (Target - Future):**

The site will use a nested directory structure in `/vitepress-site/docs/docs/`:

- `getting-started/` - Installation and setup guides
- `concepts/` - Feature explanations and architectural concepts
- `examples/` - Usage examples and tutorials
- `reference/` - API documentation, configuration reference, and technical details
- `about/` - Project information, changelog, contributing guidelines
- `security.md` - Security policies and vulnerability reporting

**Content Format (VitePress):**

- All content is in Markdown (.md) files
- Each directory typically has an `index.md` for the section overview
- Front matter includes title, description, and optional custom layout
- Vue components can be embedded directly in Markdown
- Mermaid diagrams supported via fenced code blocks with `mermaid` language tag
- Use the custom component <ResponsiveImage> for including images with captions and zoom functionality

### Common Troubleshooting

**Hugo Issues (Current - Legacy):**

- **Theme not loading**: Check Git submodules are initialized: `git submodule update --init --recursive`
- **Build fails**: Ensure Hugo extended version is installed
- **Changes don't appear**: Hugo server should hot reload, but sometimes requires restart
- **Assets not loading**: Check paths in `/static/` directory

**VitePress Issues (Target - Future):**

- **Build fails with dependency errors**: Run `npm install` to ensure all dependencies are installed
- **Dev server won't start**: Check that port 5173 is not already in use
- **Changes don't appear**: VitePress has hot reload, but sometimes requires browser refresh
- **Version info missing**: Run `npm run pre:version` manually to fetch Butler SOS version
- **Build output empty**: Check for errors in config.ts or content front matter syntax
- **Images not loading**: Ensure images are in `/vitepress-site/docs/public/` and referenced with absolute paths (e.g., `/img/...`)
- **Navigation not working**: Verify sidebar configuration in config.ts matches actual file structure
- **Mermaid diagrams not rendering**: Ensure vitepress-plugin-mermaid is configured in config.ts
- **Build takes too long**: Clear cache directory: `rm -rf /vitepress-site/docs/.vitepress/cache`
- **Module not found errors**: Delete node_modules and package-lock.json, then run `npm install`

**General Tips:**

- During migration, test both Hugo and VitePress builds
- Always run VitePress commands from `/vitepress-site` directory
- Check browser console for client-side errors
- Use `npm run build` to catch production-only issues
- Review VitePress documentation at https://vitepress.dev for advanced troubleshooting
- Reference Butler docs migration for similar issues and solutions

## Important Notes

**During Migration:**

- **Current System**: Hugo is still the active documentation system
- **Migration Target**: VitePress will become the production system
- **Parallel Systems**: Both may coexist during migration period
- **Reference Project**: Butler docs has completed this migration successfully
- **Production Site**: Currently builds from Hugo, will transition to VitePress

**Post-Migration (Future State):**

- **Production System**: VitePress will be the only active documentation system
- **Legacy Files**: Hugo-related files (content/, static/, docs/, hugo.yaml, go.mod) will remain for reference but not be maintained
- **Production Publishing**: Site will build to `/vitepress-site/docs/.vitepress/dist` and deploy via gh-pages branch
- **Version Management**: Butler SOS version will be automatically fetched from GitHub before each build/dev/serve command
- **Hot Reload**: Development server provides instant feedback for content and configuration changes
- **Static Assets**: All images, PDFs, and other assets must be in `/vitepress-site/docs/public/`
- **Component Support**: Vue components can be created in `.vitepress/components/` and used in Markdown
- **The main Butler SOS project repository** is separate at github.com/ptarmiganlabs/butler-sos

## Things to Do Every Time Copilot Works on This Project

- **During Migration**: Be aware of whether work should be done in Hugo (legacy) or VitePress (future) structure
- **Update front page**: Update the section on the site's front page where new features in the latest version are highlighted
  - Update the version number if needed
  - Only highlight a few (the most valuable/coolest/important) features, to avoid that section becoming too large
- **Content accuracy**: Ensure documentation accurately reflects the current state of Butler SOS
- **Testing**: Always test changes with the appropriate dev server (Hugo or VitePress)
- **Migration awareness**: Consider how content changes might need to be migrated from Hugo to VitePress

## Editing Content

**Hugo System (Current - Legacy):**

- All content files are in `/content/en/docs/` with Markdown (.md) extension
- Use Hugo shortcodes for special features
- Front matter in YAML format
- Images and assets go in `/static/` directory
- Test with `hugo server --disableFastRender`

**VitePress System (Target - Future):**

- All content files will be in `/vitepress-site/docs/docs/` with Markdown (.md) extension
- Use standard Markdown syntax plus VitePress-specific features
- Front matter includes title, description, and optional layout settings
- Images and assets go in `/vitepress-site/docs/public/` directory
- Reference images with absolute paths: `/img/my-image.png`
- Vue components can be embedded directly in Markdown files
- Mermaid diagrams: Use fenced code blocks with `mermaid` language tag
- Always test content changes with `npm run dev` (from `/vitepress-site`)
- Validation: Start dev server and verify content renders correctly at http://localhost:5173

**VitePress Features:**

- **Custom Containers**: Use `:::tip`, `:::warning`, `:::danger`, `:::info` for callouts
- **Code Groups**: Tab between code examples in different languages
- **Front Matter**: Configure page layout, sidebar, outline depth per page
- **Component Import**: Import and use Vue components anywhere in Markdown
- **Emoji Support**: Use standard emoji syntax 😊
- **Table of Contents**: Automatically generated from headings (configurable depth)

**OpenAPI Documentation (VitePress):**

- OpenAPI specs stored in `/vitepress-site/docs/public/openapi/`
- Rendered using vitepress-openapi plugin
- Configure in `.vitepress/config.ts` to integrate API docs

## Theme Customization

**Hugo System (Current - Legacy):**

- Uses Docsy theme via Git submodules
- Customization via Hugo configuration files
- Custom CSS and overrides in theme directory

**VitePress Theme (Target - Future):**

- Custom theme files in `/vitepress-site/docs/.vitepress/theme/`
- Main theme entry: `theme/index.ts` - imports default theme and applies customizations
- Custom CSS: Add styles in theme directory or import global CSS files
- Custom Vue components: Create in `.vitepress/components/` directory
- Layout customization: Override default VitePress layout components
- Site configuration: Modify `config.ts` for navigation, sidebar, theme colors, etc.
- Custom layouts: Define per-page in front matter using `layout:` field

**Theme Configuration in config.ts:**

- Navigation menu (top nav bar)
- Sidebar structure and grouping
- Social links (GitHub, Twitter, etc.)
- Search integration
- Edit link configuration
- Footer content
- Logo and site title
- Dark mode toggle

**Advanced Customization:**

- Override VitePress default components by creating same-named components in theme directory
- Use Vue's composition API for reactive custom components
- Access site configuration and page data via VitePress composables
- Add custom head tags via config.ts `head` property

```
