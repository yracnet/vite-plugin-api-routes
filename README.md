# vite-plugin-api

Enhance API routing in ViteJS based on directory structure for improved visibility and project structure in Node.js and Express.

See the [tutorial](./tutorial.md)

## Motivation

- Simplify project configuration.
- Convert the directory tree into route rules.

### Example Structure:

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
│       ├───$articleId.js
│       └───new.js
└───index.js
```

The directory tree is exported as router rules tree:

```bash
GET     /api/site/
GET     /api/routers
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
export default [authMiddleware, secondMiddleware, /* ... */]; 
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
      // moduleId: "@api",  // Old version change to "virtual:vite-plugin-api",
      // server: "node_modules/.api/server.js",
      // handler: "node_modules/.api/handler.js",
      // routeBase: "api",
      // dirs: [{ dir: "src/api"; route: "", exclude?: ["*.txt", ".csv", "data/*.*"] }],
      // include: ["**/*.js", "**/*.ts"],
      // exclude: ["node_modules", ".git"],
      // mapper: { default: "use", GET: "get", ... },
    }),
  ],
});
```

### Parameters

- **moduleId**: Name of the virtual module, default @api (used for imports, change if conflicts occur).
- **server**: The main file to build as the server app. [See default file.](./example/src/custom-server-example/server.ts)
- **handler**: The main file to register the API. It is called in viteServer and is the default entry. [See default file.](./example/src/custom-server-example/handler.ts)
- **routeBase**: Base name route for all routes. The default value is **api**.
- **dirs**: List of directories to be scanned. The default value is **[ { dir: 'src/api', route: '', exclude: []} ]**.
- **include**: Files and directories to include in the scan process. The default value is **["\\*\\*/_.js", "\\*\\*/_.ts"]**.
- **exclude**: Files and directories to exclude from the scan process. The default value is **["node_modules", ".git"]**.
- **mapper**: Mapping rules from exported functions to server instance methods.
- **cacheDir**: Cache Directory target to write temp files.

## Mapper

**Default Value**

```js
mapper: {
  //[Export Name]: [Http Verbose]
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

**/src/handler.js** or see [handler.js](./example/src/custom-server-example/handler.ts)
```typescript
// @ts-nocheck
import express from "express";
import { applyRouters } from "@api/routers"; // Notice '@api', this is the moduleId!

export const handler = express();

// Add JSON-Parsing
handler.use(express.json());
handler.use(express.urlencoded({ extended: true }));

applyRouters(
  (props) => {
    const { method, route, path, cb } = props;
    if (handler[method]) {
      if(Array.isArray(cb)) {
        handler[method](route, ...cb);
      } else {
        handler[method](route, cb);
      }
    } else {
      console.log("Not Support", method, "for", route, "in", handler);
    }
  }
);
```

**/src/server.ts** or see [server.ts](./example/src/custom-server-example/server.ts)

```typescript
// @ts-ignore
import { handler } from "@api/handler"; // Notice '@api', this is the moduleId!
// @ts-ignore
import { endpoints } from "@api/routers"; // Notice '@api', this is the moduleId!
import express from "express";

const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;
const server = express();
server.use(express.json());
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}`);
  console.log(endpoints);
});
```

## TO DO:

- Duplicate declaration (**GET** in _/user.ts_ and _/user/index.ts_). Handler definition is required.
- Extend the `mapper` attribute to support custom HTTP methods using a header attribute.
