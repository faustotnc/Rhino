import { HTTPServer, Cookies } from "../deps.ts";
import { HeaderField, MIMEType, StatusCode, StatusCodeName } from "../constants.ts";
import { Utils } from '../utils.ts';


// Derives the optional values of a cookie
export type CookieOptions = Omit<Omit<Cookies.Cookie, "name">, "value">;


export class RhinoResponse {
    public headersSent: boolean = false;

    private readonly RESPONSE_HEADERS = new Headers();
    private STATUS: number = 200;
    private COOKIES: HTTPServer.Response = {};

    constructor(readonly request: HTTPServer.ServerRequest) { }


    /**
     * Appends a value to an already existing HTTP header field, or
     * adds the field if it has not been created.
     * @note Should follow the standard from https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    public appendHeader(field: string, value: string | string[]): RhinoResponse {
        if (Array.isArray(value)) {
            // Joins the values with a comma, if they are an array of values
            value.forEach(val => this.RESPONSE_HEADERS.append(field, val));
        } else {
            // Otherwise, just adds the value to the header
            this.RESPONSE_HEADERS.append(field, value)
        }

        return this;
    }

    /**
     * Appends a value to an already existing HTTP header field, or
     * adds the field if it has not been created.
     * @param field The HTTP header field name
     * @param value The value for the header field.
     * @note Should follow the standard from https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    public append(field: string, value: string | string[]) {
        this.appendHeader(field, value);
        return this;
    }


    /**
     * Sends a cookie to the client with the specified name and value
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param options Optional parameters for the cookie
     */
    public cookie(name: string, value: string | number | object, options?: CookieOptions) {
        if (typeof value === "string") value = value;
        if (typeof value === "number") value = value.toString();
        if (typeof value === "object") value = JSON.stringify(value);

        // Form the cookie data
        const c: Cookies.Cookie = { name, value, ...options }

        // Sets the cookie to be appended to the response
        Cookies.setCookie(this.COOKIES, c);
    }


    /**
     * Clears a cookie from the response by setting
     * its expiration date to a date before now.
     * @param name The name of the cookie
     */
    public clearCookie(name: string) {
        // Sets the cookie to be appended to the response
        Cookies.delCookie(this.COOKIES, name);
    }


    /**
     * Creates an HTTP header field with the passed value. Resets the field if
     * it already exists, or creates it if it does not exist.
     * @note Should follow the standard from https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    public setHeader(field: string, value: string | string[]): RhinoResponse {
        if (Array.isArray(value)) {
            // If the header field already exists, we delete it.
            if (this.RESPONSE_HEADERS.get(field)) this.RESPONSE_HEADERS.delete(field);
            // NOTE: calling Header.append() here was not a mistake. We cannot call
            // Headers.set() in this case because that would reset the value
            // of the field on every call of the loop. Instead, we delete the field
            // (in case it already existed) and append to a new empty field.
            value.forEach(val => this.RESPONSE_HEADERS.append(field, val));
        } else {
            // Otherwise, just adds the value to the header
            this.RESPONSE_HEADERS.set(field, value)
        }

        return this;
    }

    /**
     * Creates an HTTP header field with the passed value. Resets the field if
     * it already exists, or creates it if it does not exist.
     * @param field The HTTP header field name.
     * @param value The value for the header field.
     * @note Should follow the standard from https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    public set(field: HeaderField, value: string | string[]): RhinoResponse {
        this.setHeader(field, value);
        return this;
    }


    /**
     * Sends the response without any data.
     */
    public end() {
        this.request.finalize();
    }



    /**
     * Sends the passed resData as a response to the client
     * @param resData The data to send to the client
     */
    public send(resData: any) {
        let d = "";
        // If a response was already sent to the client, we log an error
        if (this.headersSent) Utils.logPassiveError("A response has already been sent!");

        // Changes the resData value to be a string
        if (typeof resData === "string" || typeof resData === "number") d = resData.toString();
        if (typeof resData === "object") d = JSON.stringify(resData);

        // If no response has been sent to the client, the data is sent to the client
        if (!this.headersSent) this.request.respond({
            status: this.STATUS,
            headers: this.RESPONSE_HEADERS,
            body: d,
            ...this.COOKIES
        });

        // After the response has been sent, we modify
        // the value of headerSent to be true
        this.headersSent = true;
    }


    /**
     * Sets the status code for the response sent to the client
     * Visit https://www.restapitutorial.com/httpstatuscodes.html for
     * more information on what each status code means.
     * @param code The status code
     */
    public status(code: StatusCode): RhinoResponse {
        this.STATUS = code;
        return this;
    }


    /**
     * Sends a status code and its string name to the client.
     * @param code The status code
     */
    public sendStatus(code: StatusCode) {
        const n = StatusCodeName[Object.keys(StatusCode)[Object.values(StatusCode).indexOf(code)]]
        this.status(code).send(n)
    }


    /**
     * Sets the content-type header to the passed MIME type
     * @param mime The MIME type
     */
    public contentType(mime: MIMEType): RhinoResponse {
        this.set(HeaderField.ContentType, mime);
        return this;
    }
}
