# vite-plugin-api

Create API routes from path directory like to [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction), but this plugin extends the funcionality for backend development using vite.

## Motivation

I will tried to simplify the configuration project.

### [For example:](./example/src/api/)

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

The tree structure directory will be export to tree route rules:

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
// Support default, GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH
```

Same the Next/Remix framework the `[userId].js` or `$userId.js` file name will be exported as request parameter `/user/:userId`.

## How to use

### Install

```bash
yarn add vite-plugin-api
```

### Configure

In [vite.config.js](./example/vite.config.js)

```js
import { defineConfig } from "vite";
import { pluginAPI } from "vite-plugin-api";

export default defineConfig({
  plugins: [
    pluginAPI({
      // baseRoute?: "api",
      // dirs?: [{ dir: "src/api"; route: "/" }],
      // include?: ["**/*.js", "**/*.ts"],
      // exclude?: ["node_modules", ".git"],
      // moduleId?: "virtual:api-router",
      // fnVerbs?: { default: "use", GET: "get", ... },
      // entry?: "[node_module:lib]/app-server.js",
    }),
  ],
});
```

### Parameters:

- **baseRoute**: Base name route for all routes,
  by default is **/api/**
- **dirs**: List of directory to will be scan,
  by default is **[ { dir: 'src/api', route: '/'} ]**
- **include**: Files and directory include in scan process
- **exclude**: Files and directory exclude in scan process
- **moduleId**: Name the virtual module,
  by default is **["node_modules", ".git"]**
- **entry**: It is the main file to build as server app.
- **fnVerbs**: It is a mapping rules from exports function to server instance methods.

## fnVerbs

**Default value**

```js
fnVerbs: {
  default: "use",
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  // Overwrite
  ...fnVerbs,
};
```

### Custom Mapping

**/vite.config.js**

```js
export default defineConfig({
  plugins: [
    createAPI({
      entry: "src/custom-server.js",
      fnVerbs: {
        PING: "get",
        // export const PING = ()=>{...}
        // Will be mapping to express method
        // app.get('/path/dir', PING)
        OTHER_POST: "post2",
      },
    }),
  ],
});
```

**/src/api/index.js**

```javascript
export PING = (req, res, next)=>{
  res.send({name:"Ping Service"});
}
export OTHER_POST = (req, res, next)=>{
  res.send({name:"Ping Service"});
}
```

**/src/custom-server.js** or see [entry-server.js](./example/src/entry-server.js)

```javascript
import express from "express";
import { applyRouters } from "virtual:api-router";

const app = express();

app.post2 = (req, res, next) => {
  console.log("Custom POST2");
  app.post(req, res, next);
};

applyRouters((method, route, callback) => {
  if (app[method]) {
    app[method](route, callback);
  } else {
    console.log("App not support", method, "verbose");
  }
});

app.listen(3000, () => {
  console.log("Ready at http://localhost:3000");
});
```
