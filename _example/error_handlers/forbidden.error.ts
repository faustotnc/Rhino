import {
    RhinoResponse, RhinoRequest, Rhino_Error, onErrorExecution,
    ErrorData, NextError, StatusCode, NextHook
} from '../../mod.ts';



@Rhino_Error(StatusCode.Forbidden)
export class ForbiddenErrorHandler implements onErrorExecution {
    constructor(
        private err: ErrorData,
        private req: RhinoRequest,
        private res: RhinoResponse,
        private next: NextHook,
        private throwError: NextError
    ) { }

    public executeError() {
        console.log("Oops. The client requested a forbidden route.")
        this.res.send(this.err.data)
    }
}