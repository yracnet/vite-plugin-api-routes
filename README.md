# vite-plugin-api

## [Read plugin document](./plugin-api/README.md)

### [Convert the directory tree to route rules](./example/src/api/)

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
