import { RhinoRequest, RhinoResponse, NextError } from '../mod.ts';

/**
 * Function to be executed when the application's
 * request-response middleware pipeline encounter's
 * the parent class's instance.
 */
export interface onHookExecution {
    executeHook(): void;
}

/**
 * The properties a Rhino_Hook decorator can
 * take inside its hookParameter argument
 */
interface hookParameter {
    path?: string;
    type: "PRE" | "AFTER"
};

/**
 * Defines the properties available inside a class
 * decorated with @Rhino_Hook.
 */
export type RhinoHook = onHookExecution & hookParameter;

/**
 * Defines the arguments an error class can take.
 */
export type HookClass = {
    new(req: RhinoRequest, res: RhinoResponse, next: NextHook, err: NextError): any;
};

/**
 * Calls The next hook
 */
export type NextHook = () => void;


/**
 * The decorator that makes a class a "Rhino Hook."
 * This decorator attaches the different properties
 * for the hook so that they can be accessed when
 * the class is instantiated.
 * @param hookParams The parameters that define this hook
 * 
 * TODO: Check path is valid
 * TODO: Check that no two hooks have the same path, unless they are "**"
 */
export const Rhino_Hook = (hookParams: hookParameter) => {
    return <T extends { new(...args: any[]): {} }>(target: T) => {

        // Attaches the hook parameters to the prototype
        // of the class so that they can be accessed later
        // without creating a new instance of the class.
        target.prototype.hookParams = hookParams;

        // Adds the server properties to the decorated class
        return class extends target implements RhinoHook {
            public type = hookParams.type;
            // If the path parameter is not provided, the we
            // define it as a "match-all" wildcard.
            public path = hookParams.path ?? "**";

            // Attaches the executeHook method to the class if it exists
            public executeHook = (target.prototype.executeHook) ? target.prototype.executeHook : () => { };
        }
    }
}

