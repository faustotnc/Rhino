import { HTTPServer, Cookies, Path } from "../deps.ts";
import { HeaderField, MIMEType, StatusCode, StatusCodeName, ExtMIMEType } from "../mod.ts";
import { Utils } from "../utils.ts";

// Derives the optional values of a cookie
export type CookieOptions = Omit<Omit<Cookies.Cookie, "name">, "value">;

export class RhinoResponse {
    private _headersSent: boolean = false;
    private STATUS: number = 200;
    private COOKIES: HTTPServer.Response = {};

    private readonly RESPONSE_HEADERS = new Headers();

    constructor(private readonly HTTP_REQUEST: HTTPServer.ServerRequest) {}

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
     * Appends a value to an already existing HTTP header field, or
     * adds the field if it has not been created.
     * @param field The HTTP header field name
     * @param value The value for the header field.
     * @note Should follow the standard from https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    public appendHeader(field: string, value: string | string[]): RhinoResponse {
        if (Array.isArray(value)) {
            // Joins the values with a comma, if they are an array of values
            value.forEach((val) => this.RESPONSE_HEADERS.append(field, val));
        } else {
            // Otherwise, just adds the value to the header
            this.RESPONSE_HEADERS.append(field, value);
        }

        return this;
    }

    /**
     * Sets the HTTP response Content-Disposition header field to “attachment”.
     * If a filename is given, then it sets the Content-Type based on the extension name via res.type(),
     * and sets the Content-Disposition “filename=” parameter.
     * @param filename The name that will be set to the downloaded file
     */
    public asAttachment(filename?: string): RhinoResponse {
        const _filename = filename ? `filename=${filename};` : "";
        this.setHeader(HeaderField.ContentDisposition, `attachment; ${_filename}`);

        const ext = Path.extname(filename || "");
        this.contentType(ext);

        return this;
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
        const c: Cookies.Cookie = { name, value, ...options };

        // Sets the cookie to be appended to the response
        Cookies.setCookie(this.COOKIES, c);
    }

    /**
     * Sets the content-type header.
     * @param mime The MIME type, or file extension
     *
     * @example
     * ```
     * // file extension
     * this.res.contentType('.css')
     * // file type
     * this.res.contentType('html')
     * // Mime type from the MIMEType Enumerable
     * this.res.contentType(MIMEType.TextMarkdown)
     * // Direct MIME type
     * this.res.contentType('application/json')
     * ```
     */
    public contentType(mime: string): RhinoResponse {
        let _mime: string = MIMEType.TextPlain;

        if (mime.includes("/")) {
            // If the passed mime contains a slash, we
            // will assume it to be a mime type directly.
            _mime = mime;
        } else {
            // For anything else, we assume it to be a file extension or file type.
            // If the file extension could not be understood, we leave it as text/plain
            const foundMime = Object.keys(ExtMIMEType).filter((key) => {
                const keyName = (mime.startsWith(".") ? "." : "") + key;
                return keyName === mime;
            });
            let mimeFileExt = ExtMIMEType[foundMime[0]];
            if (mimeFileExt) {
                _mime = mimeFileExt;
            } else {
                Utils.logPassiveError(
                    "The passed file extension could not be understood. Please specify the mime type directly."
                );
            }
        }

        this.set(HeaderField.ContentType, _mime);
        return this;
    }

    /**
     * Send the contents of a file in the HTTP response's body for automatic download by the client.
     * @param filepath The relative or absolute path to the file. If the
     * path is relative to the file, then the entry point of the application should
     * be the base of the file's path.
     * @note Requires the --allow-read flag
     */
    public async download(filepath: string, filename?: string): Promise<any> {
        const file_n = filename ?? filepath.split("/").pop();
        return new Promise(async (resolve, reject) => {
            try {
                this.asAttachment(file_n);
                this.sendFile(filepath)
                    .then(() => resolve(true))
                    .catch((err) => {
                        this.removeHeader(HeaderField.ContentDisposition);
                        reject(err);
                    });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Sends the response without any data.
     */
    public end() {
        this.HTTP_REQUEST.finalize();
    }

    /**
     * Returns wether the headers have been sent or not
     */
    public get headersSent(): boolean {
        return this._headersSent;
    }

    /**
     * Removes a header field from the the response headers.
     * @param field The header field to be removed
     */
    public removeHeader(field: string) {
        this.RESPONSE_HEADERS.delete(field);
    }

    /**
     * Sends the passed resData as a response to the client
     * @param resData The data to send to the client
     */
    public send(resData: any) {
        let d = resData;

        // If a response was already sent to the client, we log an error
        if (this._headersSent) Utils.logPassiveError("A response has already been sent!");

        // If the data is an object, we convert it to a string
        if (typeof d === "object") d = JSON.stringify(d);

        this.HTTP_REQUEST.done.then(() => {
            // Prevents any other responses from being
            // sent after this response has been sent.
            this._headersSent = true;
        });

        // If no response has been sent to the client, the data is sent to the client
        if (!this._headersSent)
            this.HTTP_REQUEST.respond({
                status: this.STATUS,
                headers: this.RESPONSE_HEADERS,
                body: d, // converts any data into a string
                ...this.COOKIES,
            });
    }

    /**
     * Transfers the file at the given path in the response body,
     * and sets the content-type header based on the file's extension.
     * @param filepath The relative or absolute path to the file. If the
     * path is relative to the file, then the entry point of the application should
     * be the base of the file's path.
     */
    public async sendFile(filepath: any): Promise<any> {
        // If a response was already sent to the client, we log an error
        if (this._headersSent) Utils.logPassiveError("A response has already been sent!");

        const p = Path.resolve(filepath);
        const ext = Path.extname(filepath);

        return new Promise(async (resolve, reject) => {
            try {
                const [file, fileInfo] = await Promise.all([Deno.open(p), Deno.stat(p)]);

                this.contentType(ext);
                this.setHeader("content-length", fileInfo.size.toString());

                this.HTTP_REQUEST.done.then(() => {
                    // closes the file after the request is done
                    file.close();

                    // Prevents any other responses from being
                    // sent after this response has been sent.
                    this._headersSent = true;

                    resolve(true);
                });

                // If no response has been sent to the client, the data is sent to the client
                if (!this._headersSent)
                    this.HTTP_REQUEST.respond({
                        status: this.STATUS,
                        headers: this.RESPONSE_HEADERS,
                        body: file,
                        ...this.COOKIES,
                    });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Sends a status code and its string name to the client.
     * @param code The status code
     */
    public sendStatus(code: StatusCode) {
        const n = StatusCodeName[Object.keys(StatusCode)[Object.values(StatusCode).indexOf(code)]];
        this.status(code).send(n);
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
            value.forEach((val) => this.RESPONSE_HEADERS.append(field, val));
        } else {
            // Otherwise, just adds the value to the header
            this.RESPONSE_HEADERS.set(field, value);
        }

        return this;
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
}
