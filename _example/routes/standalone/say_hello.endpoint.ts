import {
    Rhino_Endpoint, onEndpointCalled, RhinoRequest,
    RhinoResponse, NextHook, NextError, HttpMethod, MIMEType
} from "../../../mod.ts";


@Rhino_Endpoint({
    path: "/hello",
    method: HttpMethod.GET,
})
export class HelloWorld implements onEndpointCalled {

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