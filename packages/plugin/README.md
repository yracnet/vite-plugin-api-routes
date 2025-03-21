# vite-plugin-api-routes

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/yracnet/vite-plugin-api-routes.svg?branch=main)](https://travis-ci.org/yracnet/vite-plugin-api-routes)

## Vision

`vite-plugin-api-routes` enhances API routing in ViteJS based on directory structure for improved visibility and project organization in Node.js and Express applications.

## Motivation

- Simplify project configuration
- Convert the directory tree into automatic routing rules

## Routing Modes

The plugin offers two approaches to define API routes:

### LEGACY Mode

In this approach, **a single file can handle multiple HTTP methods** through named exports.

**Example structure:**

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

**Generated mapping:**

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
# ... and many more routes
```

**LEGACY mode features:**

- Simple at the file system level
- One file handles multiple HTTP methods
- Hides the actual route structure
- Ideal for APIs with few endpoints or small projects

### ISOLATED Mode

In this approach, **each HTTP method is defined in a separate file**, which improves the visibility of available routes.

**Example structure:**

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

**Generated mapping:**

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

**ISOLATED mode features:**

- More explicit and understandable mapping
- One file per HTTP method
- Clear visibility of available endpoints
- Better organization for complex APIs
- Easier long-term maintenance

## Priority Mapping System

All methods are mapped to routes with priorities defined by the `mapper` attribute, allowing precise control over middleware execution order.

**Example configuration:**

```java
import { defineConfig } from "vite";
import api from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
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
        // Custom aliases
        AUTH:    { method: "use", priority: 11  }, // After default and before USE
        ERROR:   { method: "use", priority: 120 }, // After DELETE, FILES, and PARAMS
        LOGGER:  { method: "use", priority: 31  }, // After GET and before POST
      },
      filePriority:  100, // Default value for files
      paramPriority: 110, // Default value for parameters
    }),
  ],
});
```

**Example structure:**

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

**Generated mapping (respecting priorities):**

```js
USE     /api/                 src/api-isolated/AUTH.js          // after default and before USE
USE     /api/                 src/api-isolated/USE.js
GET     /api/                 src/api-isolated/GET.js
GET     /api/user/            src/api-isolated/user/GET.js
USE     /api/user/            src/api-isolated/user/LOGGER.js   // after GET and before POST
POST    /api/user/            src/api-isolated/user/POST.js
POST    /api/user/confirm/    src/api-isolated/user/confirm/POST.js
USE     /api/user/:id/        src/api-isolated/user/[id]/USE.js
PATCH   /api/user/:id/        src/api-isolated/user/[id]/PATCH.js
PUT     /api/user/:id/        src/api-isolated/user/[id]/PUT.js
DELETE  /api/user/:id/        src/api-isolated/user/[id]/DELETE.js
USE     /api/user/            src/api-isolated/user/ERROR.js    // after DELETE, FILES, and PARAMS
USE     /api/                 src/api-isolated/ERROR.js         // after DELETE, FILES, and PARAMS
```

## Installation and Basic Configuration

### Installation

```bash
yarn add vite-plugin-api-routes
```

### Vite Configuration

```js
import { defineConfig } from "vite";
import api from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    api(), // with default configuration
  ],
});
```

### TypeScript Configuration

To access type definitions, include the generated file in your project:

In `src/vite-env.d.ts`, add:

```ts
/// <reference path="../.api/env.d.ts" />
```

## Customization

The plugin allows customizing three main components:

- **Handler File**: `/src/handler.js` - Customize the route handler
- **Server File**: `/src/server.ts` - Customize the Express server
- **Configure File**: `/src/configure.ts` - Customize server configuration

## Execution Environments

### Development Mode

In development, the plugin serves API routes through the Vite server with HMR support:

```bash
yarn dev
```

### Production Mode

For production, build your application normally:

```bash
yarn build
```

## Additional Resources

- **npm Package**: [vite-plugin-api-routes](https://www.npmjs.com/package/vite-plugin-api-routes)
- **GitHub Repository**: [yracnet/vite-plugin-api-routes](https://github.com/yracnet/vite-plugin-api-routes)
- **Articles**:
  - [Enhancing API Routing in Vite.js with vite-plugin-api](https://dev.to/yracnet/enhancing-api-routing-in-vitejs-with-vite-plugin-api-p39)
  - [CRUD User API + GUI in ViteJS](https://dev.to/yracnet/crud-user-api-gui-in-vitejs-df8)
- **Tutorials**:
  - [Tutorial Legacy](./tutorial-legacy.md)
  - [Tutorial Isolated](./tutorial-isolated.md)
  - [Tutorial CRUD](./tutorial-crud.md)
- **Previous Documentation**:
  - [README 1.0](./README_1.0.md)

## License

This project is licensed under the [MIT License](LICENSE).

## Version Notes

### Project Renaming

🙏 **Dear Community,**

We sincerely apologize for the recent project name changes. After careful consideration and feedback, we've settled on the name **vite-plugin-api-routes**. We understand that these changes might have caused confusion, and we appreciate your understanding.

Thank you for your continued support and flexibility.

Best regards,

[Willyams Yujra](https://github.com/yracnet)
