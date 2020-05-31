import { EndpointParams, DecoratedClass, RhinoRequest, HttpMethod } from '../mod.ts';

/**
 * A route object
 */
export interface routeItem {
    route: string;
    endpoints: DecoratedClass[],
}

/**
 * A single object that describes an endpoint
 */
interface endpointPoolItem {
    routePath: string;
    fullPath: string;
    handler: DecoratedClass;
    method: HttpMethod | "ALL"
}

/**
 * A list of endpoint items
 */
type endpointPool = endpointPoolItem[]


/**
 * Creates a server router to which new
 * endpoints and routes will be attached.
 */
export class RhinoRouter {
    public readonly ENDPOINTS_POOL: endpointPool = []


    /**
     * Adds a new route to the router
     * @param routePath The baseURL for this route. 
     * @param endpoints A list of endpoint-handling classes.
     */
    public addRoute(routePath: string, endpoints: DecoratedClass[]) {
        // Checks the slashes of the route's path
        this.check_slashes(routePath, "Route")

        // Checks all the endpoints inside the 
        endpoints.forEach(endpoint => {
            const ep = endpoint.prototype.endpointParams as EndpointParams;

            // Checks the slashes of the endpoint's path
            this.check_slashes(ep.path, "Endpoint");

            this.ENDPOINTS_POOL.push({
                routePath: routePath,
                fullPath: routePath + ep.path,
                handler: endpoint,
                method: ep.method
            });
        });

        // Checks that no two endpoints share the same path
        this.check_no_same_endpoint_path();
    }


    /**
     * Adds a new standalone endpoint to the router.
     * Standalone endpoints are automatically attached to the "/" root of the project.
     * @param endpoint The endpoint class
     */
    public addEndpoint(endpoint: DecoratedClass) {
        const ep = endpoint.prototype.endpointParams as EndpointParams;

        // Checks the slashes of the endpoint's path
        this.check_slashes(ep.path, "Endpoint");

        this.ENDPOINTS_POOL.push({
            routePath: "/",
            fullPath: ep.path,
            handler: endpoint,
            method: ep.method
        });

        // Checks that no two endpoints share the same path
        this.check_no_same_endpoint_path();
    }


    /**
     * TODO: Add support for serving static folders
     */
    public addStatic() {
    }


    /** */
    public matchEndpoint(req: RhinoRequest): endpointPool | null {
        // Gets a list of objects that match the requested route
        const matchedRoutes = this.ENDPOINTS_POOL.filter((endpoint) => {
            // console.log(req.path, req.root + route.path, req.URLObject.urlMatch(req.root + route.path))
            return req.URLObject.pathMatch(endpoint.fullPath) && endpoint.method === req.method
        })

        // Returns the handler class
        return (matchedRoutes.length > 0) ? matchedRoutes : null
    }


    /**
     * Checks that the paths of a route start with a slash, and have no slashes at the end
     * @param constructor The route's class for which we will check the endpoints
     */
    public check_slashes(path: string, type: "Route" | "Endpoint") {
        // Error if the route's path does not start with a slash
        if (!path.startsWith('/')) {
            throw new Error(`${type} paths must start with a slash.\n\t\t\tConflicting ${type}: ${path}`)
        }
        // error if the route's path ends with a slash
        if (path.endsWith('/')) throw new Error(`${type} paths cannot end with a slash.\n\t\t\tConflicting ${type}: ${path}`)
    }

    /**
     * Checks that no two endpoints share the exact same
     * structure AND the same HTTP request method
     */
    public check_no_same_endpoint_path() {
        // Checks each of the routes to make sure that there
        // are no duplicated endpoints
        this.ENDPOINTS_POOL.forEach(endpoint => {
            // Gets all the endpoints with the same path and HTTP method
            const foundRoutes = this.ENDPOINTS_POOL.filter((current_endpoint) => {
                const methodMatch = current_endpoint.method === endpoint.method
                    || [current_endpoint.method, endpoint.method].includes("ALL");

                return current_endpoint.fullPath === endpoint.fullPath && methodMatch
            })

            // If there is more than one endpoint with the same path and method, we throw an error
            if (foundRoutes.length !== 1) {
                const conflictingClasses = foundRoutes.map(h => h.handler.name).join(', ')
                throw new Error(`Found multiple endpoints with the same path and HTTP request method.
                            Endpoint #1 (${foundRoutes[0].method}):\t ${endpoint.fullPath},
                            Endpoint #2 (${foundRoutes[1].method}):\t ${endpoint.fullPath},
                            Handlers:\t ${conflictingClasses}`)
            }
        });
    }
}