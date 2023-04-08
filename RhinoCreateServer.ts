import { HTTPServer } from "./deps.ts";
import {
    DecoratedClass,
    ErrorClass,
    ErrorData,
    HookClass,
    Result,
    RhinoErrorHandler,
    RhinoRequest,
    RhinoResponse,
    RhinoRouter,
    StatusCode,
    _Result,
    _RhinoEndpoint,
    _RhinoHook,
    _RhinoServer,
} from "./mod.ts";

export class CreateServer {
    // constructor parameters
    public PORT: number;
    public HOSTNAME: string;
    // class parameters
    private SERVER: HTTPServer.Server;
    private PRE_HOOKS: HookClass[] = [];
    private AFTER_HOOKS: HookClass[] = [];
    private ERROR_HANDLERS: ErrorClass[] = [];

    /**
     * Creates a new server that listens to the provided optional
     * hostname through the provided port.
     * @param init The server's initialization parameters
     */
    constructor(readonly serverClass: DecoratedClass) {
        const s = new serverClass() as _RhinoServer;
        this.PORT = s.port;
        this.HOSTNAME = s.hostname || "0.0.0.0";

        // Divides all the hooks to be "pre" or "after" hooks
        (s.hooks ?? []).filter((hook) => {
            if (hook.prototype && hook.prototype.hookParams.type === "PRE") {
                this.PRE_HOOKS.push(hook);
            } else if (hook.prototype && hook.prototype.hookParams.type === "AFTER") {
                this.AFTER_HOOKS.push(hook);
            }
        });

        // Defines the error handlers
        this.ERROR_HANDLERS = s.errorHandlers ?? [];

        // Creates a server on the port specified in PORT
        if (s.TLS) {
            // Creates a TLS server if the TLS option is provided
            this.SERVER = HTTPServer.serveTLS({
                port: this.PORT,
                hostname: this.HOSTNAME,
                certFile: s.TLS.certFile,
                keyFile: s.TLS.keyFile,
            });
        } else {
            // Creates a standard server without TLS
            this.SERVER = HTTPServer.serve({ port: this.PORT, hostname: this.HOSTNAME });
        }

        // Starts listening for requests
        this.listen(s.router).then(() => s.onListening(s));
    }

    /**
     * Starts listening for requests to the server under the path {hostname}:{port}/{root}/REQUEST
     * @param callback The callback function to execute once the server starts listening for requests
     */
    public listen(router: RhinoRouter): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                // resolves the promise
                resolve(this.SERVER.listener);
                // Listens to all the requests made to the server
                for await (const req of this.SERVER) this.processRequests(req, router);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Processes the requests made to the sever. This is
     * what is know in Rhino as the request-response middleware pipeline.
     * @param req The request object sent by the client
     */
    private async processRequests(req: HTTPServer.ServerRequest, router: RhinoRouter) {
        // The general request object
        const genRequest = new RhinoRequest(req);
        const genResponse = new RhinoResponse(req);

        // Holds any error data sent by any
        // of the middlewares
        let errorData: any;

        // Execute all the "pre" hooks
        for await (const err of this.execPreHooks(genRequest, genResponse)) {
            // If the headers were sent to the client by one of the hooks, or the err constant holds
            // a value (sent by calling the error callback in the hook's class), we break the loop.
            if (genResponse.headersSent || err) {
                if (err) errorData = err;
                break;
            }
        }

        // Matches the URL with an endpoint, and executes the endpoint's callback
        if (!errorData && !genResponse.headersSent) {
            for await (const err of this.execEndpoint(router, genRequest, genResponse)) {
                if (genResponse.headersSent || err) {
                    if (err) errorData = err;
                    break;
                }
            }
        }

        // If a response is yet to be sent, we execute all the "after" hooks
        if (!errorData && !genResponse.headersSent) {
            for await (const err of this.execAfterHooks(genRequest, genResponse)) {
                // If the headers were sent to the client by one of the hooks, or the err constant holds
                // a value (sent by calling the error callback in the hook's class), we break the loop.
                if (genResponse.headersSent || err) {
                    if (err) errorData = err;
                    break;
                }
            }
        }

        // Error Handling loop
        if (errorData && !genResponse.headersSent) {
            // If the passed error code is a valid status code, we set it automatically
            if (Object.values(StatusCode).includes(errorData.code)) genResponse.status(errorData.code);

            for await (const err of this.execErrorHandlers(errorData, genRequest, genResponse)) {
                // If the headers were sent to the client by one of the error handlers, or the err constant holds
                // a value (sent by calling the error callback in the hook's class), we break the loop.
                if (genResponse.headersSent || err) {
                    if (err) errorData = err;
                    break;
                }
            }
        }
    }

