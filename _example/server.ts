import { RhinoServer, OnServerListening, ServerOptions } from "../mod.ts";

// The router
import { MY_ROUTER } from "./router.ts";

// Hooks
import { LogRequestMethodHook } from "./hooks/log_request_method.hook.ts";

// Error handlers
import { ForbiddenErrorHandler } from "./error_handlers/forbidden.error.ts";

@RhinoServer({
    port: 3200,
    hooks: [LogRequestMethodHook],
    errorHandlers: [ForbiddenErrorHandler],
    router: MY_ROUTER,
})
export class myServer implements OnServerListening {
    /**
     * Logs out a message when the app starts listening for requests
     * @param app The configuration object for this class
     */
    public onListening(app: ServerOptions) {
        console.log(`\nListening to request made to ${app.hostname}:${app.port}`);
    }
}
