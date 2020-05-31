import { Rhino_Hook, onHookExecution, NextHook, NextError, RhinoRequest, RhinoResponse } from '../../mod.ts';


@Rhino_Hook({ type: "PRE" })
export class LogRequestMethodHook implements onHookExecution {
    constructor(
        private req: RhinoRequest,
        private res: RhinoResponse,
        private next: NextHook,
        private err: NextError
    ) { }

    /** Will be executed when this hook is called */
    public executeHook() {
        console.log("The client has made a request of type:", this.req.method)

        // Hooks that do not send a response to the
        // client should call the next hook.
        this.next()
    }
}