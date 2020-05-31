import { HttpMethod, RhinoRequest } from '../mod.ts';


/**
 * The parameters that define a Rhino endpoint.
 * These are explicitly defined by the programmer
 * when a class is decorated with @Rhino_Endpoint.
 * */
export interface EndpointParams {
    path: string;
    method: HttpMethod | "ALL";
    canActivate?: (req: RhinoRequest) => boolean;
}

/**
 * Function to be executed when the endpoint is called.
 */
export interface onEndpointCalled {
    onEndpointCall(): void;
}

/**
 * The properties available inside a class that has
 * been decorated with @Rhino_Endpoint.
 */
export type RhinoEndpoint = EndpointParams & onEndpointCalled;

/**
 * Defines a class as a Rhino Endpoint
 */
export const Rhino_Endpoint = (endpointParams: EndpointParams) => {
    return <T extends { new(...args: any[]): {} }>(target: T) => {
        const endpointHandler = (target.prototype.onEndpointCall) ? target.prototype.onEndpointCall : () => { };
        const canActivateFunc = (endpointParams.canActivate) ? endpointParams.canActivate : (() => true)

        // Adds the properties to the prototype so that they
        // can be accessed without instantiating the decorated class
        target.prototype.endpointParams = {
            ...endpointParams,
            onEndpointCall: endpointHandler,
            canActivate: canActivateFunc
        };

        // Adds the server properties to the decorated class
        return class extends target implements RhinoEndpoint {
            public path = endpointParams.path;
            // If the path parameter is not provided, the we
            // define it as a "match-all" wildcard.
            public method = endpointParams.method;
            // Defines the route's canActivate guard.
            public canActivate = canActivateFunc;
            // Attaches the executeHook method to the class if it exists
            public onEndpointCall = endpointHandler;
        }
    }
}
