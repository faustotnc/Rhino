import { Utils } from "./utils.ts";

export class RhinoURL {
    /**
     * A set of useful methods & properties that can be
     * extracted from a client request url.
     * @param URL The client-requested URL
     */
    constructor(readonly URL: string) {}

    /**
     * Matches a path against the URL provided in the instance of the class
     * @param path Tha path to which the URL will be matched against.
     */
    public pathMatch(path: string): boolean {
        // If the path is a "match-all" wildcard, then
        // there is no need to check for the rest of the
        // arguments, and we return true
        if (path === "**") return true;

        let pathParts = path.split("/");
        let urlParts = this.URLFullPath.split("/");

        // If the parts of the provided path do not match, then we return false
        if (pathParts.length !== urlParts.length) return false;

        // We loop through each sections of the URL to check each part
        // of the endpoint against each part of the schema
        for (const [index, pathPart] of pathParts.entries()) {
            // For parts that are neither wildcards nor ReGex,
            // we check that they match exactly. If they do not
            // match exactly, then the url does not match the
            // structure, and we return false.
            if (
                !pathPart.startsWith(":") &&
                !pathPart.startsWith("{") &&
                !pathPart.endsWith("}") &&
                pathPart !== urlParts[index]
            )
                return false;

            // We do not need to check/match wildcard values since they can
            // be anything, but we do have to check Regular Expressions

            // If the current part of the structure defines a regular expression,
            // we test it against the corresponding URL part.
            if (pathPart.startsWith("{") && pathPart.endsWith("}")) {
                let isMatch = new RegExp(pathPart.substring(1, pathPart.length - 1).trim()).test(
                    urlParts[index]
                );

                // We return false only if there is no match
                if (!isMatch) return false;
            }
        }

        // If the urls match, we return true
        return true;
    }

    /**
     * Gets the parameters from a URL based on the schema for this class
     * @param Path The url from which to get the parameters
     * @returns An object containing the paramter-value pairs
     */
    public getParams(path: string): { [key: string]: string } {
        const urlParts = this.URLFullPath.split("/");
        // If the parts of the provided path do not match, then we return an empty object
        if (!this.pathMatch(path)) return {};

        // Will be populated with any params found
        const params: { [key: string]: string } = {};

        // Matches each part of the URL with the provided path
        path.split("/").forEach((part, index) => {
            // If the current part is not an URL parameter, we
            // proceed to check if the static parts of the URL match
            if (part.startsWith(":")) {
                let keyName = part.substr(1, part.length);
                params[keyName] = urlParts[index];
            }
        });

        // We return the matched params
        return params;
    }

    /**
     * Gets the queries from a URL
     * @returns An object containing the field-value pairs from the URL.
     *
     * Example: if the URL is "/root/admin/managers?username=john_doe&password=x2r",
     * the getQueries() method will return { username: "john_doe", password: "x2r" }
     */
    public getQueries(): { [key: string]: string } | {} {
        return Utils.ParseURLQueries(this.queryString);
    }

    /**
     * Returns the path part of the URL
     * For Example, if the URL is "/root/users/new?name=john&last-name=doe",
     * calling URLFullPath will return "/root/users/new"
     */
    public get URLFullPath() {
        return Utils.removeTrailingSlash(this.URL.split("?")[0]);
    }

    /**
     * Returns the query part of the URL
     * For Example, if the URL is "/root/users/new?name=john&last-name=doe",
     * calling queryString will return "name=john&last-name=doe"
     */
    public get queryString(): string {
        const queries = this.URL.split("?")[1];
        return queries ? Utils.removeTrailingSlash(queries) : "";
    }
}
