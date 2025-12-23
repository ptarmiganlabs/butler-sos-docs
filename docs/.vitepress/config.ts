import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";


// Generated at build time by scripts/fetch-butler-sos-version.mjs
import { version as butlerSOSVersion } from "./version.js";



// https://vitepress.vuejs.org/config/app-configs
export default withMermaid({
// export default defineConfig({
  title: 'Butler SOS',
  description: 'Butler SOS documentation',
  base: '/',
  lang: "en-US",
  cleanUrls: true,
  sitemap: {
    hostname: "https://butler-sos.ptarmiganlabs.com",
  },
  ignoreDeadLinks: false, // Set to true to ignore dead links and build anyway. False will fail the build if there are any dead links.
  
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      { property: "og:title", content: "Butler SOS Documentation" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "Real-time monitoring for Qlik Sense Enterprise on Windows",
      },
    ],
    [
      "script",
      {
        defer: "",
        "data-domain": "butler-sos.ptarmiganlabs.com",
        src: "https://plausible.io/js/script.file-downloads.outbound-links.js",
      },
    ],
    [
      "script",
      {},
      `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
    ],

    // Root-level favicons copied to docs/public
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    // Additional platform icons under /favicons
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon-180x180.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/pwa-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicons/pwa-512x512.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#aa0000' }]
  ],

  // Enable Vue component processing
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['vitepress-openapi']
    }
  },

  themeConfig: {
    // https://vitepress.vuejs.org/config/theme-configs
  // Logo served from docs/public
  logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/docs/' },
      { 
        text: butlerSOSVersion,
        items: [
          {
            text: "Downloads",
            link: "https://github.com/ptarmiganlabs/butler-sos/releases",
          },
          {
            text: "Issues",
            link: "https://github.com/ptarmiganlabs/butler-sos/issues",
          },
          {
            text: "Discussions",
            link: "https://github.com/ptarmiganlabs/butler-sos/discussions",
          },
          {
            text: "Ptarmigan Labs main site",
            link: "https://ptarmiganlabs.com",
          },
        ]
      },
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'About',
          collapsed: false,
          items: [
            { text: 'Butler SOS', link: '/docs/about/' },
            { text: 'Butler Family', link: '/docs/about/butler-family' },
            { text: 'Use Cases', link: '/docs/about/use-cases/' },
            { text: 'Versioning', link: '/docs/about/versioning' },
            { text: 'Contributing', link: '/docs/about/contributing' },
            { text: 'Telemetry', link: '/docs/about/telemetry' },
            { text: 'Security Considerations', link: '/docs/security' }
          ]
        },
        {
          text: 'Getting Started',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/docs/getting-started/' },
            {
              text: 'Installation',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/getting-started/install/' },
                { text: 'Choose Platform', link: '/docs/getting-started/install/choose-platform' },
                { text: 'Docker', link: '/docs/getting-started/install/docker' },
                { text: 'Windows', link: '/docs/getting-started/install/windows' },
                { text: 'Linux & macOS', link: '/docs/getting-started/install/linux-macos' },
                { text: 'InfluxDB & Grafana', link: '/docs/getting-started/install/influxdb-grafana' },
                { text: 'Prometheus & Grafana', link: '/docs/getting-started/install/prometheus-grafana' }
              ]
            },
            {
              text: 'Setup',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/getting-started/setup/' },
                { text: 'Which Config File', link: '/docs/getting-started/setup/which-config-file' },
                { text: 'Verify Config File', link: '/docs/getting-started/setup/verify-config-file' },
                { text: 'Config Visualization', link: '/docs/getting-started/setup/config-visualization' },
                { text: 'Logging', link: '/docs/getting-started/setup/logging' },
                { text: 'Heartbeats', link: '/docs/getting-started/setup/heartbeats' },
                { text: 'Docker Healthcheck', link: '/docs/getting-started/setup/docker-healthcheck' },
                { text: 'Uptime Monitor', link: '/docs/getting-started/setup/uptime-monitor' },
                { text: 'Credentials', link: '/docs/getting-started/setup/credentials' },
                { text: 'Sense Server Settings', link: '/docs/getting-started/setup/sense-server-settings' },
                {
                  text: 'Qlik Sense Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/docs/getting-started/setup/qlik-sense-events/' },
                    { text: 'Log Events', link: '/docs/getting-started/setup/qlik-sense-events/log-events' },
                    { text: 'Performance Log Events', link: '/docs/getting-started/setup/qlik-sense-events/performance-log-events' },
                    { text: 'User Events', link: '/docs/getting-started/setup/qlik-sense-events/user-events' }
                  ]
                },
                { text: 'MQTT', link: '/docs/getting-started/setup/mqtt' },
                { text: 'Prometheus', link: '/docs/getting-started/setup/prometheus' },
                { text: 'InfluxDB', link: '/docs/getting-started/setup/influxdb' },
                { text: 'New Relic', link: '/docs/getting-started/setup/new-relic' },
                { text: 'App Names', link: '/docs/getting-started/setup/app-names' },
                { text: 'User Sessions', link: '/docs/getting-started/setup/user-sessions' },
                { text: 'Servers to Monitor', link: '/docs/getting-started/setup/servers-to-monitor' },
                { text: 'Telemetry', link: '/docs/getting-started/setup/telemetry' },
                { text: 'Log DB (Deprecated)', link: '/docs/getting-started/setup/log-db' }
              ]
            },
            { text: 'Operations', link: '/docs/getting-started/operations/' },
            { text: 'Upgrade', link: '/docs/getting-started/upgrade' }
          ]
        },
        {
          text: 'Concepts',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/docs/concepts/' },
            { text: 'App Metrics', link: '/docs/concepts/app%20metrics/' },
            { text: 'Sessions & Connections', link: '/docs/concepts/sessions%20connections/' },
            {
              text: 'Monitoring',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/concepts/monitoring/' },
                { text: 'Health Metrics', link: '/docs/concepts/monitoring/health-metrics' },
                { text: 'User Sessions', link: '/docs/concepts/monitoring/user-sessions' },
                { text: 'User Events', link: '/docs/concepts/monitoring/user-events' },
                {
                  text: 'Log Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/docs/concepts/monitoring/log-events/log%20events%20overview/' },
                    { text: 'App Performance Monitoring', link: '/docs/concepts/monitoring/log-events/app%20object%20performance%20monitoring/' },
                    { text: 'Categorizing Log Events', link: '/docs/concepts/monitoring/log-events/catgorising%20log%20events/' },
                    { text: 'Errors & Warnings', link: '/docs/concepts/monitoring/log-events/errors%20warnings/' }
                  ]
                }
              ]
            },
            {
              text: 'Data Destinations',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/concepts/data-destinations/' },
                { text: 'InfluxDB', link: '/docs/concepts/data-destinations/influxdb' },
                { text: 'Prometheus', link: '/docs/concepts/data-destinations/prometheus' },
                { text: 'New Relic', link: '/docs/concepts/data-destinations/new-relic' },
                { text: 'MQTT', link: '/docs/concepts/data-destinations/mqtt' }
              ]
            },
            {
              text: 'Features',
              collapsed: true,
              items: [
                { text: 'Heartbeats', link: '/docs/concepts/features/heartbeats' },
                { text: 'Uptime Monitor', link: '/docs/concepts/features/uptime-monitor' },
                { text: 'Telemetry', link: '/docs/concepts/features/telemetry' },
                { text: 'Config Visualization', link: '/docs/concepts/features/config-visualization' }
              ]
            }
          ]
        },
        {
          text: 'Examples',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/docs/examples/' },
            { text: 'Docker Compose Stack', link: '/docs/examples/docker-compose-stack' },
            {
              text: 'Grafana Dashboards',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/examples/grafana/' },
                { text: 'Grafana 9', link: '/docs/examples/grafana/grafana-9' },
                { text: 'Grafana 8', link: '/docs/examples/grafana/grafana-8' },
                { text: 'Grafana 7', link: '/docs/examples/grafana/grafana-7' },
                { text: 'Grafana 6', link: '/docs/examples/grafana/grafana-6' }
              ]
            },
            { text: 'New Relic Dashboards', link: '/docs/examples/new-relic-dashboards' },
            { text: 'Count User/Log Events', link: '/docs/examples/count-user-log-events' },
            {
              text: 'Engine Performance',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/examples/engine-performance/' },
                { text: 'App Open Time', link: '/docs/examples/engine-performance/app-open-time' },
                { text: 'Find Slow Charts', link: '/docs/examples/engine-performance/find-slow-charts' }
              ]
            }
          ]
        },
        {
          text: 'Reference',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/docs/reference/' },
            { text: 'Command Line Options', link: '/docs/reference/command-line-options' },
            { text: 'Config File Format', link: '/docs/reference/config-file-format' },
            { text: 'Troubleshooting', link: '/docs/reference/troubleshooting' },
            {
              text: 'Available Metrics',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/docs/reference/available-metrics/' },
                { text: 'InfluxDB Metrics', link: '/docs/reference/available-metrics/influxdb' },
                { text: 'Prometheus Metrics', link: '/docs/reference/available-metrics/prometheus' },
                { text: 'New Relic', link: '/docs/reference/available-metrics/new-relic' }
              ]
            }
          ]
        },
        {
          text: 'Legal Stuff',
          collapsed: true,
          items: [
            { text: 'Legal Information', link: '/docs/legal-stuff' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ptarmiganlabs/butler-sos' }
    ],

  footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2018–2025 Ptarmigan Labs AB'
    },

    search: {
      provider: "local",
    },

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },


  }
})
