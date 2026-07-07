# Codebase Wiki

Butler SOS includes an automatically generated wiki that provides compact, effective documentation of the codebase. The wiki is designed for both humans and coding agents who need to understand how Butler SOS works internally.

## Accessing the Wiki

The wiki is hosted in the Butler SOS repository on GitHub:

- **Quickstart**: https://github.com/ptarmiganlabs/butler-sos/blob/master/openwiki/quickstart.md
- **Full wiki directory**: https://github.com/ptarmiganlabs/butler-sos/tree/master/openwiki

## Wiki Contents

The wiki consists of six focused pages:

| Page | Coverage |
|------|----------|
| **Quickstart** | Overview, core capabilities, data destinations, project structure, key design patterns |
| **Architecture** | System architecture, data flow, entry points |
| **Domain** | Qlik Sense monitoring concepts, audit events, destinations |
| **Configuration** | YAML config system, JSON Schema validation |
| **Operations** | Docker, binary builds, releases, Grafana |
| **Testing** | Testing patterns, coverage, conventions |

## Purpose

The wiki serves two main audiences:

1. **Humans** — Developers who want to understand the Butler SOS codebase, contribute to the project, or debug issues.
2. **Coding agents** — AI assistants and automated tools that need context about the codebase structure, patterns, and conventions.

Unlike this documentation site (which focuses on _using_ Butler SOS), the wiki focuses on _understanding and modifying_ the code itself.

## When to Use the Wiki

- You want to contribute code to Butler SOS
- You're debugging an issue and need to understand internal data flow
- You're using an AI coding assistant and need to provide it with codebase context
- You want to understand the design decisions and patterns used in the project
- You're planning a feature that requires understanding the architecture

## When to Use This Documentation Site

- You want to install, configure, or operate Butler SOS
- You need reference information about config files, metrics, or API endpoints
- You're looking for examples and tutorials
- You want to understand what Butler SOS does (not how it does it)
