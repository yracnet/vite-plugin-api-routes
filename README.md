# vite-plugin-api

Enhance API routing in ViteJS based on directory structure for improved visibility and project structure in Node.js and Express.

See the [tutorial](./tutorial)

## Motivation

- Simplify project configuration.
- Convert the directory tree into route rules.

### Example Structure:

```bash
> tree src/api/
src/api/:
├───v1
│   │   auth.js
│   │   index.js
│   ├───auth
│   │       login.js
│   │       status.js
│   └───user
│           $userId.js    //Remix Format
│           index.js
└───v2
    │   user.js
    ├───auth
    │       login.js
    │       status.js
    └───user
            index.js
            [userId].js    //NextJS Format
```

The directory tree is exported as router rules tree:

```bash
GET     /api/v1
USE     /api/v1/auth
PUT     /api/v1/auth
DELETE  /api/v1/auth
GET     /api/v1/auth/login
POST    /api/v1/auth/login
GET     /api/v1/auth/status
POST    /api/v1/auth/status
GET     /api/v1/user/
POST    /api/v1/user/
PUT     /api/v1/user/:userId
DELETE  /api/v1/user/:userId
GET     /api/v2/auth/login
POST    /api/v2/auth/login
GET     /api/v2/auth/status
POST    /api/v2/auth/status
USE     /api/v2/user
PUT     /api/v2/user
DELETE  /api/v2/user
GET     /api/v2/user/
POST    /api/v2/user/
PUT     /api/v2/user/:userId
DELETE  /api/v2/user/:userId
```

For example, the `src/api/v1/user/$userId.js` file exports allowed request methods:

```js
//file:src/api/v1/user/$userId.js
export const DELETE = (req, res, next) => {
  res.send("DELETE REQUEST");
};
export const PUT = async (req, res, next) => {
  res.send("PUT REQUEST");
};
// Support default, GET, HEAD, POST, PUT, DELETE by default
// For CONNECT, OPTIONS, TRACE, PATCH, and others, you need to add the mapping to the mapper attribute config
```

Similarly, the `[userId].js` or `$userId.js` file name is exported as a request parameter `/user/:userId`, following the Next.js/Remix framework.

## How to Use

### Install

```bash
yarn add vite-plugin-api
```

### Configuration

In `vite.config.ts`:

```js
import { defineConfig } from "vite";
import { pluginAPI } from "vite-plugin-api";

export default defineConfig({
  plugins: [
    pluginAPI({
      // routeBase?: "api",
      // dirs?: [{ dir: "src/api"; route: "", exclude?: ["*.txt", ".csv", "data/*.*"] }],
      // include?: ["**/*.js", "**/*.ts"],
      // exclude?: ["node_modules", ".git"],
      // moduleId?: "virtual:vite-plugin-api",
      // mapper?: { default: "use", GET: "get", ... },
      // entry?: "[node_module:lib]/server.js",
      // handler?: "[node_module:lib]/handler.js",
    }),
  ],
});
```

### Parameters

- **routeBase**: Base name route for all routes. The default value is **api**.
- **dirs**: List of directories to be scanned. The default value is **[ { dir: 'src/api', route: '', exclude: []} ]**.
- **include**: Files and directories to include in the scan process. The default value is **["\\*\\*/_.js", "\\*\\*/_.ts"]**.
- **exclude**: Files and directories to exclude from the scan process. The default value is **["node_modules", ".git"]**.
- **moduleId**: Name of the virtual module.
- **entry**: The main file to build as the server app. [See default file.](./src/plugin/runtime/server.js)
- **handler**: The main file to register the API. It is called in viteServer and is the default entry. [See default file.](./src/plugin/runtime/handler.js)
- **mapper**: Mapping rules from exported functions to server instance methods.

## Mapper

**Default Value**

```js
mapper: {
    default: "use",
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  // Overwrite
  ...mapper,
};
```

### Custom Mapping

**/vite.config.js**

```js
export default defineConfig({
  plugins: [
    createAPI({
      entry: "src/custom-server.js",
      mapper: {
        PING: "get",
        // export const PING = ()=>{...}
        // Will be mapped to express method
        // app.get('/path/dir', PING)
        OTHER_POST: "post2",
        // export const PATCH = ()=>{...}
        // Will not be mapped
        PATCH: false,
      },
    }),
  ],
});
```

You can disable a method by setting its value to false. In the example `PATCH: false`, the PATCH method is disabled.
**/src/api/index.js**

```javascript
export PING = (req, res, next)=>{
    res.send({name:"Ping Service"});
}
export OTHER_POST = (req, res, next)=>{
    res.send({name:"Ping Service"});
}
export PATCH = (req, res, next)=>{
    res.send({name:"Ping Service"});
}
```

**/src/custom-server.js** or see [entry-server.js](./../example/src/entry-server.js)

```javascript
import express from "express";
import { applyRouters } from "virtual:vite-plugin-api:router";
const app = express();
app.post2 = (req, res, next) => {
  console.log("Custom POST2");
  app.post(req, res, next);
};
applyRouters(
  (props) => {
    const { source, method, path, route, cb } = props;
    // route is a path without routeBase
    // source is a full path file
    if (app[method]) {
      app[method](path, cb);
    } else {
      console.log("App does not support", method, "verbose");
    }
  },
  (cb) => async (req, res, next) => {
    try {
      res.message = "My high order component for callback";
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

app.listen(3000, () => {
  console.log("Ready at http://localhost:3000");
});
```

## TypeScript

To load the definition package for "virtual:vite-plugin-api:config" and "virtual:vite-plugin-api:router", add:
src/env.d.ts

```ts
/// <reference types="vite-plugin-api/client" />
```

## Environment Variables

Only keys starting with the prefix "API\_" will be loaded into `process.env`.

## TO DO:

- Duplicate declaration (**GET** in _/user.ts_ and _/user/index.ts_). Handler definition is required.
- Extend the `mapper` attribute to support custom HTTP methods using a header attribute.
