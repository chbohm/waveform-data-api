
import * as express from 'express';
import * as serverEndpoints from '../api/v1/audio-transform';
import * as path from 'path';


let ENDPOINT_DEFINITIONS: endpoint.Definition[] = [
  serverEndpoints.audioToWaveForm
];

export function start(onServerReady?: Function) {
  const expressApp = express();

  // process.on('unhandledRejection', logOnErrorFactory('Unhandled Promise Rejection', injector));
  // process.on('uncaughtException', logOnErrorFactory('Uncaught Exception', injector));

  let port = process.env.PORT || 80;
  let guiRootFolder = path.resolve('./GUIApp');
  console.log('Express is serving static content from folder: ', guiRootFolder);
  expressApp.use(express.static(guiRootFolder));
  loadEndpoints(expressApp);


  let server = expressApp.listen(port, () => {
    console.log(`
       \x1b[33m----------------------------------------------------\x1b[0m
       \x1b[32m Server listening in port ${port} \x1b[0m
       \x1b[33m----------------------------------------------------\x1b[0m
    `);
    if (onServerReady) {
      onServerReady();
    }
  });

  server.on('close', function () {
    console.log(`
    \x1b[33m----------------------------------------------------\x1b[0m
    \x1b[32m Server closed \x1b[0m
    \x1b[33m----------------------------------------------------\x1b[0m
    `);
  });

  return server;
}

// if this is ran by command line, start() is invoked
if (require.main === module) {
  start();
}


function loadEndpoints(app: express.Express) {
  ENDPOINT_DEFINITIONS.forEach((definition: endpoint.Definition) => {
    let path = toV1Path(definition.endpoint.path);
    console.log(`${definition.endpoint.method} ${path}`);
    switch (definition.endpoint.method) {
      case 'GET': app.get(path, definition.callback); break;
      case 'POST': app.post(path, definition.callback); break;
      case 'PUT': app.put(path, definition.callback); break;
      case 'DELETE': app.delete(path, definition.callback); break;
      case 'PATCH': app.patch(path, definition.callback); break;
      case 'PROXY': app.all(path, definition.callback); break;
    }
  });

}


function toV1Path(path: string): string {
  return '/api/v1' + path;
}
