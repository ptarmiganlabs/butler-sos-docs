---
title: "App nmetrics"
linkTitle: "App metrics"
weight: 10
description: >
  "Apps", "Applications" or "Documents" - in Qlik lingo they all refer to the same thing.  

  It's where data and logic is kept in the Qlik Sense system.
---

{{< notice tip >}}
The [use cases](/docs/about/usecases/) page contains related information that may be of interest. 
{{< /notice >}}

## App metrics

When it comes to apps we basically want to track which apps are loaded into the monitored Sense server(s).

## In-memory vs loaded vs active apps

Given the caching nature of Qlik Sense, some apps will be actively used by users and some will just be sitting there without any current connections.

Sense group apps into three categories, which are all available in Butler SOS:

- Active apps. An app is active when a user is currently performing some action on it.
- Loaded apps. An app that is currently loaded into memory and that have open sessions or connections.
- In-memory apps. Loaded into memory, but without any open sessions or connections.

Butler SOS keeps track of both app IDs and names of the apps in each of the three categories.

More info on [Qlik help pages](https://help.qlik.com/en-US/sense-developer/February2021/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm).

## App names are tricky

Qlik Sense provides app health info based on app IDs.  
I.e. we get a list of what app IDs are active, loaded and in-memory.

That's all good, except those IDs don't tell us humans a lot.  
We need app **names**.

We can get those app names by simply asking Sense for a list of app app IDs and names, but there are a couple of challenges here:

1. This query to Sense may not be complex or expensive if done once, but if we do it several times per minute it will create an unwanted load on the Sense server(s).
2. There is the risk of an app being deleted between we get health data for it and the following appID-name query. Most apps are reasonably long-lived, but the risk is still there.

Right or wrong, Butler SOS takes this approach to the above:

1. App name queries are done on a separate schedule. In the main config file you can configure both if app names should even be looked up, and how often that lookup should happen. This puts you in control of how up-to-date app names you need in your Grafana dashboards.
2. The risk of a temporary mismatch between app IDs and app names in Butler SOS remains, and will even get worse if you query app names infrequently. Still, this is typically a very small problem (if even a problem at all).
