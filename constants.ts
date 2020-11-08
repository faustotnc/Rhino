const charsetUTF8 = "charset=UTF-8";

/**
 * Supported HTTP status codes.
 */
export enum HttpMethod {
    // Common HTTP request methods
    /** HTTP Method of Type GET. Used to retrieve information from the server. */
    GET = "GET",
    /** HTTP Method of Type POST. Used to send (and store) data in the server. */
    POST = "POST",
    /** HTTP Method of Type PUT. Used to update already existing data in the server. */
    PUT = "PUT",
    /** HTTP Method of Type DELETE. Used to remove already existing data from the server. */
    DELETE = "DELETE",
    /** HTTP Method of Type HEAD. Same as GET, but transfers the status line and header section only. */
    HEAD = "HEAD",

    // Other HTTP request methods
    PATCH = "PATCH",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",

    /**
     * Accepts ANY request method
     * @note This is not an official HTTP Request Method (hence the underscore)
     */
    _ALL = "ALL"
}


/**
 * HTTP Status Codes.
 * Visit https://www.restapitutorial.com/httpstatuscodes.html for
 * more information on what each status code means.
 */
export enum StatusCode {
    // Informational
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,

    // Success
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    IMUsed = 226,

    // Redirection
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    UseProxy = 305,
    Unused = 306,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,

    // Client Error
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    RequestEntityTooLarge = 413,
    RequestURITooLong = 414,
    UnsupportedMediaType = 415,
    RequestedRangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    ImATeapot = 418,
    EnhanceYourCalm = 420,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    ReservedForWebDAV = 425,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    NoResponse = 444,
    RetryWith = 449,
    BlockedByWindowsParentalControls = 450,
    UnavailableForLegalReasons = 451,
    ClientClosedRequest = 499,

    // Server Error
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    BandwidthLimitExceeded = 509,
    NotExtended = 510,
    NetworkAuthenticationRequired = 511,
    NetworkReadTimeoutError = 598,
    NetworkConnectTimeoutError = 599,
}


/**
 * HTTP Status Codes Names
 * Visit https://www.restapitutorial.com/httpstatuscodes.html for
 * more information on what each status code means.
 */
export const StatusCodeName: { [key: string]: string } = {
    // Informational
    Continue: "Continue",
    SwitchingProtocols: "Switching Protocols",
    Processing: "Processing",

    // Success
    OK: "OK",
    Created: "Created",
    Accepted: "Accepted",
    NonAuthoritativeInformation: "Non Authoritative Information",
    NoContent: "No Content",
    ResetContent: "Reset Content",
    PartialContent: "Partial Content",
    MultiStatus: "Multi-Status",
    AlreadyReported: "Already Reported",
    IMUsed: "IM Used",

    // Redirection
    MultipleChoices: "Multiple Choices",
    MovedPermanently: "Moved Permanently",
    Found: "Found",
    SeeOther: "See Other",
    NotModified: "Not Modified",
    UseProxy: "Use Proxy",
    Unused: "Unused",
    TemporaryRedirect: "Temporary Redirect",
    PermanentRedirect: "Permanent Redirect",

    // Client Error
    BadRequest: "Bad Request",
    Unauthorized: "Unauthorized",
    PaymentRequired: "Payment Required",
    Forbidden: "Forbidden",
    NotFound: "Not Found",
    MethodNotAllowed: "Method Not Allowed",
    NotAcceptable: "Not Acceptable",
    ProxyAuthenticationRequired: "Proxy Authentication Required",
    RequestTimeout: "Request Timeout",
    Conflict: "Conflict",
    Gone: "Gone",
    LengthRequired: "Length Required",
    PreconditionFailed: "Precondition Failed",
    RequestEntityTooLarge: "Request Entity Too Large",
    RequestURITooLong: "Request URI Too Long",
    UnsupportedMediaType: "Unsupported Media Type",
    RequestedRangeNotSatisfiable: "Requested Range Not Satisfiable",
    ExpectationFailed: "Expectation Failed",
    ImATeapot: "I'm A Teapot",
    EnhanceYourCalm: "Enhance Your Calm",
    UnprocessableEntity: "Unprocessable Entity",
    Locked: "Locked",
    FailedDependency: "Failed Dependency",
    ReservedForWebDAV: "Reserved For WebDAV",
    UpgradeRequired: "Upgrade Required",
    PreconditionRequired: "Precondition Required",
    TooManyRequests: "Too Many Requests",
    RequestHeaderFieldsTooLarge: "Request Header Fields Too Large",
    NoResponse: "No Response",
    RetryWith: "Retry With",
    BlockedByWindowsParentalControls: "Blocked By Windows Parental Controls",
    UnavailableForLegalReasons: "Unavailable For Legal Reasons",
    ClientClosedRequest: "Client Closed Request",

    // Server Error
    InternalServerError: "Internal Server Error",
    NotImplemented: "Not Implemented",
    BadGateway: "Bad Gateway",
    ServiceUnavailable: "Service Unavailable",
    GatewayTimeout: "Gateway Timeout",
    HTTPVersionNotSupported: "HTTP Version Not Supported",
    VariantAlsoNegotiates: "Variant Also Negotiates",
    InsufficientStorage: "Insufficient Storage",
    LoopDetected: "Loop Detected",
    BandwidthLimitExceeded: "Bandwidth Limit Exceeded",
    NotExtended: "Not Extended",
    NetworkAuthenticationRequired: "Network Authentication Required",
    NetworkReadTimeoutError: "Network Read Timeout Error",
    NetworkConnectTimeoutError: "Network Connect Timeout Error",
}


/**
 * Common Header Fields
 */
