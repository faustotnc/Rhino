/**
 * Server classes are generic classes, therefore, they (on their own) do
 * not possess a specific set of properties and methods that must be
 * followed, (unless the server class is implementing OnServerListening),
 * hence, the interface NonSpecificClass defines a "generic" class that can
 * return anything.
 */
export interface DecoratedClass {
    new(...args: any[]): any;
}

// Exports the constants
export * from './constants.ts';

export * from './RhinoServer.ts';
export * from './Router/RhinoEndpoint.ts';
export * from './Router/RhinoRouter.ts';
export * from './ErrorHandlers/RhinoError.ts';
export * from './Request/RhinoRequest.ts'
export * from './Response/RhinoResponse.ts'
export * from './Hooks/RhinoHook.ts';
export * from './RhinoURL.ts'