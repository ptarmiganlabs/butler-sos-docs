import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

function createSidebar(p: string) {
  return [
    {
      text: 'About',
      collapsed: false,
      items: [
        { text: 'Butler SOS', link: `${p}/about/` },
        { text: 'Butler Family', link: `${p}/about/butler-family` },
        { text: 'Use Cases', link: `${p}/about/use-cases/` },
        { text: 'Versioning', link: `${p}/about/versioning` },
        { text: 'Contributing', link: `${p}/about/contributing` },
        { text: 'Telemetry', link: `${p}/about/telemetry` },
        { text: 'Security Considerations', link: `${p}/security` }
      ]
    },
    {
      text: 'Getting Started',
      collapsed: true,
      items: [
        { text: 'Overview', link: `${p}/getting-started/` },
        {
          text: 'Installation',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/getting-started/install/` },
            { text: 'Choose Platform', link: `${p}/getting-started/install/choose-platform` },
            { text: 'Docker', link: `${p}/getting-started/install/docker` },
            { text: 'Windows', link: `${p}/getting-started/install/windows` },
            { text: 'Linux & macOS', link: `${p}/getting-started/install/linux-macos` },
            { text: 'InfluxDB & Grafana', link: `${p}/getting-started/install/influxdb-grafana` },
            { text: 'Prometheus & Grafana', link: `${p}/getting-started/install/prometheus-grafana` }
          ]
        },
        {
          text: 'Setup',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/getting-started/setup/` },
            { text: 'Which Config File', link: `${p}/getting-started/setup/which-config-file` },
            { text: 'Verify Config File', link: `${p}/getting-started/setup/verify-config-file` },
            { text: 'Config Visualization', link: `${p}/getting-started/setup/config-visualization` },
            { text: 'Logging', link: `${p}/getting-started/setup/logging` },
            { text: 'Crash Dump', link: `${p}/getting-started/setup/crash-dump` },
            { text: 'Heartbeats', link: `${p}/getting-started/setup/heartbeats` },
            { text: 'Docker Healthcheck', link: `${p}/getting-started/setup/docker-healthcheck` },
            { text: 'Uptime Monitor', link: `${p}/getting-started/setup/uptime-monitor` },
            { text: 'Credentials', link: `${p}/getting-started/setup/credentials` },
            { text: 'Sense Server Settings', link: `${p}/getting-started/setup/sense-server-settings` },
            { text: 'Audit Screenshots', link: `${p}/getting-started/setup/audit-screenshots` },
            {
              text: 'Qlik Sense Events',
              collapsed: true,
              items: [
                { text: 'Overview', link: `${p}/getting-started/setup/qlik-sense-events/` },
                { text: 'Log Events', link: `${p}/getting-started/setup/qlik-sense-events/log-events` },
                { text: 'Performance Log Events', link: `${p}/getting-started/setup/qlik-sense-events/performance-log-events` },
                { text: 'User Events', link: `${p}/getting-started/setup/qlik-sense-events/user-events` }
              ]
            },
            { text: 'MQTT', link: `${p}/getting-started/setup/mqtt` },
            { text: 'Prometheus', link: `${p}/getting-started/setup/prometheus` },
            { text: 'InfluxDB', link: `${p}/getting-started/setup/influxdb` },
            { text: 'New Relic', link: `${p}/getting-started/setup/new-relic` },
            { text: 'App Names', link: `${p}/getting-started/setup/app-names` },
            { text: 'User Sessions', link: `${p}/getting-started/setup/user-sessions` },
            { text: 'Servers to Monitor', link: `${p}/getting-started/setup/servers-to-monitor` },
            { text: 'Telemetry', link: `${p}/getting-started/setup/telemetry` },
            { text: 'Error Tracking', link: `${p}/getting-started/setup/error-tracking` },
            { text: 'Log DB (Deprecated)', link: `${p}/getting-started/setup/log-db` }
          ]
        },
        { text: 'Operations', link: `${p}/getting-started/operations/` },
        { text: 'Upgrade', link: `${p}/getting-started/upgrade` }
      ]
    },
    {
      text: 'Concepts',
      collapsed: true,
      items: [
        { text: 'Overview', link: `${p}/concepts/` },
        { text: 'App Metrics', link: `${p}/concepts/app%20metrics/` },
        { text: 'Sessions & Connections', link: `${p}/concepts/sessions%20connections/` },
        { text: 'Audit.qs', link: `${p}/concepts/audit-qs` },
        {
          text: 'Monitoring',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/concepts/monitoring/` },
            { text: 'Health Metrics', link: `${p}/concepts/monitoring/health-metrics` },
            { text: 'Failed Polls', link: `${p}/concepts/monitoring/failed-polls` },
            { text: 'User Sessions', link: `${p}/concepts/monitoring/user-sessions` },
            { text: 'User Events', link: `${p}/concepts/monitoring/user-events` },
            { text: 'UDP Message Queue', link: `${p}/concepts/monitoring/udp-queue` },
            {
              text: 'Log Events',
              collapsed: true,
              items: [
                { text: 'Overview', link: `${p}/concepts/monitoring/log-events/` },
                { text: 'App Performance Monitoring', link: `${p}/concepts/monitoring/log-events/app%20object%20performance%20monitoring/` },
                { text: 'Categorizing Log Events', link: `${p}/concepts/monitoring/log-events/catgorising%20log%20events/` },
                { text: 'Errors & Warnings', link: `${p}/concepts/monitoring/log-events/errors%20warnings/` }
              ]
            },
            { text: 'Audit.qs Events', link: `${p}/concepts/monitoring/audit-qs-events` },
          ]
        },
        {
          text: 'Data Destinations',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/concepts/data-destinations/` },
            { text: 'InfluxDB', link: `${p}/concepts/data-destinations/influxdb` },
            { text: 'Prometheus', link: `${p}/concepts/data-destinations/prometheus` },
            { text: 'New Relic', link: `${p}/concepts/data-destinations/new-relic` },
            { text: 'MQTT', link: `${p}/concepts/data-destinations/mqtt` }
          ]
        },
        {
          text: 'Misc features',
          collapsed: true,
          items: [
            { text: 'Heartbeats', link: `${p}/concepts/features/heartbeats` },
            { text: 'Uptime Monitor', link: `${p}/concepts/features/uptime-monitor` },
            { text: 'Telemetry', link: `${p}/concepts/features/telemetry` },
            { text: 'Config Visualization', link: `${p}/concepts/features/config-visualization` },
            { text: 'Error Tracking', link: `${p}/concepts/features/error-tracking` },
            { text: 'Crash Dump', link: `${p}/concepts/features/crash-dump` },
            { text: 'Build Security', link: `${p}/concepts/build-security` }
          ]
        }
      ]
    },
    {
      text: 'Examples',
      collapsed: true,
      items: [
        { text: 'Overview', link: `${p}/examples/` },
        { text: 'Docker Compose Stack', link: `${p}/examples/docker-compose-stack` },
        {
          text: 'Grafana Dashboards',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/examples/grafana/` },
            { text: 'Grafana 9', link: `${p}/examples/grafana/grafana-9` },
            { text: 'Grafana 8', link: `${p}/examples/grafana/grafana-8` },
            { text: 'Grafana 7', link: `${p}/examples/grafana/grafana-7` },
            { text: 'Grafana 6', link: `${p}/examples/grafana/grafana-6` }
          ]
        },
        { text: 'New Relic Dashboards', link: `${p}/examples/new-relic-dashboards` },
        { text: 'Count User/Log Events', link: `${p}/examples/count-user-log-events` },
        {
          text: 'Engine Performance',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/examples/engine-performance/` },
            { text: 'App Open Time', link: `${p}/examples/engine-performance/app-open-time` },
            { text: 'Find Slow Charts', link: `${p}/examples/engine-performance/find-slow-charts` }
          ]
        }
      ]
    },
    {
      text: 'Reference',
      collapsed: true,
      items: [
        { text: 'Overview', link: `${p}/reference/` },
        { text: 'Command Line Options', link: `${p}/reference/command-line-options` },
        { text: 'Config File Format', link: `${p}/reference/config-file-format` },
        { text: 'UDP Payload Format', link: `${p}/reference/udp-payload-format` },
        {
          text: 'Audit Events',
          collapsed: true,
          items: [
            { text: 'API', link: `${p}/reference/audit-events-api` },
            { text: 'Rate Limiting', link: `${p}/reference/audit-events-rate-limiting` },
            { text: 'Version Compatibility', link: `${p}/reference/audit-qs-version-compatibility` },
            {
              text: 'Destinations',
              collapsed: true,
              items: [
                { text: 'Overview', link: `${p}/reference/audit-destinations/` },
                { text: 'InfluxDB', link: `${p}/reference/audit-destinations/influxdb/` },
                {
                  text: 'JSON',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: `${p}/reference/audit-destinations/json/` },
                    { text: 'Object Data', link: `${p}/reference/audit-destinations/json/object-data` }
                  ]
                },
                { text: 'Parquet', link: `${p}/reference/audit-destinations/parquet/` },
                {
                  text: 'PNG',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: `${p}/reference/audit-destinations/png/` },
                    { text: 'Screenshot Downloads', link: `${p}/reference/audit-destinations/png/downloads` }
                  ]
                },
                { text: 'QVD', link: `${p}/reference/audit-destinations/qvd/` }
              ]
            }
          ]
        },
        {
          text: 'Available Metrics',
          collapsed: true,
          items: [
            { text: 'Overview', link: `${p}/reference/available-metrics/` },
            { text: 'InfluxDB Metrics', link: `${p}/reference/available-metrics/influxdb` },
            { text: 'Failed Polls', link: `${p}/reference/available-metrics/failed-polls` },
            { text: 'Prometheus Metrics', link: `${p}/reference/available-metrics/prometheus` },
            { text: 'New Relic', link: `${p}/reference/available-metrics/new-relic` }
          ]
        }
      ]
    },
    {
      text: 'Legal Stuff',
      collapsed: true,
      items: [
        { text: 'Legal Information', link: `${p}/legal-stuff` }
      ]
    }
  ];
}




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
      { text: 'Guide', link: '/latest/about/' },
      {
        text: 'Version',
        items: [
          { text: 'latest', link: '/latest/about/' },
          { text: 'v15.0', link: '/v15.0/about/' },
          { text: 'v14.0', link: '/v14.0/about/' },
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
      '/v14.0/': createSidebar('/v14.0'),
      '/latest/': createSidebar('/latest'),
      '/v15.0/': createSidebar('/v15.0'),
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
