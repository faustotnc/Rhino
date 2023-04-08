import {
    HttpMethod,
    MIMEType,
    OnEndpointCalled,
    RhinoEndpoint,
    RhinoRequest,
    RhinoResponse,
} from "../../../mod.ts";

@RhinoEndpoint({
    path: "/new/:name", // The path for this endpoint, where /:name is a parameter
    method: HttpMethod.POST, // This endpoint will only listen to POST requests
})
export class CreateNewUsersEndpoint implements OnEndpointCalled {
    constructor(private req: RhinoRequest, private res: RhinoResponse) {}

    /** Executed when this endpoint is requested */
    public onEndpointCall() {
        // ...Business logic goes here...

        // Send a response to the client
        this.res.contentType(MIMEType.ApplicationJSON).send(this.formMessage());
    }

    // Make sure to take advantage of TypeScript classes,
    // and refactor your code into multiple parts.
    private formMessage() {
        return {
            message: `The user (${this.req.params?.name}) has been created.`,
        };
    }
}
