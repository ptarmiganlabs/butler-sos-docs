---
title: "Export Sense certificates"
linkTitle: "Get certificates"
weight: 20
description: >
  How to export certificates from Qlik Sense.
---

Butler SOS uses certificates to authenticate with Qlik Sense.  
These certificates must be exported from the Qlik Management Console (QMC).

![Qlik Sense certificate export](qmc-certexport-1.png "Exporting certificates from Qlik")

To export certificates you need to provide a few pieces of information:  

1. Name of the server where the certificate will be used (i.e. where Butler SOS will be running).

2. Butler SOS can handle certificates with or without password protection. If you choose to use a password, you must enter that password in the Butler SOS config file.

3. Check the "Include secret key" check box.

4. Export certificates in PEM format.

![Qlik Sense certificate export](qmc-certexport-2.png "Exporting certificates from Qlik, step 2")

Then click the "Export certificates" button. If all goes well the certificates are now exported to a folder on the Sense server to which you are connected (i.e. the server hosting the virtual proxy you are connected to):

![Qlik Sense certificate export](qmc-certexport-3.png "Exporting certificates from Qlik - all done!")

The exported certificate files will be used when [configuring Butler SOS](/docs/getting_started/install_config/config_file_format/).
