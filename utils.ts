

export class Utils {

    /**
     * Removes trailing slashes from a passed string.
     * @param message message: The message from which the trailing slash will be removed.
     * @param single single: whether one, or all trailing slashes (default) should be removed.
     * @returns A string without trailing slashes.
     */
    public static removeTrailingSlash(message: string, single: boolean = false): string {
        // If the message does not end with a slash to
        // begin with, we do nothing to it.
        if (!message.endsWith('/')) return message

        // If the message does end with one or more slashes
        // we remove one of those slashes
        const chars = message.split('')
        chars.pop()

        // If only one slash should be removed
        if (single) return chars.join('')

        // Otherwise, if we want to remove all trailing slashes (the default):
        // Remove each trailing slash until there are no
        // more slashes at the end of the string.
        while (chars.join('').endsWith('/')) chars.pop()

        // return the message without trailing slashes
        return chars.join('')
    }


    public static logPassiveError(message: string) {
        try {
            throw new Error(message)
        } catch (err) { console.error(err) };
    }
}