const charsetUTF8 = "charset=UTF-8";

/**
 * Supported HTTP status codes.
 */
export enum HttpMethod {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
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
 * Fields that can be sent to the client in the header
 * 
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
 * Mime types
 */
export enum MIMEType {
    ApplicationGZip = "application/gzip",
    ApplicationJSON = "application/json",
    ApplicationJSONCharsetUTF8 = "application/json, charset=UTF-8",
    ApplicationJavaScript = "application/javascript",
    ApplicationJavaScriptCharsetUTF8 = "application/javascript, charset=UTF-8",
    ApplicationXML = "application/xml",
    ApplicationXMLCharsetUTF8 = "application/xml, charset=UTF-8",
    TextMarkdown = "text/markdown",
    TextMarkdownCharsetUTF8 = "text/markdown, charset=UTF-8",
    TextXML = "text/xml",
    TextXMLCharsetUTF8 = "text/xml, charset=UTF-8",
    ApplicationForm = "application/x-www-form-urlencoded",
    ApplicationProtobuf = "application/protobuf",
    ApplicationMsgpack = "application/msgpack",
    TextHTML = "text/html",
    TextCSS = "text/css",
    TextHTMLCharsetUTF8 = "text/html, charset=UTF-8",
    TextPlain = "text/plain",
    TextPlainCharsetUTF8 = "text/plain, charset=UTF-8",
    MultipartForm = "multipart/form-data",
    OctetStream = "application/octet-stream",
    JPEGImage = "image/jpeg",
    JPGImage = "image/jpeg",
    PNGImage = "image/png",
}