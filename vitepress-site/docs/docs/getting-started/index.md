# Getting Started

Butler SOS is written in [Node.js](https://nodejs.org/en/), which is a cross-platform programming environment.
This means most kinds of computers and servers can be used to run Butler SOS, including Windows, Linux and Mac OS.

Setting up Butler SOS is pretty straightforward, but you do need a working understanding of Qlik Sense admin tasks.  
For example, you need to export certificates from the QMC, as well as installing Butler SOS itself.

## What is SenseOps?

<ResponsiveImage
  src="/img/butler-sos-overview-1.png"
  alt="Butler SOS Overview"
  maxWidth="800px"
/>

### Qlik Sense + DevOps = SenseOps

Butler SenseOps Stats ("Butler SOS") is a monitoring tool for [Qlik Sense](https://www.qlik.com/us/products/qlik-sense), built with DevOps workflows in mind.

It publishes operational, close to real-time Qlik Sense Enterprise metrics to [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/), [Prometheus](https://prometheus.io), [New Relic](https://newrelic.com) and [MQTT](https://en.wikipedia.org/wiki/MQTT). From there it can be visualized using tools like [Grafana](https://grafana.com/), New Relic or acted on by downstream systems that listen to the MQTT topics used by Butler SOS.

Butler SOS gathers operational metrics from several sources, including the [Sense healthcheck API](https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm) and [Session API](https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm) and the [Sense logs](https://help.qlik.com/en-US/sense-admin/May2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Server-Logging.htm).

## Do I Really Need This Tool?

Let's say you are somehow involved in (or maybe even responsible for) your company's client-managed Qlik Sense Enterprise on Windows (QSEoW) environment.

Let's also assume you have more than 5-10 users in your Sense environment. Maybe you even have business critical data in your Sense apps.

Given the above, the answer is almost certainly **"yes"**:

> You can simplify your workday and provide a better analytics experience to your end users by using a tool like Butler SOS.

Looking at companies using Butler SOS, they range from small companies with a single Sense server to large enterprises with dozens of Sense servers and (many!) thousands of users.

## Why a Separate Tool?

Good question.

While Qlik Sense ships with a great Operations Monitor application, it is not useful or intended for real-time operational monitoring.  
The Ops Monitor app is great for retrospective analysis of what happened in a Qlik Sense environment, but for a real-time understanding of what's going on in a Sense environment something else is needed - enter Butler SOS.

The most common way of using Butler SOS is for creating real-time dashboards based on the data in the InfluxDB or Prometheus database, showing operational metrics for a Qlik Sense Enterprise environment.

### Sample Dashboards

Sample screen shots of some basic [Grafana](https://grafana.com/) dashboards created using data extracted by Butler SOS:

<ResponsiveImage
  src="/img/butlersos_5_4_main_metrics.png"
  alt="Grafana dashboard showing errors and warnings"
  caption="SenseOps dashboard showing errors and warnings, using Grafana 7"
  maxWidth="900px"
/>

<ResponsiveImage
  src="/img/senseOps_dashboard_3.png"
  alt="Grafana dashboard showing errors and warnings"
  caption="SenseOps dashboard showing errors and warnings, using Grafana 6"
  maxWidth="900px"
/>

<ResponsiveImage
  src="/img/senseOps_dashboard_4.png"
  alt="Grafana dashboard showing Qlik Sense metrics"
  caption="SenseOps dashboard showing Qlik Sense metrics, using Grafana 6"
  maxWidth="900px"
/>

As mentioned above, Butler SOS can also send data to [MQTT](https://en.wikipedia.org/wiki/MQTT) for use in any MQTT enabled tool or system.

## Known Limitations & Improvement Ideas

Things can always be improved, of course. Here are some ideas on things for future versions:

- The MQTT messages are kind of basic, at least when it comes to data from the Sense logs and for detailed user sessions. In both those cases a single text string is sent to MQTT. That's fine, but assumes the downstream consumer of the MQTT message can parse the string and extract the information of interest.  
  A better approach would be to send more detailed MQTT messages. Those would be easier to consume and act upon for downstream systems, but it would on the other hand mean **lots** more MQTT messages being sent.
- Send data as Kafka messages. Same basic idea as for MQTT messages, but having the Sense operational data in Kafka would make it easier to process/use it in (big) data pipelines.

If you have ideas or suggestions on new features, please feel free to add them in the [Butler SOS GitHub project](https://github.com/ptarmiganlabs/butler-sos/issues/new/choose).

## Where Should I Go Next?

Ready to move on?

Great! Here are some good starting points:

- **[Examples](/docs/examples/)**: Check out some Grafana dashboards to get inspiration what can be done!
- **[Installation](/docs/getting-started/install/)**: Learn how to install Butler SOS
- **[Operations](/docs/getting-started/operations/)**: Learn how to run and monitor Butler SOS

## Questions or Issues?

Feel free to reach out via:

- [GitHub discussions](https://github.com/ptarmiganlabs/butler-sos/discussions) for general questions
- [GitHub issues](https://github.com/ptarmiganlabs/butler-sos/issues) for bugs
- Email to [info@ptarmiganlabs.com](mailto:info@ptarmiganlabs.com)

## Security / Disclosure

If you discover any important bug with Butler SOS that may pose a security problem, please disclose it confidentially to [security@ptarmiganlabs.com](mailto:security@ptarmiganlabs.com) first, so that it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.

## Who's Behind Butler SOS?

Butler SOS is an open source project sponsored by [Ptarmigan Labs](https://ptarmiganlabs.com), an IT consulting company in Stockholm, Sweden.  
Project lead is [Göran Sander](https://www.linkedin.com/in/gorsan) from same company.

Please refer to the [Contribution guidelines](/docs/about/contributing) page for details on how to contribute, suggest features etc to the tool.
