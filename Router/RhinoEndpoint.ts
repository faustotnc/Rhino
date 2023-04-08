import { HttpMethod, RhinoRequest } from "../mod.ts";

/**
 * The parameters that define a Rhino endpoint.
 * These are explicitly defined by the programmer
 * when a class is decorated with @RhinoEndpoint.
 * */
export interface EndpointParams {
    path: string;
    method: HttpMethod | HttpMethod[];
    canActivate?: (req: RhinoRequest) => boolean;
}

/**
 * Function to be executed when the endpoint is called.
 */
export interface OnEndpointCalled {
    onEndpointCall(): void;
}

/**
 * The properties available inside a class that has
 * been decorated with @RhinoEndpoint.
 */
export type _RhinoEndpoint = Omit<EndpointParams, "method"> & OnEndpointCalled & { method: HttpMethod[] };

/**
 * Defines a class as a Rhino Endpoint
 */
export const RhinoEndpoint = (endpointParams: EndpointParams) => {
    return <T extends { new (...args: any[]): {} }>(target: T) => {
        const canActivateFunc = endpointParams.canActivate ? endpointParams.canActivate : () => true;
        const endpointHandler = target.prototype.onEndpointCall ? target.prototype.onEndpointCall : () => {};

        // Adds the properties to the prototype so that they
        // can be accessed without instantiating the decorated class
        target.prototype.endpointParams = {
            path: endpointParams.path,
            method:
                typeof endpointParams.method === "string" ? [endpointParams.method] : endpointParams.method,
            canActivate: canActivateFunc,
            onEndpointCall: endpointHandler,
        };

        // Adds the server properties to the decorated class
        return class extends target implements _RhinoEndpoint {
            public path = endpointParams.path;
            // If the path parameter is not provided, the we
            // define it as a "match-all" wildcard.
            public method =
                typeof endpointParams.method === "string" ? [endpointParams.method] : endpointParams.method;
            // Defines the route's canActivate guard.
            public canActivate = canActivateFunc;
            // Attaches the executeHook method to the class if it exists
            public onEndpointCall = endpointHandler;
        };
    };
};
