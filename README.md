# Rhino 🦏 - The Framework for scalable APIs.

🎉 RC-2 introduced out-of-the-box support for parsing JSON and Form data from the request body, as well as the ability to send files to the client in the response body. [Check out the highlights!](https://github.com/faustotnc/Rhino/releases) 🎉

Rhino is an Angular-inspired framework for creating scalable REST-APIs. It provides a route-endpoint architecture that takes advantage of the many features provided by the TypeScript language. It encourages a project structure that is self-described and consistent, so that programmers within the project can collaborate seamlessly.

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/faustotnc/rhino?include_prereleases&color=3d6057)](https://github.com/faustotnc/Rhino/releases)
[![tag](https://img.shields.io/badge/deno->=1.0.0-green.svg?color=3d6057)](https://github.com/denoland/deno)
[![tag](https://img.shields.io/badge/std-0.56.0-green.svg?color=3d6057)](https://github.com/denoland/deno)
[![GitHub license](https://img.shields.io/github/license/faustotnc/rhino?color=bf9f32)](https://github.com/faustotnc/Rhino/blob/master/LICENSE)


Rhino comes with five different modules for strong REST-API creation:

- **@RhinoServer** - *Class Decorator*: Creates a new server.
- **RhinoRouter** - *Class*: Defines the routes and endpoints for a server.
- **@RhinoEndpoint** - *Class Decorator*: Defines an endpoint handler.
- **@RhinoHook** - *Class Decorator*: Defines a middleware that can be hooked to the request-response middleware pipeline.
- **@RhinoError** - *Class Decorator*: Defines an error handler.



## Hello World

### Step 1) Create a Server
Crete a file named `server.ts`, then copy and paste the following code inside it.
``` typescript
import {
    RhinoServer, OnServerListening,
    ServerOptions, RunServers
} from "https://deno.land/x/rhino/mod.ts";

// The server's router (next step)
import { myRouter } from  './router.ts';

// Creates a server
@RhinoServer({
    port: 3200,
    router: myRouter
})
export class myServer implements OnServerListening {
    /** Executes once the server starts listening to requests */
    public onListening(app: ServerOptions) {
        console.log(`\nListening to request made to ${app.hostname}:${app.port}`)
    }
}

/**
 * Runs all the servers for this application.
 * (A single application can have multiple servers)
 */
RunServers([myServer]);
```



### Step 2) Create a Router
Create a file named `router.ts`, then copy and paste the following code inside it.
``` typescript
import { RhinoRouter } from "https://deno.land/x/rhino/mod.ts";

// Creates a new router
const ROUTER = new RhinoRouter();

// Endpoints (next step)
import { helloWorld } from "./hello_world.endpoint.ts";

// Mounts the helloWorld endpoint to the root of the server
ROUTER.addEndpoint(helloWorld);

// Exports the router
export const myRouter = ROUTER;
```



### Step 3) Create an Endpoint
Create a file named `hello_world.endpoint.ts`, then copy and paste the following code inside it.
``` typescript
import {
    RhinoEndpoint, OnEndpointCalled, RhinoRequest,
    RhinoResponse, NextHook, NextError, HttpMethod, MIMEType
} from "https://deno.land/x/rhino/mod.ts";


@RhinoEndpoint({
    path: "/hello", // The path for this endpoint
    method: HttpMethod.GET, // This endpoint will only listen to GET requests
})
export class helloWorld implements OnEndpointCalled {

    // The constructor accepts the following parameters (in that order):
    // The Request Object,
    // The Response Object,
    // The Next Hook function (middlewares of type "After"), and
    // The Error function
    constructor(
        private req: RhinoRequest,
        private res: RhinoResponse,
        private next: NextHook,
        private error: NextError
    ) { }

    /** Executed when this endpoint is requested */
    public onEndpointCall() {
        // Sets the content type, and sends data to the client
        this.res.contentType(MIMEType.TextHTML).send("<h1>Hello Rhinos 🦏!</h1>");
    }
}
```
Open a command line and run ``$ deno run -c ./tsconfig.json --allow-net server.ts``.

**NOTE:** Using Rhino requires the ``"experimentalDecorators": true`` in your project's tsconfig.json file.

Finally, navigate to `localhost:3200/hello` to be greeted by your newly created Rhino server.



## Scalability
You may be wondering, why so many files for a simple "hello world" project? The answer lies in scalability. Most real-world REST-APIs do not have a single file for all their code. Instead, the code is split into many files, folders, and sub-folders to create a robust application. Rhino takes care of all the thinking that goes behind defining a folder structure for your project by encouraging code refraction. To see an example of a simple Rhino project, visit the ``_example`` folder.



**NOTE:** This project is still on its (very) early stages, and the definitions are subject to change.