export enum HeaderField {
    Accept = "Accept",
    AcceptEncoding = "Accept-Encoding",
    Allow = "Allow",
    Authorization = "Authorization",
    Location = "Location",
    XRealIP = "X-Real-IP",
    ContentEncoding = "Content-Encoding",
    Vary = "Vary",
    WWWAuthenticate = "WWW-Authenticate",
    XForwardedFor = "X-Forwarded-For",
    XRequestID = "X-Request-ID",
    ContentDisposition = "Content-Disposition",
    ContentType = "Content-Type",
    Cookie = "Cookie",
    SetCookie = "Set-Cookie",
    IfModifiedSince = "If-Modified-Since",
    LastModified = "Last-Modified",
    XRequestedWith = "X-Requested-With",
    Server = "Server",
    XForwardedProtocol = "X-Forwarded-Protocol",
    ContentLength = "Content-Length",
    Upgrade = "Upgrade",
    XForwardedProto = "X-Forwarded-Proto",
    XForwardedSsl = "X-Forwarded-Ssl",
    AccessControlRequestMethod = "Access-Control-Request-Method",
    AccessControlAllowCredentials = "Access-Control-Allow-Credentials",
    AccessControlExposeHeaders = "Access-Control-Expose-Headers",
    XUrlScheme = "X-Url-Scheme",
    XHTTPMethodOverride = "X-HTTP-Method-Override",
    ReferrerPolicy = "Referrer-Policy",
    Origin = "Origin",
    XCSRFToken = "X-CSRF-Token",
    AccessControlRequestHeaders = "Access-Control-Request-Headers",
    AccessControlAllowMethods = "Access-Control-Allow-Methods",
    ContentSecurityPolicyReportOnly = "Content-Security-Policy-Report-Only",
    AccessControlAllowOrigin = "Access-Control-Allow-Origin",
    AccessControlAllowHeaders = "Access-Control-Allow-Headers",
    AccessControlMaxAge = "Access-Control-Max-Age",
    StrictTransportSecurity = "Strict-Transport-Security",
    XContentTypeOptions = "X-Content-Type-Options",
    XXSSProtection = "X-XSS-Protection",
    XFrameOptions = "X-Frame-Options",
    ContentSecurityPolicy = "Content-Security-Policy",
}


/**
 * Common MIME types for restful APIs
 */
export enum MIMEType {
    ApplicationForm = "application/x-www-form-urlencoded",
    ApplicationGZip = "application/gzip",
    ApplicationJSON = "application/json",
    ApplicationJSONCharsetUTF8 = "application/json, charset=UTF-8",
    ApplicationJavaScript = "application/javascript",
    ApplicationJavaScriptCharsetUTF8 = "application/javascript, charset=UTF-8",
    ApplicationMsgpack = "application/msgpack",
    ApplicationProtobuf = "application/protobuf",
    ApplicationXML = "application/xml",
    ApplicationXMLCharsetUTF8 = "application/xml, charset=UTF-8",
    JPEGImage = "image/jpeg",
    JPGImage = "image/jpeg",
    MultipartForm = "multipart/form-data",
    OctetStream = "application/octet-stream",
    PNGImage = "image/png",
    TextCSS = "text/css",
    TextHTML = "text/html",
    TextHTMLCharsetUTF8 = "text/html, charset=UTF-8",
    TextMarkdown = "text/markdown",
    TextMarkdownCharsetUTF8 = "text/markdown, charset=UTF-8",
    TextPlain = "text/plain",
    TextPlainCharsetUTF8 = "text/plain, charset=UTF-8",
    TextXML = "text/xml",
    TextXMLCharsetUTF8 = "text/xml, charset=UTF-8",
}


/**
 * The MIME type for common file extensions
 */
export const ExtMIMEType: { [key: string]: string } = {
    "3g2": "video/3gpp2",
    "3gp": "video/3gpp",
    "7z": "application/x-7z-compressed",
    aac: "audio/aac",
    abw: "application/x-abiword",
    arc: "application/x-freearc",
    avi: "video/x-msvideo",
    azw: "application/vnd.amazon.ebook",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    bz: "application/x-bzip",
    bz2: "application/x-bzip2",
    csh: "application/x-csh",
    css: "text/css",
    csv: "text/csv",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    eot: "application/vnd.ms-fontobject",
    epub: "application/epub+zip",
    gif: "image/gif",
    gz: "application/gzip",
    htm: "text/html",
    html: "text/html",
    ico: "image/vnd.microsoft.icon",
    ics: "text/calendar",
    jar: "application/java-archive",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    jsonld: "application/ld+json",
    mid: "audio/midi",
    midi: "audio/x-midi",
    mjs: "text/javascript",
    mp3: "audio/mpeg",
    mpeg: "video/mpeg",
    mpkg: "application/vnd.apple.installer+xml",
    odp: "application/vnd.oasis.opendocument.presentation",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odt: "application/vnd.oasis.opendocument.text",
    oga: "audio/ogg",
    ogv: "video/ogg",
    ogx: "application/ogg",
    opus: "audio/opus",
    otf: "font/otf",
    pdf: "application/pdf",
    php: "application/x-httpd-php",
    png: "image/png",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    rar: "application/vnd.rar",
    rtf: "application/rtf",
    sh: "application/x-sh",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    tar: "application/x-tar",
    tif: "image/tiff",
    tiff: "image/tiff",
    ts: "video/mp2t",
    ttf: "font/ttf",
    txt: "text/plain",
    vsd: "application/vnd.visio",
    wav: "audio/wav",
    weba: "audio/webm",
    webm: "video/webm",
    webp: "image/webp",
    woff: "font/woff",
    woff2: "font/woff2",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xml: "text/xml",
    xul: "application/vnd.mozilla.xul+xml",
    zip: "application/zip",
}