    /**
     * Executes all hooks labeled as "PRE" (one-by-one; in order of declaration).
     * @param req The generated RhinoRequest for this request
     * @param res The generated RhinoResponse for this request
     */
    private *execPreHooks(req: RhinoRequest, res: RhinoResponse) {
        for (let i = 0; i < this.PRE_HOOKS.length; i++) {
            const hook = this.PRE_HOOKS[i];

            yield new Promise<Result>((resolve) => {
                const hookInstance = new hook(req, res, resolve, resolve) as _RhinoHook;
                // If the hook's path can be matched to a route, then we
                // execute the hook before executing the endpoint handler.
                // Also, if the hook's path is exactly equal to "**", then
                // urlMatch will return true, so the hook will also execute.
                if (!res.headersSent && req.URLObject.pathMatch(hookInstance.path || "**")) {
                    hookInstance.executeHook();
                    // we resolve the promise after the handler function
                    // has been executed so that the loop can reach the end,
                    // even if the handler does not explicitly call next/error
                    resolve(_Result.OK);
                }
            });
        }
    }

    /**
     * Executes the first found endpoint for the request. If no endpoints
     * were found that could handle the request, the program proceeds to execute
     * the hooks labeled as "AFTER"
     * @param router The application's router
     * @param req The generated RhinoRequest for the request
     * @param res The generated RhinoResponse for the request
     */
    private *execEndpoint(router: RhinoRouter, req: RhinoRequest, res: RhinoResponse) {
        // Finds an endpoint that can handle the request
        const foundEndpoints = router.matchEndpoint(req) ?? [];

        for (let i = 0; i < foundEndpoints.length; i++) {
            const endpoint = foundEndpoints[i];

            // Once an endpoint it found, we attach the endpoint-specific
            // properties for the request
            req.params = req.URLObject.getParams(endpoint.fullPath);
            req.routePath = endpoint.routePath;
            req.fullPath = endpoint.fullPath;

            yield new Promise<Result>((resolve) => {
                if (endpoint.handler.prototype.endpointParams.canActivate(req)) {
                    // Then, we execute the handler for the path
                    const ep = new endpoint.handler(req, res, resolve, resolve) as _RhinoEndpoint;
                    ep.onEndpointCall();
                    // we resolve the promise after the handler function
                    // has been executed so that the loop can reach the end,
                    // even if the handler does not explicitly call next/error
                    resolve(_Result.OK);
                } else {
                    resolve({
                        code: StatusCode.Forbidden,
                        data: {
                            origin: "canActivate",
                            message: `The endpoint ${endpoint.fullPath} rejected the request`,
                        },
                    });
                }
            });
        }
    }

    /**
     * Executes all hooks labeled as "AFTER" (one-by-one; in order of declaration).
     * @param req The generated RhinoRequest for this request
     * @param res The generated RhinoResponse for this request
     */
    private *execAfterHooks(req: RhinoRequest, res: RhinoResponse) {
        for (let i = 0; i < this.AFTER_HOOKS.length; i++) {
            const hook = this.AFTER_HOOKS[i];

            yield new Promise<Result>((resolve) => {
                const hookInstance = new hook(req, res, resolve, resolve) as _RhinoHook;
                // If the hook's path can be matched to a route, the we
                // execute the hook after executing the endpoint handler.
                // Also, if the hook's path is exactly equal to "**", then
                // urlMatch will return true, so the hook will also execute.
                if (!res.headersSent && req.URLObject.pathMatch(hookInstance.path || "**")) {
                    hookInstance.executeHook();
                    // we resolve the promise after the handler function
                    // has been executed so that the loop can reach the end,
                    // even if the handler does not explicitly call next/error
                    resolve(_Result.OK);
                }
            });
        }
    }

    /**
     * Executes an error handler based on the error code provided by the
     * class which threw the error
     * @param error The error data thrown by one of the middlewares
     * @param req The generated RhinoRequest for this request
     * @param res The generated RhinoResponse for this request
     */
    private *execErrorHandlers(error: ErrorData, req: RhinoRequest, res: RhinoResponse) {
        for (let i = 0; i < this.ERROR_HANDLERS.length; i++) {
            const errHandler = this.ERROR_HANDLERS[i];

            yield new Promise<Result>((resolve) => {
                const hookInstance = new errHandler(error, req, res, resolve, resolve) as RhinoErrorHandler;
                // If the hook's path can be matched to a route, the we
                // execute the hook after executing the endpoint handler.
                // Also, if the hook's path is exactly equal to "**", then
                // urlMatch will return true, so the hook will also execute.
                if (error.code === hookInstance.errorCode) {
                    hookInstance.executeError();
                    // we resolve the promise after the handler function
                    // has been executed so that the loop can reach the end,
                    // even if the handler does not explicitly call next/error
                    resolve(_Result.OK);
                }
            });
        }
    }
}
