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
    /** The cookies sent with the response headers. */
    public readonly cookies: { [key: string]: string };
    /** Custom-defined properties */
    private readonly customProperties: { [key: string]: any } = {};
    /** The full path for the endpoint. Assigned once an endpoint is resolved. */
    public fullPath: string;
    /** The client's host. Derived from the host header field. */
    public readonly host: string | undefined;
    /** The hostname sent with the response headers. */
    public readonly hostname: string | undefined;
    /** The client's remote ip address */
    public readonly ip: string;
    /** The HTTP request method of the response. */
    public readonly method: string;
    /** The parameter sent in the request URL. Assigned once an endpoint is resolved. */
    public params: { [key: string]: string } | undefined;
    /** The request's protocol, e.g.: HTTP/1.1 */
    public readonly protocol: string;
    /** The queries send in the request URL. */
    public readonly queries: { [key: string]: string } | undefined;
    /** The client's remote address */
    public readonly remoteAddress: RemoteAddress;
    /** The route path (if any) for the request. Assigned once an endpoint is resolved. */
    public routePath: string;
    /** The full URL requested. */
    public readonly url: string;
    /** An object of type RhinoURL that contains useful methods for the URL and PATH of the request. */
    public readonly URLObject: RhinoURL;

    constructor(public readonly HTTP_REQUEST: HTTPServer.ServerRequest) {
        const URLObject = new RhinoURL(Utils.removeTrailingSlash(HTTP_REQUEST.url));

        // Initializes the parameters
        this.cookies = Cookies.getCookies(HTTP_REQUEST);
        this.fullPath = ""; // this gets assigned once an endpoint is matched to the request
        this.hostname = HTTP_REQUEST.headers.get("host")?.split(":")[0] || undefined;
        this.remoteAddress = HTTP_REQUEST.conn.remoteAddr as RemoteAddress;
        this.ip = this.remoteAddress.hostname;
        this.method = HTTP_REQUEST.method;
        this.params = {}; // this gets assigned once an endpoint is matched to the request
        this.protocol = HTTP_REQUEST.proto;
        this.queries = URLObject.getQueries();
        this.routePath = ""; // this gets assigned once an endpoint is matched to the request
        this.url = URLObject.URL;
        this.URLObject = URLObject;
    }

    /**
     * Checks if the client accepts the passed mime type
     * @param contentType The mime type to be checked
     */
    public accepts(contentType: MIMEType) {
        const accepted = this.getHeaderField(HeaderField.Accept);

        // If the client accepts any type, then we return true,
        // no matter what the passed MIME type is.
        if (accepted === "*/*") return true;

        // Returns true if the passed mime type is in the 'accepts' header
        return accepted && accepted.includes(contentType);
    }

    /**
     * Parses the body of the http request.
     * @returns an object containing the key-value pairs of the JSON data sent in the request
     * when the request content-type is application/json or application/x-www-form-urlencoded,
     * otherwise, returns the raw data in the form of a string.
     */
    public async body(): Promise<{ [key: string]: any } | string> {
        const decoder = new TextDecoder();
        const ct = this.getHeaderField(HeaderField.ContentType);

        return new Promise(async (resolve, reject) => {
            const b: Uint8Array = await Deno.readAll(this.HTTP_REQUEST.body);
            const body = decoder.decode(b);

            if (ct === MIMEType.ApplicationJSON) {
                resolve(JSON.parse(body));
            } else if (ct === MIMEType.ApplicationForm) {
                resolve(Utils.ParseURLQueries(body));
            } else {
                resolve(body);
            }
        });
    }

    /** Gets a custom-defined property of the object */
    public get(name: string): any {
        return this.customProperties[name];
    }

    /** Gets the header value for a the passed field name. */
    public getHeaderField(field: HeaderField): string | undefined {
        return this.HTTP_REQUEST.headers.get(field) ?? undefined;
    }

    /**
     * Checks if the request's content type is equal to the sent header content-type.
     * @param mimeType The MIME type to check
     */
    public isContentType(mimeType: MIMEType) {
        return this.HTTP_REQUEST.headers.get(HeaderField.ContentType) === mimeType;
    }

    /** Checks if a request is of type xhr (an AJAX request, for example) */
    public isXHR() {
        return this.getHeaderField(HeaderField.XRequestedWith)?.toLowerCase() === "xmlhttprequest";
    }

    /**
     * Adds a custom-defined property to the request object
     * @param name The name of the custom property
     * @param value The value of the property
     */
    public set(name: string, value: any) {
        this.customProperties[name] = value;
    }
}
