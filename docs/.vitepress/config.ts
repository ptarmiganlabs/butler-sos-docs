import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";




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
  ignoreDeadLinks: true, // Set to true to ignore dead links and build anyway. False will fail the build if there are any dead links.
  
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
      { text: 'Guide', link: '/v14.0/' },
      {
        text: 'Version',
        items: [
          { text: 'v15.0 (latest)', link: '/v15.0/' },
          { text: 'v14.0', link: '/v14.0/' },
        ]
      },
      {
        text: 'Resources',
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
      '/v14.0/': [
        {
          text: 'About',
          collapsed: false,
          items: [
            { text: 'Butler SOS', link: '/v14.0/about/' },
            { text: 'Butler Family', link: '/v14.0/about/butler-family' },
            { text: 'Use Cases', link: '/v14.0/about/use-cases/' },
            { text: 'Versioning', link: '/v14.0/about/versioning' },
            { text: 'Contributing', link: '/v14.0/about/contributing' },
            { text: 'Telemetry', link: '/v14.0/about/telemetry' },
            { text: 'Security Considerations', link: '/v14.0/security' }
          ]
        },
        {
          text: 'Getting Started',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v14.0/getting-started/' },
            {
              text: 'Installation',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/getting-started/install/' },
                { text: 'Choose Platform', link: '/v14.0/getting-started/install/choose-platform' },
                { text: 'Docker', link: '/v14.0/getting-started/install/docker' },
                { text: 'Windows', link: '/v14.0/getting-started/install/windows' },
                { text: 'Linux & macOS', link: '/v14.0/getting-started/install/linux-macos' },
                { text: 'InfluxDB & Grafana', link: '/v14.0/getting-started/install/influxdb-grafana' },
                { text: 'Prometheus & Grafana', link: '/v14.0/getting-started/install/prometheus-grafana' }
              ]
            },
            {
              text: 'Setup',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/getting-started/setup/' },
                { text: 'Which Config File', link: '/v14.0/getting-started/setup/which-config-file' },
                { text: 'Verify Config File', link: '/v14.0/getting-started/setup/verify-config-file' },
                { text: 'Config Visualization', link: '/v14.0/getting-started/setup/config-visualization' },
                { text: 'Logging', link: '/v14.0/getting-started/setup/logging' },
                { text: 'Crash Dump', link: '/v14.0/getting-started/setup/crash-dump' },
                { text: 'Heartbeats', link: '/v14.0/getting-started/setup/heartbeats' },
                { text: 'Docker Healthcheck', link: '/v14.0/getting-started/setup/docker-healthcheck' },
                { text: 'Uptime Monitor', link: '/v14.0/getting-started/setup/uptime-monitor' },
                { text: 'Credentials', link: '/v14.0/getting-started/setup/credentials' },
                { text: 'Sense Server Settings', link: '/v14.0/getting-started/setup/sense-server-settings' },
                { text: 'Audit Screenshots', link: '/v14.0/getting-started/setup/audit-screenshots' },
                {
                  text: 'Qlik Sense Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v14.0/getting-started/setup/qlik-sense-events/' },
                    { text: 'Log Events', link: '/v14.0/getting-started/setup/qlik-sense-events/log-events' },
                    { text: 'Performance Log Events', link: '/v14.0/getting-started/setup/qlik-sense-events/performance-log-events' },
                    { text: 'User Events', link: '/v14.0/getting-started/setup/qlik-sense-events/user-events' }
                  ]
                },
                { text: 'MQTT', link: '/v14.0/getting-started/setup/mqtt' },
                { text: 'Prometheus', link: '/v14.0/getting-started/setup/prometheus' },
                { text: 'InfluxDB', link: '/v14.0/getting-started/setup/influxdb' },
                { text: 'New Relic', link: '/v14.0/getting-started/setup/new-relic' },
                { text: 'App Names', link: '/v14.0/getting-started/setup/app-names' },
                { text: 'User Sessions', link: '/v14.0/getting-started/setup/user-sessions' },
                { text: 'Servers to Monitor', link: '/v14.0/getting-started/setup/servers-to-monitor' },
                { text: 'Telemetry', link: '/v14.0/getting-started/setup/telemetry' },
                { text: 'Error Tracking', link: '/v14.0/getting-started/setup/error-tracking' },
                { text: 'Log DB (Deprecated)', link: '/v14.0/getting-started/setup/log-db' }
              ]
            },
            { text: 'Operations', link: '/v14.0/getting-started/operations/' },
            { text: 'Upgrade', link: '/v14.0/getting-started/upgrade' }
          ]
        },
        {
          text: 'Concepts',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v14.0/concepts/' },
            { text: 'App Metrics', link: '/v14.0/concepts/app%20metrics/' },
            { text: 'Sessions & Connections', link: '/v14.0/concepts/sessions%20connections/' },
            { text: 'Audit.qs', link: '/v14.0/concepts/audit-qs' },
            {
              text: 'Monitoring',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/concepts/monitoring/' },
                { text: 'Health Metrics', link: '/v14.0/concepts/monitoring/health-metrics' },
                { text: 'Failed Polls', link: '/v14.0/concepts/monitoring/failed-polls' },
                { text: 'User Sessions', link: '/v14.0/concepts/monitoring/user-sessions' },
                { text: 'User Events', link: '/v14.0/concepts/monitoring/user-events' },
                { text: 'UDP Message Queue', link: '/v14.0/concepts/monitoring/udp-queue' },
                {
                  text: 'Log Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v14.0/concepts/monitoring/log-events/' },
                    { text: 'App Performance Monitoring', link: '/v14.0/concepts/monitoring/log-events/app%20object%20performance%20monitoring/' },
                    { text: 'Categorizing Log Events', link: '/v14.0/concepts/monitoring/log-events/catgorising%20log%20events/' },
                    { text: 'Errors & Warnings', link: '/v14.0/concepts/monitoring/log-events/errors%20warnings/' }
                  ]
                },
                { text: 'Audit.qs Events', link: '/v14.0/concepts/monitoring/audit-qs-events' },
              ]
            },
            {
              text: 'Data Destinations',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/concepts/data-destinations/' },
                { text: 'InfluxDB', link: '/v14.0/concepts/data-destinations/influxdb' },
                { text: 'Prometheus', link: '/v14.0/concepts/data-destinations/prometheus' },
                { text: 'New Relic', link: '/v14.0/concepts/data-destinations/new-relic' },
                { text: 'MQTT', link: '/v14.0/concepts/data-destinations/mqtt' }
              ]
            },
            {
              text: 'Misc features',
              collapsed: true,
              items: [
                { text: 'Heartbeats', link: '/v14.0/concepts/features/heartbeats' },
                { text: 'Uptime Monitor', link: '/v14.0/concepts/features/uptime-monitor' },
                { text: 'Telemetry', link: '/v14.0/concepts/features/telemetry' },
                { text: 'Config Visualization', link: '/v14.0/concepts/features/config-visualization' },
                { text: 'Error Tracking', link: '/v14.0/concepts/features/error-tracking' },
                { text: 'Crash Dump', link: '/v14.0/concepts/features/crash-dump' },
                { text: 'Build Security', link: '/v14.0/concepts/build-security' }
              ]
            }
          ]
        },
        {
          text: 'Examples',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v14.0/examples/' },
            { text: 'Docker Compose Stack', link: '/v14.0/examples/docker-compose-stack' },
            {
              text: 'Grafana Dashboards',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/examples/grafana/' },
                { text: 'Grafana 9', link: '/v14.0/examples/grafana/grafana-9' },
                { text: 'Grafana 8', link: '/v14.0/examples/grafana/grafana-8' },
                { text: 'Grafana 7', link: '/v14.0/examples/grafana/grafana-7' },
                { text: 'Grafana 6', link: '/v14.0/examples/grafana/grafana-6' }
              ]
            },
            { text: 'New Relic Dashboards', link: '/v14.0/examples/new-relic-dashboards' },
            { text: 'Count User/Log Events', link: '/v14.0/examples/count-user-log-events' },
            {
              text: 'Engine Performance',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/examples/engine-performance/' },
                { text: 'App Open Time', link: '/v14.0/examples/engine-performance/app-open-time' },
                { text: 'Find Slow Charts', link: '/v14.0/examples/engine-performance/find-slow-charts' }
              ]
            }
          ]
        },
        {
          text: 'Reference',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v14.0/reference/' },
            { text: 'Command Line Options', link: '/v14.0/reference/command-line-options' },
            { text: 'Config File Format', link: '/v14.0/reference/config-file-format' },
            { text: 'UDP Payload Format', link: '/v14.0/reference/udp-payload-format' },
            {
              text: 'Audit Events',
              collapsed: true,
              items: [
                { text: 'API', link: '/v14.0/reference/audit-events-api' },
                { text: 'Rate Limiting', link: '/v14.0/reference/audit-events-rate-limiting' },
                { text: 'Version Compatibility', link: '/v14.0/reference/audit-qs-version-compatibility' },
                {
                  text: 'Destinations',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v14.0/reference/audit-destinations/' },
                    { text: 'InfluxDB', link: '/v14.0/reference/audit-destinations/influxdb/' },
                    {
                      text: 'JSON',
                      collapsed: true,
                      items: [
                        { text: 'Overview', link: '/v14.0/reference/audit-destinations/json/' },
                        { text: 'Object Data', link: '/v14.0/reference/audit-destinations/json/object-data' }
                      ]
                    },
                    { text: 'Parquet', link: '/v14.0/reference/audit-destinations/parquet/' },
                    {
                      text: 'PNG',
                      collapsed: true,
                      items: [
                        { text: 'Overview', link: '/v14.0/reference/audit-destinations/png/' },
                        { text: 'Screenshot Downloads', link: '/v14.0/reference/audit-destinations/png/downloads' }
                      ]
                    },
                    { text: 'QVD', link: '/v14.0/reference/audit-destinations/qvd/' }
                  ]
                }
              ]
            },
            {
              text: 'Available Metrics',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v14.0/reference/available-metrics/' },
                { text: 'InfluxDB Metrics', link: '/v14.0/reference/available-metrics/influxdb' },
                { text: 'Failed Polls', link: '/v14.0/reference/available-metrics/failed-polls' },
                { text: 'Prometheus Metrics', link: '/v14.0/reference/available-metrics/prometheus' },
                { text: 'New Relic', link: '/v14.0/reference/available-metrics/new-relic' }
              ]
            }
          ]
        },
        {
          text: 'Legal Stuff',
          collapsed: true,
          items: [
            { text: 'Legal Information', link: '/v14.0/legal-stuff' }
          ]
        }
      ],
      '/v15.0/': [
        {
          text: 'About',
          collapsed: false,
          items: [
            { text: 'Butler SOS', link: '/v15.0/about/' },
            { text: 'Butler Family', link: '/v15.0/about/butler-family' },
            { text: 'Use Cases', link: '/v15.0/about/use-cases/' },
            { text: 'Versioning', link: '/v15.0/about/versioning' },
            { text: 'Contributing', link: '/v15.0/about/contributing' },
            { text: 'Telemetry', link: '/v15.0/about/telemetry' },
            { text: 'Security Considerations', link: '/v15.0/security' }
          ]
        },
        {
          text: 'Getting Started',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v15.0/getting-started/' },
            {
              text: 'Installation',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/getting-started/install/' },
                { text: 'Choose Platform', link: '/v15.0/getting-started/install/choose-platform' },
                { text: 'Docker', link: '/v15.0/getting-started/install/docker' },
                { text: 'Windows', link: '/v15.0/getting-started/install/windows' },
                { text: 'Linux & macOS', link: '/v15.0/getting-started/install/linux-macos' },
                { text: 'InfluxDB & Grafana', link: '/v15.0/getting-started/install/influxdb-grafana' },
                { text: 'Prometheus & Grafana', link: '/v15.0/getting-started/install/prometheus-grafana' }
              ]
            },
            {
              text: 'Setup',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/getting-started/setup/' },
                { text: 'Which Config File', link: '/v15.0/getting-started/setup/which-config-file' },
                { text: 'Verify Config File', link: '/v15.0/getting-started/setup/verify-config-file' },
                { text: 'Config Visualization', link: '/v15.0/getting-started/setup/config-visualization' },
                { text: 'Logging', link: '/v15.0/getting-started/setup/logging' },
                { text: 'Crash Dump', link: '/v15.0/getting-started/setup/crash-dump' },
                { text: 'Heartbeats', link: '/v15.0/getting-started/setup/heartbeats' },
                { text: 'Docker Healthcheck', link: '/v15.0/getting-started/setup/docker-healthcheck' },
                { text: 'Uptime Monitor', link: '/v15.0/getting-started/setup/uptime-monitor' },
                { text: 'Credentials', link: '/v15.0/getting-started/setup/credentials' },
                { text: 'Sense Server Settings', link: '/v15.0/getting-started/setup/sense-server-settings' },
                { text: 'Audit Screenshots', link: '/v15.0/getting-started/setup/audit-screenshots' },
                {
                  text: 'Qlik Sense Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v15.0/getting-started/setup/qlik-sense-events/' },
                    { text: 'Log Events', link: '/v15.0/getting-started/setup/qlik-sense-events/log-events' },
                    { text: 'Performance Log Events', link: '/v15.0/getting-started/setup/qlik-sense-events/performance-log-events' },
                    { text: 'User Events', link: '/v15.0/getting-started/setup/qlik-sense-events/user-events' }
                  ]
                },
                { text: 'MQTT', link: '/v15.0/getting-started/setup/mqtt' },
                { text: 'Prometheus', link: '/v15.0/getting-started/setup/prometheus' },
                { text: 'InfluxDB', link: '/v15.0/getting-started/setup/influxdb' },
                { text: 'New Relic', link: '/v15.0/getting-started/setup/new-relic' },
                { text: 'App Names', link: '/v15.0/getting-started/setup/app-names' },
                { text: 'User Sessions', link: '/v15.0/getting-started/setup/user-sessions' },
                { text: 'Servers to Monitor', link: '/v15.0/getting-started/setup/servers-to-monitor' },
                { text: 'Telemetry', link: '/v15.0/getting-started/setup/telemetry' },
                { text: 'Error Tracking', link: '/v15.0/getting-started/setup/error-tracking' },
                { text: 'Log DB (Deprecated)', link: '/v15.0/getting-started/setup/log-db' }
              ]
            },
            { text: 'Operations', link: '/v15.0/getting-started/operations/' },
            { text: 'Upgrade', link: '/v15.0/getting-started/upgrade' }
          ]
        },
        {
          text: 'Concepts',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v15.0/concepts/' },
            { text: 'App Metrics', link: '/v15.0/concepts/app%20metrics/' },
            { text: 'Sessions & Connections', link: '/v15.0/concepts/sessions%20connections/' },
            { text: 'Audit.qs', link: '/v15.0/concepts/audit-qs' },
            {
              text: 'Monitoring',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/concepts/monitoring/' },
                { text: 'Health Metrics', link: '/v15.0/concepts/monitoring/health-metrics' },
                { text: 'Failed Polls', link: '/v15.0/concepts/monitoring/failed-polls' },
                { text: 'User Sessions', link: '/v15.0/concepts/monitoring/user-sessions' },
                { text: 'User Events', link: '/v15.0/concepts/monitoring/user-events' },
                { text: 'UDP Message Queue', link: '/v15.0/concepts/monitoring/udp-queue' },
                {
                  text: 'Log Events',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v15.0/concepts/monitoring/log-events/' },
                    { text: 'App Performance Monitoring', link: '/v15.0/concepts/monitoring/log-events/app%20object%20performance%20monitoring/' },
                    { text: 'Categorizing Log Events', link: '/v15.0/concepts/monitoring/log-events/catgorising%20log%20events/' },
                    { text: 'Errors & Warnings', link: '/v15.0/concepts/monitoring/log-events/errors%20warnings/' }
                  ]
                },
                { text: 'Audit.qs Events', link: '/v15.0/concepts/monitoring/audit-qs-events' },
              ]
            },
            {
              text: 'Data Destinations',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/concepts/data-destinations/' },
                { text: 'InfluxDB', link: '/v15.0/concepts/data-destinations/influxdb' },
                { text: 'Prometheus', link: '/v15.0/concepts/data-destinations/prometheus' },
                { text: 'New Relic', link: '/v15.0/concepts/data-destinations/new-relic' },
                { text: 'MQTT', link: '/v15.0/concepts/data-destinations/mqtt' }
              ]
            },
            {
              text: 'Misc features',
              collapsed: true,
              items: [
                { text: 'Heartbeats', link: '/v15.0/concepts/features/heartbeats' },
                { text: 'Uptime Monitor', link: '/v15.0/concepts/features/uptime-monitor' },
                { text: 'Telemetry', link: '/v15.0/concepts/features/telemetry' },
                { text: 'Config Visualization', link: '/v15.0/concepts/features/config-visualization' },
                { text: 'Error Tracking', link: '/v15.0/concepts/features/error-tracking' },
                { text: 'Crash Dump', link: '/v15.0/concepts/features/crash-dump' },
                { text: 'Build Security', link: '/v15.0/concepts/build-security' }
              ]
            }
          ]
        },
        {
          text: 'Examples',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v15.0/examples/' },
            { text: 'Docker Compose Stack', link: '/v15.0/examples/docker-compose-stack' },
            {
              text: 'Grafana Dashboards',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/examples/grafana/' },
                { text: 'Grafana 9', link: '/v15.0/examples/grafana/grafana-9' },
                { text: 'Grafana 8', link: '/v15.0/examples/grafana/grafana-8' },
                { text: 'Grafana 7', link: '/v15.0/examples/grafana/grafana-7' },
                { text: 'Grafana 6', link: '/v15.0/examples/grafana/grafana-6' }
              ]
            },
            { text: 'New Relic Dashboards', link: '/v15.0/examples/new-relic-dashboards' },
            { text: 'Count User/Log Events', link: '/v15.0/examples/count-user-log-events' },
            {
              text: 'Engine Performance',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/examples/engine-performance/' },
                { text: 'App Open Time', link: '/v15.0/examples/engine-performance/app-open-time' },
                { text: 'Find Slow Charts', link: '/v15.0/examples/engine-performance/find-slow-charts' }
              ]
            }
          ]
        },
        {
          text: 'Reference',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/v15.0/reference/' },
            { text: 'Command Line Options', link: '/v15.0/reference/command-line-options' },
            { text: 'Config File Format', link: '/v15.0/reference/config-file-format' },
            { text: 'UDP Payload Format', link: '/v15.0/reference/udp-payload-format' },
            {
              text: 'Audit Events',
              collapsed: true,
              items: [
                { text: 'API', link: '/v15.0/reference/audit-events-api' },
                { text: 'Rate Limiting', link: '/v15.0/reference/audit-events-rate-limiting' },
                { text: 'Version Compatibility', link: '/v15.0/reference/audit-qs-version-compatibility' },
                {
                  text: 'Destinations',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/v15.0/reference/audit-destinations/' },
                    { text: 'InfluxDB', link: '/v15.0/reference/audit-destinations/influxdb/' },
                    {
                      text: 'JSON',
                      collapsed: true,
                      items: [
                        { text: 'Overview', link: '/v15.0/reference/audit-destinations/json/' },
                        { text: 'Object Data', link: '/v15.0/reference/audit-destinations/json/object-data' }
                      ]
                    },
                    { text: 'Parquet', link: '/v15.0/reference/audit-destinations/parquet/' },
                    {
                      text: 'PNG',
                      collapsed: true,
                      items: [
                        { text: 'Overview', link: '/v15.0/reference/audit-destinations/png/' },
                        { text: 'Screenshot Downloads', link: '/v15.0/reference/audit-destinations/png/downloads' }
                      ]
                    },
                    { text: 'QVD', link: '/v15.0/reference/audit-destinations/qvd/' }
                  ]
                }
              ]
            },
            {
              text: 'Available Metrics',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/v15.0/reference/available-metrics/' },
                { text: 'InfluxDB Metrics', link: '/v15.0/reference/available-metrics/influxdb' },
                { text: 'Failed Polls', link: '/v15.0/reference/available-metrics/failed-polls' },
                { text: 'Prometheus Metrics', link: '/v15.0/reference/available-metrics/prometheus' },
                { text: 'New Relic', link: '/v15.0/reference/available-metrics/new-relic' }
              ]
            }
          ]
        },
        {
          text: 'Legal Stuff',
          collapsed: true,
          items: [
            { text: 'Legal Information', link: '/v15.0/legal-stuff' }
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
