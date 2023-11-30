---
title: "Legal stuff"
linkTitle: "Legal stuff"
weight: 120
description: >
  Information om licenses, personal integrity and more.
---

## License

Butler SOS is distributed under the [MIT license](https://en.wikipedia.org/wiki/MIT_License).

```
MIT License

Copyright (c) 2023 Göran Sander

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Data collection

This documentation site was built using [Hugo](https://gohugo.io/) and consists of static web pages hosted on [GitHub Pages](https://pages.github.com/).  

GitHub probably keep log files for GitHub Pages, your visit to this documentation site is thus likely to be recorded there. For questions about such logs you should contact GitHub.

## Google Analytics

[Plausible](https://plausible.io) is used to track general site usage.
The collected data is not shared with any third parties.

Aggregated data may be used to determine, and in some cases publicly communicate, how popular the site is.  
Examples of aggregated metrics are how many users have visited the site and from where in the world they accessed the site.  

## Telemetry data

If enabled in the config file, Butler SOS will send anonymous telemetry data to PostHog, with data stored within the EU.  
A detailed description of what's included in the telemetry datais found [here](/docs/about/telemetry/).

Ptarmigan Labs collects this information to better understand

1. what the execution environment looks like for Butler SOS out there, and
2. which Butler SOS features are used/not used

The purpose of the telemetry data is ultimately to aid in future development of Butler SOS, focusing on the most used features and execution environments.

If you want your historical telemetry data to be deleted, you must provide Ptarmigan Labs with the system ID mentioned in the logs when Butler SOS is starting.  
This ID is what identifies your specific instance of Butler SOS.  

Until you tell Ptarmigan Labs what your ID is there is no link between you and that ID.  
The idea is simply that the anonymous telemetry should be just that: anonymous.
