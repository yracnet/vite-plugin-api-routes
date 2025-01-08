/// <reference types="vite/client" />
/// <reference types="../.api/env.d.ts" />

declare namespace Express {
  export interface Request {
    session?: any;
    roles?: string[];
    version?: string;
    copyright?: string;
  }
}

declare var API_ROUTES: any;
