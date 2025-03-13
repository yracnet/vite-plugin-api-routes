# vite-plugin-api-routes

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/yracnet/vite-plugin-api-routes.svg?branch=main)](https://travis-ci.org/yracnet/vite-plugin-api-routes)

## Apology for Project Renaming

🙏 **Dear Community,**

We sincerely apologize for the recent project name changes. After careful consideration and feedback, we've settled on the name **vite-plugin-api-routes**. We understand that these changes might have caused confusion, and we appreciate your understanding.

Thank you for your continued support and flexibility.

Best regards,

[Willyams Yujra](https://github.com/yracnet)

## Additional Resources

For more detailed information and resources related to `vite-plugin-api-routes`, please refer to the following:

- **npm Package**: [vite-plugin-api-routes](https://www.npmjs.com/package/vite-plugin-api-routes)
- **GitHub Repository**: [yracnet/vite-plugin-api-routes](https://github.com/yracnet/vite-plugin-api-routes)
- **Dev.to Article**: [Enhancing API Routing in Vite.js with vite-plugin-api](https://dev.to/yracnet/enhancing-api-routing-in-vitejs-with-vite-plugin-api-p39)
  - [Dev.to Article: CRUD User API + GUI in ViteJS](https://dev.to/yracnet/crud-user-api-gui-in-vitejs-df8)
- **Tutorial Legacy**: [Tutorial Legacy on vite-plugin-api-routes](./tutorial-legacy.md)
- **Tutorial Isolated**: [Tutorial Isolated on vite-plugin-api-routes](./tutorial-isolated.md)
- **Tutorial CRUD**: [Tutorial Isolated on vite-plugin-api-routes](./tutorial-crud.md)

## Vision

Enhance API routing in ViteJS based on directory structure for improved visibility and project structure in Node.js and Express.

See the [tutorial](./tutorial.md)

## Motivation

- Simplify project configuration.
- Convert the directory tree into route rules.

### Example Structure:

Legacy

```bash
> tree src/api/
src/api/:
├───admin
│   ├───auth
│   │   ├───login.js
│   │   └───status.js
│   └───user
│       ├───index.js
│       └───[userId]        //Remix Format
│           ├───index.js
│           └───detail.js
├───site
│   ├───article
│   │   ├───$articleId.js   //NextJS Format
│   │   └───new.js
│   └───page
│       ├───$pageId.js
│       └───new.js
└───index.js
```

The directory tree is exported as router rules tree:

```bash
GET     /api/site/
USE     /api/admin/user
GET     /api/admin/user
GET     /api/admin/user/
POST    /api/admin/user/
GET     /api/admin/auth/login
POST    /api/admin/auth/login
GET     /api/site/article/new
GET     /api/admin/auth/status
POST    /api/admin/auth/status
GET     /api/site/page/:pageId
GET     /api/admin/user/:userId/
PUT     /api/admin/user/:userId/
DELETE  /api/admin/user/:userId/
GET     /api/site/article/:articleId
GET     /api/admin/user/:userId/detail
```

For example, the `src/api/admin/user/$userId.js` file exports allowed request methods:

```js
//file:src/api/admin/user/$userId.js
export const DELETE = (req, res, next) => {
  res.send("DELETE REQUEST");
};
export const PUT = async (req, res, next) => {
  res.send("PUT REQUEST");
};
// Support default, GET, HEAD, POST, PUT, DELETE by default
// For CONNECT, OPTIONS, TRACE, PATCH, and others, you need to add the mapping to the mapper attribute config

// If you need middlewares for a route, simply export an array containing all middlewares as the default
export default [authMiddleware, secondMiddleware /* ... */];
```

Similarly, the `[userId].js` or `$userId.js` file name is exported as a request parameter `/user/:userId`, following the Next.js/Remix framework.

## How to Use

### Install

```bash
yarn add vite-plugin-api-routes
```

### Configure Aliases TypeScript

In order to have proper access to the plugin's alias definitions, you need to include `/.api/env.d.ts` in either `src/vite-env.d.ts` or in your `tsconfig.json`.

In your `src/vite-env.d.ts`, add the following line:

```typescript
/// <reference path="../.api/env.d.ts" />
```

### Configuration

In `vite.config.ts`:

```js
import { defineConfig } from "vite";
import { pluginAPIRoutes } from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    pluginAPIRoutes({
      // mode: "legacy",
      // moduleId: "@api",
      // cacheDir: ".api",
      // server: "[cacheDir]/server.js",
      // handler: "[cacheDir]/handler.js",
      // configure: "[cacheDir]/configure.js",
      // routeBase: "api",
      // dirs: [{ dir: "src/api"; route: "", exclude?: ["*.txt", ".csv", "data/*.*"] }],
      // include: ["**/*.js", "**/*.ts"],
      // exclude: ["node_modules", ".git"],
      // mapper: { default: "use", GET: "get", ... },
      // disableBuild: false,
      // clientOutDir = "dist/client",
      // clientMinify = true,
      // clientBuild = (config: InlineConfig) => config,
      // serverOutDir = "dist",
      // serverMinify = false,
      // serverBuild = (config: InlineConfig) => config,
    }),
  ],
});
```

### Parameters

- **mode**: Mode generate router files, LEGACY: is the first version, ISOLATED: is the split definition.
- **moduleId**: Name of the virtual module, default @api (used for imports, change if conflicts occur).
- **server**: The main file to build as the server app. [See default file.](./example/src/custom-server-example/server.ts)
- **handler**: The main file to register the API. It is called in viteServer and is the default entry. [See default file.](./example/src/custom-server-example/handler.ts)
- **configure**: The configureFile centralizes server configuration for both development (viteServer) and production (express). This file is invoked in various lifecycle hooks of the server. [See default file.](./example/src/custom-server-example/configure.ts)
- **routeBase**: Base name route for all routes. The default value is **api**.
- **dirs**: List of directories to be scanned. The default value is **[ { dir: 'src/api', route: '', exclude: []} ]**.
- **include**: Files and directories to include in the scan process. The default value is **["\\*\\*/_.js", "\\*\\*/_.ts"]**.
- **exclude**: Files and directories to exclude from the scan process. The default value is **["node_modules", ".git"]**.
- **mapper**: Mapping rules from exported functions to server instance methods.
- **cacheDir**: Cache Directory target to write temp files.
- **disableBuild**: Disabled the build process in the plugin, allowing other plugins, such as vite-plugin-builder, to handle the build process instead.
- **clientOutDir**: Client out directory
- **clientMinify**: Client minify output
- **clientBuild**: Client prev vite configuration
- **serverOutDir**: Server out directory
- **serverMinify**: Server minify output
- **serverBuild**: Server prev vite configuration

> **Note:** When building the project, the server entry will be built first, before the client is compiled.

## Default Mapper

**Default Value**

```js
mapper: {
  //[Export Name]: { method: [Http Verbose], priority: number }
  default: { method: "use", priority: 0 },
  USE: { method: "use", priority: 10 },
  GET: { method: "get", priority: 20 },
  POST: { method: "post", priority: 30 },
  PATCH: { method: "patch", priority: 40 },
  PUT: { method: "put", priority: 50 },
  DELETE: { method: "delete", priority: 60 },
  // Overwrite
  ...mapper,
};
```

## Legacy Custom Mapping

**/vite.config.js**

```js
export default defineConfig({
  plugins: [
    pluginAPIRoutes({
      mapper: {
        /**
         * Legacy Mapper
         *   export const PING = ()=>{...}
         *   Will be mapped to express method
         *   import { PING, ... } from "path/to/file"
         *   app.post2('/path/dir', PING)
         */
        PING: "get",
        /**
         * Legacy Mapper
         *   export const OTHER_POST = ()=>{...}
         *   Will be mapped to possible method
         *   import { OTHER_POST } from "path/to/file"
         *   app.post2('/path/dir', OTHER_POST)
         */
        OTHER_POST: "post2",
        /**
         * export const PATCH = ()=>{...}
         * Will not be mapped
         */
        PATCH: false,
      },
    }),
  ],
});
```

You can disable a method by setting its value to false. In the example `PATCH: false`, the PATCH method is disabled.

**/src/api/index.js**

```javascript
export const PING = (req, res, next) => {
  res.send({ name: "Ping Service" });
};
export const OTHER_POST = (req, res, next) => {
  res.send({ name: "Other Service" });
};
export const PATCH = (req, res, next) => {
  res.send({ name: "Path Service" });
};
```

## Isolated Mapped

This is a new configuration for ISOLATED mode, allow split the definition GET, POST, PUT in a single file, for apply the single responsability and allow create a help files into the same directorio

```bash
> tree src/api/
src/api/:
├───admin
│   ├───auth
│   │   ├───login
│   │   │   └───POST.js
│   │   └───status
│   │       └───GET.ts
│   └───user
│       ├───GET.js
│       ├───POST.js
│       └───[userId]         //Remix Format
│           ├───USE.js
│           ├───PUT.js
│           ├───validated.js // Will be ignored in the mapped if not defined in mapper config
│           ├───PUSH.js
│           └───DELETE.js
├───site
│   ├───USE.js
│   ├───article
│   │   ├───$articleId    //NextJS Format
│   │   │   └───GET.js
│   │   └───new
│   │       ├───USE.js
│   │       └───GET.js
│   └───page
│       ├───$pageId
│       │   └───GET.ts
│       └───new
│           ├───USE.ts
│           └───GET.js
└───ping
    └───GET.js
```

The directory tree is exported as router rules tree:

```bash
GET     /api/ping
POST    /api/admin/auth/login/
GET     /api/admin/auth/status/
GET     /api/admin/user/
POST    /api/admin/user/
USE     /api/site/
USE     /api/site/article/new/
GET     /api/site/article/new/
USE     /api/site/page/new/
GET     /api/site/page/new/
USE     /api/admin/user/:userId/
PUT     /api/admin/user/:userId/
PUSH    /api/admin/user/:userId/
DELETE  /api/admin/user/:userId/
GET     /api/site/article/:articleId/
GET     /api/site/page/:pageId/
```

### Isolated Custom Mapping

**/vite.config.js**

```js
export default defineConfig({
  plugins: [
    pluginAPIRoutes({
      mode: "isolated",
      mapper: {
        /**
         * Isolated Mapper
         *   //file: PING.js or PING.ts
         *   export default ()=>{...}         *
         *   Will be mapped to express method
         *   import PING from "path/to/PING.ts"
         *   app.get('/path/dir', PING)
         *
         *   Will be mapped after all methods
         */
        PING: "get",
        /**
         * Isolated Mapper
         *   //file: OTHER_POST.js or OTHER_POST.ts
         *   export default ()=>{...}
         *   Will be mapped to possible method
         *   import OTHER_POST from "path/to/OTHER_POST.js"
         *   app.post2('/path/dir', OTHER_POST)
         *
         *   Will be mapped before the POST
         */
        OTHER_POST: { method: "post2", priority: 29 },
        /**
         * export const PATCH = ()=>{...}
         * Will not be mapped
         */
        PATCH: false,
      },
    }),
  ],
});
```

**/src/api/path/to/PING.js**

```js
export default (req, res) => {
  res.send("Ping Service");
};
```

**/src/api/path/to/OTHER_POST.js**

```js
export default (req, res) => {
  res.send("Other Post Service");
};
```

## Custom File

### Handler File

**/src/handler.js** or see [handler.js](./example/src/custom-server-example/handler.ts)

```typescript
import express from "express";
import { applyRouters } from "@api/routers";
import * as configure from "@api/configure";

export const handler = express();

configure.handlerBefore?.(handler);

applyRouters((props) => {
  const { method, route, path, cb } = props;
  if (handler[method]) {
    if (Array.isArray(cb)) {
      handler[method](route, ...cb);
    } else {
      handler[method](route, cb);
    }
  } else {
    console.log("Not Support", method, "for", route, "in", handler);
  }
});

configure.handlerAfter?.(handler);
```

### Server File

**/src/server.ts** or see [server.ts](./example/src/custom-server-example/server.ts)

```typescript
import { handler } from "@api/handler";
import { endpoints } from "@api/routers";
import * as configure from "@api/configure";
import express from "express";

const server = express();
configure.serverBefore?.(server);
const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
configure.serverAfter?.(server);
server.on("error", (error) => {
  console.error(`Error at http://localhost:${PORT}`, error);
  configure.serverError?.(server, error);
});
server.on("listening", () => {
  console.log(`Ready at http://localhost:${PORT}`);
  configure.serverListening?.(server, endpoints);
});
server.listen(PORT);
```

### Configure File

**/src/configure.ts** or see [configure.ts](./example/src/custom-server-example/configure.ts)

```typescript
import express from "express";
import {
  CallbackHook,
  StatusHook,
  ServerHook,
  HandlerHook,
  ViteServerHook,
} from "vite-plugin-api-routes/configure";
// import { ApplyRouter, ApplyRouters } from "vite-plugin-api-routes/routes"
// import { Callback, RouteInfo, RouteModule } from "vite-plugin-api-routes/handler"

export const serverBefore: ServerHook = (server) => {};
export const serverAfter: ServerHook = (server) => {};
export const serverListening: StatusHook = (server, endpoints) => {};
export const serverError: StatusHook = (server, error) => {};
export const handlerBefore: HandlerHook = (handler) => {};
export const handlerAfter: HandlerHook = (handler) => {};
export const viteServerBefore: ViteServerHook = (server) => {};
export const viteServerAfter: ViteServerHook = (server) => {};
```

## Development Mode

In development mode, the plugin will serve API routes via the **Vite server**. This allows you to quickly test and iterate on your API routes without having to build or restart the server manually.

You can run the development server with:

```bash
yarn dev
```

This will launch a Vite development server and automatically handle hot module replacement (HMR) for both the frontend and backend.

## Production Mode

For production, you can bundle and build your application as usual with Vite. The plugin will ensure that the API routes are correctly compiled and ready to be served.

To build the project, simply run:

```bash
yarn build
```

Then, deploy the generated output to your production environment.

## Contribution

If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Install dependencies by running `yarn install`.
4. Make your changes and test them locally.
5. Submit a pull request with a detailed description of your changes.

Please make sure your code follows the style guidelines and is well-tested before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to [Vite.js](https://vitejs.dev/) for providing a powerful development framework.
- Special thanks to the open-source contributors and community for your feedback and contributions!
