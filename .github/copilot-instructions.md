---
applyTo: '**'
---

# Overview

This project contains a documentation site for Butler SOS, https://github.com/ptarmiganlabs/butler-sos.

The site is build using Hugo (https://gohugo.io) using the Docsy theme (https://www.docsy.dev).

# Things to do every time CoPilot works on this project

- Update the section on the site's front page where new features in the latest version are highlighted
  - Update the version number if needed
  - Only highlight a few (the most valuable/coolest/important) features, to avoid that section becoming too large

# Building the site

## During development

Use this command to serve the site locally, with hot reloads:

`hugo server --disableFastRender`

## For production

Build a production version of the site:

`hugo -e production --baseURL https://butler-sos.ptarmiganlabs.com`
