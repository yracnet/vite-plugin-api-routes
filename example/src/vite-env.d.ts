/// <reference types="vite/client" />
/// <reference types="../.api/types.d.ts" />

declare namespace Express {
    export interface Request {
        session?: any;
        roles?: string[];
    }
}
