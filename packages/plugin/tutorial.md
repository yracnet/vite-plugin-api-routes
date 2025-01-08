## Tutorial: Enhancing API Routing in ViteJS with `vite-plugin-api-routes`

### Introduction

In this tutorial, we will learn how to enhance API routing in ViteJS using the `vite-plugin-api-routes` plugin. This plugin improves visibility and project structure in Node.js and Express by mapping the directory structure to route rules.

### Prerequisites

Before we begin, make sure you have the following:

- Basic knowledge of ViteJS, Node.js, and Express.
- An existing ViteJS project.

### Step 1: Installation

To install the `vite-plugin-api-routes` plugin, run the following command:

```bash
yarn add vite-plugin-api-routes
```

### Step 2: Configuration

In your ViteJS project, open the `vite.config.ts` file and add the following code:

```js
import { defineConfig } from "vite";
import apiRoutes from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    apiRoutes({
      // Configuration options go here
    }),
  ],
});
```

### Step 3: Directory Structure

Next, let's create the API directory structure in your project's source folder (`src/api`). Here's an example structure:

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
│           $userId.js    // Remix Format
│           index.js
└───v2
    │   user.js
    ├───auth
    │       login.js
    │       status.js
    └───user
            index.js
            [userId].js    // NextJS Format
```

### Step 4: Exporting Route Rules

In each API file within the directory structure, you can export the allowed request methods. For example, in the `src/api/v1/user/$userId.js` file, you can export the `DELETE` and `PUT` methods:

```javascript
///file:src/api/v1/user/$userId.js
export const DELETE = (req, res, next) => {
  res.send("DELETE REQUEST");
};
export const PUT = async (req, res, next) => {
  res.send("PUT REQUEST");
};
```

Similarly, the file names `[userId].js` or `$userId.js` will be exported as request parameters, such as `/user/:userId`, following the Next.js/Remix framework.

### Step 5: Add Middlewares

For every route you can export an array for middlewares. This can be used for authentication purposes or any other sort of middleware that you need.

```javascript
//file:src/api/v1/user/$userId.js

import authMiddleware from '...';
// or
function authMiddleware(req, res, next) => {
  // ...
}

export default [
  authMiddleware
];
```

### Step 6: Configure Aliases

In order to have proper access to the plugin's alias definitions, you need to include `/.api/env.d.ts` in either `src/vite-env.d.ts` or in your `tsconfig.json`. This will allow you to use the alias correctly throughout your project.

#### Option 1: Add to `vite-env.d.ts`

In your `src/vite-env.d.ts`, add the following line:

```typescript
/// <reference path="../.api/env.d.ts" />
```

#### Option 2: Add to `tsconfig.json`

In your `tsconfig.json`, add the path reference under the `compilerOptions`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-api-routes"]
  }
}
```

### Step 7: Run the Server

Now, you can start the server using ViteJS, and the API routes will be automatically generated based on the directory structure and exported route rules.

### Conclusion

Congratulations! You have successfully enhanced API routing in your ViteJS project using the `vite-plugin-api-routes` plugin. This improves project structure and simplifies configuration, making your development process more efficient.

Remember to refer to the plugin's documentation for more advanced configuration options and customization possibilities.

Happy coding!
