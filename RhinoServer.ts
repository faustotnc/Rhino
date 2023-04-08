import { RhinoRouter, HookClass, ErrorClass, DecoratedClass } from "./mod.ts";
import { CreateServer } from "./RhinoCreateServer.ts";

/**
 * The information passed to create a new server
 */
export interface ServerOptions {
    readonly port: number;
    readonly router: RhinoRouter;
    readonly hostname?: string;
    readonly guard?: () => boolean;
    readonly hooks?: HookClass[];
    readonly errorHandlers?: ErrorClass[];
    readonly TLS?: {
        certFile: string;
        keyFile: string;
    };
}

/**
 * Makes the onListening method available
 * inside a decorated RhinoServer class
 */
export interface OnServerListening {
    onListening(data: ServerOptions): void;
}

/**
 * The properties that a decorated RhinoServer class possesses.
 */
export type _RhinoServer = OnServerListening & ServerOptions;

/**
 * Holds the names of the classes that are defined
 * as a server class by using the RhinoServer decorator.
 *
 * If the programmer tries to use a class that has not been
 * decorated with @RhinoServer, then it will not be inside this
 * array, and so the RunServers function will throw an error.
 *
 * The reason we need to check if the server class has been decorated
 * with @RhinoServer, is that 1) the RhinoServer decorator attaches
 * the necessary properties to the class, and 2) it is syntactically more
 * appropriate (instead of directly defining the properties inside the class.)
 *
 * TODO: Find a better solution for this.
 */
const definedServersList: string[] = [];

/**
 * The decorator that makes a class a "Rhino Server."
 * This decorator attaches the different properties
 * for the server so that they can be accessed when
 * the class is instantiated.
 * @param serverParams The parameters of the server
 */
export const RhinoServer = (serverParams: ServerOptions) => {
    // In case the programmer gets away with not specifying a port number, or a router
    if (!serverParams.port) throw new Error("A port number is required.");
    if (!serverParams.router) throw new Error("A router class is required.");

    return <T extends { new (...args: any[]): {} }>(target: T) => {
        // Makes the decorated class a Rhino server class.
        definedServersList.push(target.name);

        // Adds the server properties to the decorated class
        return class extends target implements _RhinoServer {
            public port = serverParams.port;
            public hostname = serverParams.hostname || "0.0.0.0";
            public router = serverParams.router;
            public guard = serverParams.guard;
            public hooks = serverParams.hooks;
            public errorHandlers = serverParams.errorHandlers;
            public TLS = serverParams.TLS;

            // Attaches the onListening method to the class if it exists
            public onListening = target.prototype.onListening ? target.prototype.onListening : () => {};
        };
    };
};

/**
 * Because a single project can have more than one server
 * running at a time, the RunServers function initializes
 * all the provided servers.
 * @param servers The decorated server classes
 */
export const RunServers = (servers: DecoratedClass[]) => {
    servers.forEach((server) => {
        // If the class passed has not been decorated with @RhinoServer, we throw an error.
        if (!definedServersList.includes(server.name)) {
            throw new Error(
                `The class ${server.name} is not a Rhino server class. Decorate the class with @RhinoServer.`
            );
        }

        // Creates the server
        new CreateServer(server);
    });
};
