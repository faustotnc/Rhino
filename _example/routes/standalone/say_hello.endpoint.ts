import {
    HttpMethod,
    MIMEType,
    NextError,
    NextHook,
    OnEndpointCalled,
    RhinoEndpoint,
    RhinoRequest,
    RhinoResponse,
} from "../../../mod.ts";

@RhinoEndpoint({
    path: "/hello",
    method: HttpMethod.GET,
})
export class HelloWorld implements OnEndpointCalled {
    constructor(
        private req: RhinoRequest,
        private res: RhinoResponse,
        private next: NextHook,
        private error: NextError
    ) {}

    /** Executed when this endpoint is requested */
    public onEndpointCall() {
        // Sets the content type, and sends data to the client
        this.res.contentType(MIMEType.TextHTML).send(`
            <html>
                <header>
                    <meta charset='UTF-8'>
                </header>
                <body>
                    <h1>Hello Rhinos 🦏!</h1>
                </body>
            </html>
        `);
    }
}
