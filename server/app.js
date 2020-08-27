const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const port = 3333;
const corsOptions = {
  origin: '*',
  credentials: true
};

/* Secure the app by setting various HTTP headers */
// app.use(helmet());

app.use(cors(corsOptions));

/* Serving static resources */
app.use(express.static('../client', {
  etag: true,
  maxAge: 3600 * 1000 // in milliseconds
}));

app.get('/api/v1/apps', function (req, res) {
  res
    .status(200)
    .send([
      {
        id: 'snkcrdxwf4inhosy72hzqrxkclo24fzp',
        name: 'New_Flogo_App_0',
        description: '',
        type: {
          val: 'flogo'
        },
        orgId: 'DS Apps do not use orgId',
        createdTime: 1597293817860,
        modifiedTime: 1597293846086,
        lastRunTime: 0,
        publishStage: 'draft',
        userId: '',
        sandboxId: 'MyDefaultSandbox',
        ownerName: '',
        owner: 'n72nxfyonxnhws7n6uqre42emhzec7kd',
        endpointVisibility: 'public',
        tibTunnelAccessKey: '',
        vpnConnectionId: '',
        desiredInstanceCount: 0,
        createdByName: '',
        info: {
          exposedEndpointsNum: 0,
          endpointIds: [
            'vk3ybqeyw5yyqnyuirntzcrtpfmdi5tc'
          ],
          num_instances: 0,
          tenantSubType: null,
          tenantStatus: null,
          isPackaged: false,
          isMetricsEnabled: true
        },
        appInitialStatus: 'Stopped',
        onPremise: false
      },
      {
        id: 'wiemqtpmaik6tqgha6e6jgqizqkaiudr',
        name: 'New_Node_App_0',
        description: '',
        type: {
          val: 'node'
        },
        orgId: 'DS Apps do not use orgId',
        createdTime: 1597173554213,
        modifiedTime: 1597173556271,
        lastRunTime: 0,
        publishStage: 'draft',
        userId: '',
        sandboxId: 'MyDefaultSandbox',
        ownerName: '',
        owner: 'n72nxfyonxnhws7n6uqre42emhzec7kd',
        endpointVisibility: 'public',
        tibTunnelAccessKey: '',
        vpnConnectionId: '',
        desiredInstanceCount: 0,
        createdByName: '',
        info: {
          exposedEndpointsNum: 0,
          endpointIds: [
            '2bny6fb5kil35kupikay6nhoc2mwure4'
          ],
          num_instances: 0,
          tenantSubType: null,
          tenantStatus: null,
          isPackaged: false,
          isMetricsEnabled: true
        },
        appInitialStatus: 'Stopped',
        onPremise: false
      }
    ]);
});

/* Fallback to index.html for unmatched GET requests */
app.get('*', function (req, res) {
  res.sendFile(path.resolve('../client/index.html'));
});

/* Gzip resources before sending them back */
app.use(compression({
  filter: shouldCompress,
  level: -1,
  chunkSize: 4096
}));

app.listen(port, () => console.log(`The app is listening on port ${ port }`));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) { // don't compress responses with this request header
    return false;
  }

  return compression.filter(req, res); // fallback to standard filter function
}
