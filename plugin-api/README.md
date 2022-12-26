# vite-plugin-api

Create API routes from path directory like to [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction), but this plugin extends the funcionality for backend development using vite.

## Motivation

- I will tried to simplify the configuration project.
- Convert the directory tree to route rules.

### [For example:](./../example/src/api/)

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

The directory tree will be export to router rules tree:

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

Where the `src/api/v1/user/$userId.js` file export the allow request methods:

```js
//file:src/api/v1/user/$userId.js
export const DELETE = (req, res, next) => {
  res.send("DELETE REQUEST");
};
export const PUT = async (req, res, next) => {
  res.send("PUT REQUEST");
};
// Support default, GET, HEAD, POST, PUT, DELETE by default
// for CONNECT, OPTIONS, TRACE, PATCH and others you need add the mapping to mapper attribute config
```

Same the NextJS/Remix framework the `[userId].js` or `$userId.js` file name will be exported as request parameter `/user/:userId`.

## How to use

### Install

```bash
yarn add vite-plugin-api
```

### Configure

In [vite.config.ts](./../example/vite.config.ts)

```js
import { defineConfig } from "vite";
import { pluginAPI } from "vite-plugin-api";

export default defineConfig({
  plugins: [
    pluginAPI({
      // routeBase?: "api",
      // dirs?: [{ dir: "src/api"; route: "" }],
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

### Parameters:

- **routeBase**: Base name route for all routes,
  default value is **api**
- **dirs**: List of directory to will be scan,
  default value is **[ { dir: 'src/api', route: ''} ]**
- **include**: Files and directory include in scan process, default value is **["\*\*/_.js", "\*\*/_.ts"]**
- **exclude**: Files and directory exclude in scan process, default value is **["node_modules", ".git"]**
- **moduleId**: Name the virtual module,
- **entry**: It is the main file to build as server app. [See default file.](./src/plugin/runtime/server.js)
- **handler**: It is the main file to register the api, it is caller in viteServer and default entry. [See default file.](./src/plugin/runtime/handler.js)
- **mapper**: It is a mapping rules from exports function to server instance methods.

## Mapper

**Default value**

```js
mapper: {
  default: "use",
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
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
        // Will be mapping to express method
        // app.get('/path/dir', PING)
        OTHER_POST: "post2",
        // export const PATCH = ()=>{...}
        // Will not be mapping
        PATCH: false,
      },
    }),
  ],
});
```

You can disabled a method setting false value. In the example ` PATCH: false`, the PATCH method be disabled.

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
      console.log("App not support", method, "verbose");
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

For loading definition package for "virtual:vite-plugin-api:config" and virtual:vite-plugin-api:router" add:

src/env.d.ts

```ts
/// <reference types="vite-plugin-api/client" />
```

## Env

Only load to process.env the keys that start with prefix "API\_"

## TO DO:

- Doble declaration (**GET** in _/user.ts_ and _/user/index.ts_). Handler definition is required.
- Extends the mapper attribute for support a custom http method using a header attribute.
