import { HTTPServer, Cookies } from "../deps.ts";
import { RhinoURL, MIMEType, HeaderField } from "../mod.ts";
import { Utils } from "../utils.ts";

// Deno's connection remote address property.
interface RemoteAddress {
    hostname: string;
    port: number;
    transport: string;
}


export class RhinoRequest {

    /** The route path (if any) for the request. Assigned once an endpoint is resolved. */
    public routePath: string;
    /** The cookies sent with the response headers. */
    public readonly cookies: { [key: string]: string; };
    /** The client's remote address */
    public readonly remoteAddress: RemoteAddress;
    /** The client's remote ip address */
    public readonly ip: string;
    /** The client's host. Derived from the host header field. */
    public readonly host: string | undefined;
    /** The hostname sent with the response headers. */
    public readonly hostname: string | undefined;
    /** The HTTP request method of the response. */
    public readonly method: string;
    /** The full URL requested. */
    public readonly url: string;
    /** The parameter sent in the request URL. Assigned once an endpoint is resolved. */
    public params: { [key: string]: string } | undefined;
    /** The full path for the endpoint. Assigned once an endpoint is resolved. */
    public fullPath: string;
    /** The request's protocol, e.g.: HTTP/1.1 */
    public readonly protocol: string;
    /** The queries send in the request URL. */
    public readonly queries: { [key: string]: string } | undefined;
    /** An object of type RhinoURL that contains useful methods for the URL and PATH of the request. */
    public readonly URLObject: RhinoURL;

    /** Custom-defined properties */
    private readonly customProperties: { [key: string]: any } = {}


    constructor(readonly request: HTTPServer.ServerRequest) {
        const URLObject = new RhinoURL(Utils.removeTrailingSlash(request.url));

        // Initializes the parameters
        this.routePath = ""; // this gets assigned once an endpoint is matched to the request
        this.cookies = Cookies.getCookies(request);
        this.remoteAddress = request.conn.remoteAddr as RemoteAddress;
        this.ip = this.remoteAddress.hostname;
        this.hostname = request.headers.get('host') || undefined;
        this.hostname = request.headers.get('host')?.split(':')[0] || undefined;
        this.method = request.method;
        this.url = URLObject.URL;
        this.fullPath = ""; // this gets assigned once an endpoint is matched to the request
        this.params = {}; // this gets assigned once an endpoint is matched to the request
        this.protocol = request.proto;
        this.queries = URLObject.getQueries();
        this.URLObject = URLObject;
    }


    /**
     * Checks if the client accepts the passed mime type
     * @param contentType The mime type to be checked
     * 
     * TODO: Expand support for passing and array of mime types. Also, the client may send multiple mime types as well.
     * TODO: Visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept for more information
     */
    public accepts(contentType: MIMEType) {
        const questionedType = (Array.isArray(contentType)) ? contentType : [contentType]
        const accepted = this.getHeaderField(HeaderField.Accept);

        // If the client accepts any type, then we return true,
        // no matter what the passed type is.
        if (accepted === "*/*") return true;

        // This only works for single mime types
        if (accepted === accepted) return true;
    }

    /**
     * Checks if the request's content type is equal to the sent header content-type.
     * @param mimeType The MIME type to check
     */
    public isContentType(mimeType: MIMEType) {
        return this.request.headers.get(HeaderField.ContentType) === mimeType
    }

    /** Gets the header value for a the passed field name. */
    public getHeaderField(field: HeaderField): string | undefined {
        return this.request.headers.get(field) ?? undefined
    };

    /** Checks if a request is of type xhr (an AJAX request, for example) */
    public get xhr() {
        return this.getHeaderField(HeaderField.XRequestedWith)?.toLowerCase() === "xmlhttprequest"
    }

    /**
     * Adds a custom-defined property to the request object
     * @param name The name of the custom property
     * @param value The value of the property
     */
    public set(name: string, value: any) {
        this.customProperties[name] = value;
    }

    /** Gets a custom-defined property of the object */
    public get(name: string): any {
        return this.customProperties[name]
    }
}