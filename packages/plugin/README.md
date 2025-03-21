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

### OLD Document

- **README 1.0**: [Readme on vite-plugin-api-routes](./README_1.0.md)

## Vision

Enhance API routing in ViteJS based on directory structure for improved visibility and project structure in Node.js and Express.

See the [tutorial](./tutorial.md)

## Motivation

- Simplify project configuration.
- Convert the directory tree into route rules.

### LEGACY: Example Structure

Based on the file system structure.

```bash
$ tree src/api-legacy
src/api-legacy
├── index.js
└── user
    ├── [id]
    │   └── index.js
    ├── confirm.js
    └── index.js
```

The directory tree will be exported to possible methods because the file will have different methods exported.

```bash
USE     /api/                src/api-legacy/index.js?fn=default
GET     /api/                src/api-legacy/index.js?fn=GET
POST    /api/                src/api-legacy/index.js?fn=POST
PATCH   /api/                src/api-legacy/index.js?fn=PATCH
PUT     /api/                src/api-legacy/index.js?fn=PUT
DELETE  /api/                src/api-legacy/index.js?fn=DELETE
USE     /api/user/           src/api-legacy/user/index.js?fn=USE
GET     /api/user/           src/api-legacy/user/index.js?fn=GET
POST    /api/user/           src/api-legacy/user/index.js?fn=POST
PATCH   /api/user/           src/api-legacy/user/index.js?fn=PATCH
PUT     /api/user/           src/api-legacy/user/index.js?fn=PUT
DELETE  /api/user/           src/api-legacy/user/index.js?fn=DELETE
USE     /api/user/confirm    src/api-legacy/user/confirm.js?fn=default
GET     /api/user/confirm    src/api-legacy/user/confirm.js?fn=GET
POST    /api/user/confirm    src/api-legacy/user/confirm.js?fn=POST
PATCH   /api/user/confirm    src/api-legacy/user/confirm.js?fn=PATCH
PUT     /api/user/confirm    src/api-legacy/user/confirm.js?fn=PUT
DELETE  /api/user/confirm    src/api-legacy/user/confirm.js?fn=DELETE
USE     /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=default
GET     /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=GET
POST    /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=POST
PATCH   /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=PATCH
PUT     /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=PUT
DELETE  /api/user/:id/       src/api-legacy/user/[id]/index.js?fn=DELETE
```

The legacy mapping is simple in the file system, but it hides the real route structure.

### ISOLATED: Example Structure

Based on the file system structure

```bash
$ tree src/api-isolated
src/api-isolated
├── GET.js
├── USE.js
└── user
    ├── [id]
    │   ├── DELETE.js
    │   ├── PATCH.js
    │   ├── PUT.js
    │   └── USE.js
    ├── confirm
    │   └── POST.js
    ├── GET.js
    └── POST.js
```

The directory tree will be mapped to specific methods.

```log
USE     /api/                 src/api-isolated/USE.js
GET     /api/                 src/api-isolated/GET.js
GET     /api/user/            src/api-isolated/user/GET.js
POST    /api/user/            src/api-isolated/user/POST.js
POST    /api/user/confirm/    src/api-isolated/user/confirm/POST.js
USE     /api/user/:id/        src/api-isolated/user/[id]/USE.js
PATCH   /api/user/:id/        src/api-isolated/user/[id]/PATCH.js
PUT     /api/user/:id/        src/api-isolated/user/[id]/PUT.js
DELETE  /api/user/:id/        src/api-isolated/user/[id]/DELETE.js
```

The isolated mapping is a more comprehensible mapping of the file system.

## Order Mapping

All methods will be mapped to routes with priority defined by the mapper attribute.

```js
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import api from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    react(),
    api({
      mapper: {
        // Default Mapping
        default: { method: "use",    priority: 10 },
        USE:     { method: "use",    priority: 20 },
        GET:     { method: "get",    priority: 30 },
        POST:    { method: "post",   priority: 40 },
        PATCH:   { method: "patch",  priority: 50 },
        PUT:     { method: "put",    priority: 60 },
        DELETE:  { method: "delete", priority: 70 },
        // You can attach new ALIAS for LEGACY and ISOLATED
        // It will be mapped after default and before USE.
        AUTH:    { method: "use",    priority: 11  },
        // It will be mapped after DELETE, FILES, and PARAMS.
        ERROR:   { method: "use",    priority: 120 },
        // It will be mapped after GET and before POST.
        LOGGER:  { method: "use",    priority: 31  },
      },
      // Default value for file
      filePriority = 100,
      // Default value for param
      paramPriority = 110,
    }),
  ],
});
```

Based on the file system structure

```bash
$ tree src/api-isolated/
src/api-isolated/
├── AUTH.js
├── ERROR.js
├── GET.js
├── USE.js
└── user
    ├── [id]
    │   ├── DELETE.js
    │   ├── PATCH.js
    │   ├── PUT.js
    │   └── USE.js
    ├── confirm
    │   └── POST.js
    ├── ERROR.js
    ├── GET.js
    ├── LOGGER.js
    └── POST.js
```

The directory tree will be exported to specific methods, with new declared methods, respecting the priority value.

```js
USE     /api/                 src/api-isolated/AUTH.js          //after default and before USE.
USE     /api/                 src/api-isolated/USE.js
GET     /api/                 src/api-isolated/GET.js
GET     /api/user/            src/api-isolated/user/GET.js
USE     /api/user/            src/api-isolated/user/LOGGER.js   // after GET and before POST.
POST    /api/user/            src/api-isolated/user/POST.js
POST    /api/user/confirm/    src/api-isolated/user/confirm/POST.js
USE     /api/user/:id/        src/api-isolated/user/[id]/USE.js
PATCH   /api/user/:id/        src/api-isolated/user/[id]/PATCH.js
PUT     /api/user/:id/        src/api-isolated/user/[id]/PUT.js
DELETE  /api/user/:id/        src/api-isolated/user/[id]/DELETE.js
USE     /api/user/            src/api-isolated/user/ERROR.js   // after DELETE, FILES, and PARAMS.
USE     /api/                 src/api-isolated/ERROR.js        // after DELETE, FILES, and PARAMS.
```

The directory tree will be exported to specific methods.

## How to Use

### Install

```bash
yarn add vite-plugin-api-routes
```

### Configure Aliases TypeScript

In order to have proper access to the plugin's alias definitions, you need to include `/.api/env.d.ts` in either `src/vite-env.d.ts` or in your `tsconfig.json`.

In your `src/vite-env.d.ts`, add the following line:

```ts
/// <reference path="../.api/env.d.ts" />
```

### Configuration

In `vite.config.ts`:

```js
import { defineConfig } from "vite";
import api from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    api(), // with default configurations
  ],
});
```

## Custom File

### Handler File

**/src/handler.js** or see [handler.js](./example/src/custom-server-example/handler.ts)

If you see the default handler file, see the cache file in `.api/handler.js`

### Server File

**/src/server.ts** or see [server.ts](./example/src/custom-server-example/server.ts)

If you see the default server file, see the cache file in `.api/server.js`

### Configure File

**/src/configure.ts** or see [configure.ts](./example/src/custom-server-example/configure.ts)

If you see the default configure file, see the cache file in `.api/configure.js`

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
