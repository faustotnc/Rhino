import { RhinoRequest, RhinoResponse, NextHook } from '../mod.ts';

/**
 * Function to be executed when the application
 * encounters an error code that matches the parent
 * class' error code.
 */
export interface onErrorExecution {
    executeError(): void;
}

/**
 * The Rhino_Error decorator attaches errorCode as
 * a property of the decorated class
 */
interface errorCodeProperty {
    errorCode: number;
};

/**
 * Defines the properties available inside a class
 * decorated with @Rhino_Error.
 */
export type RhinoErrorHandler = onErrorExecution & errorCodeProperty;

/**
 * Defines the arguments a Rhino Error Class can take.
 */
export type ErrorClass = {
    new(errorData: ErrorData, req: RhinoRequest, res: RhinoResponse, next: NextHook, err: NextError): any;
};

/**
 * The data that is sent when a new Rhino error is called
 */
export interface ErrorData {
    code: number;
    data?: any
};

/**
 * The next rhino error handler
 */
export type NextError = (errData: ErrorData) => void;


/**
 * The decorator that makes a class a "Rhino Error Handler."
 * This decorator attaches the different properties
 * for the error handler so that they can be accessed when
 * the class is instantiated.
 * @param code The error code that is class is able to resolve
 * 
 */
export const Rhino_Error = (code: number) => {
    return <T extends { new(...args: any[]): {} }>(target: T) => {

        // Attaches the hook parameters to the prototype
        // of the class so that they can be accessed later
        // without creating a new instance of the class.
        target.prototype.err = code;

        // Adds the server properties to the decorated class
        return class extends target implements RhinoErrorHandler {
            public errorCode = code;

            // Attaches the onHandle method to the class if it exists
            public executeError = target.prototype.executeError || (() => { });
        }
    }
}

