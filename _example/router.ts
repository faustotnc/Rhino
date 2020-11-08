import { RhinoRouter } from "../mod.ts";

// Creates a new router
const ROUTER = new RhinoRouter();


// Endpoints
import { CreateNewUsersEndpoint } from "./routes/users/create_new_user.endpoint.ts";
import { HelloWorld } from "./routes/standalone/say_hello.endpoint.ts";


// Mounts endpoints to the /users route
ROUTER.addRoute("/users", [CreateNewUsersEndpoint]);

// Mounts the standalone endpoint HelloWorld to
// the root of the app.
ROUTER.addEndpoint(HelloWorld);


// Exports the router
export const MY_ROUTER = ROUTER;