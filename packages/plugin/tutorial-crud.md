# Tutorial: CRUD User API + GUI in ViteJS

## Introduction

In this tutorial, you will learn how to create a user database using `nedb` in a ViteJS application. Additionally, we will set up an Express server to handle requests related to users, such as creating, retrieving, updating, and deleting.

## Prerequisites

Before starting, ensure that you have the following:

- Basic knowledge of ViteJS, Node.js, and Express.
- An existing ViteJS project.
- Required dependencies installed.

## Project Setup

### Step 0: Create a ViteJS Project

First, create a new ViteJS project using the following command:

```bash
yarn create vite app-crud
```

Select the **React** template when prompted.

### Step 1: Install Dependencies

Install the necessary dependencies for the project. We will use `nedb` for the database and `express` for the server:

```bash
yarn add nedb express vite-plugin-api-routes react-bootstrap
```

### Step 2: Project Structure

Organize your project as follows:

```plaintext
/src
  /server
    /api
      /user
        GET.js
        POST.js
        [userId]
          GET.js
          PUT.js
          DELETE.js
    /db
      index.js
    configure.js
  /client
    /api
      dataProvider.js
      index.js
    /user-admin
      index.jsx
    main.jsx
  index.html
vite.config.js
```

Execute this comand in the terminal.

```bash
# Create base directories
mkdir -p data
mkdir -p src/server/api/user/[userId]
mkdir -p src/server/db
mkdir -p src/client/api
mkdir -p src/client/user-admin

# Create empty files
touch src/server/api/user/GET.js
touch src/server/api/user/POST.js
touch src/server/api/user/[userId]/GET.js
touch src/server/api/user/[userId]/PUT.js
touch src/server/api/user/[userId]/DELETE.js
touch src/server/db/index.js
touch src/server/configure.js
touch src/client/api/dataProvider.js
touch src/client/api/index.js
touch src/client/user-admin/index.jsx
touch src/client/user-admin/table.jsx
touch src/client/user-admin/form.jsx
touch src/client/main.jsx
```

## Backend

### Step 3: Database Setup

Create the file `src/server/db/index.js` to manage the database using `nedb`:

```js
// src/server/db/index.js
import Datastore from "nedb";

export const users = new Datastore({
  filename: "./data/users.db",
  autoload: true,
});

const db = { users };
export default db;
```

### Step 4: Express Server Setup

Set up the Express server in the file `src/server/configure.js`:

```js
// src/server/configure.js
import express from "express";

// DEV MODE
export const viteServerBefore = (server, viteServer) => {
  console.log("VITEJS SERVER");
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

// DEV MODE
export const viteServerAfter = (server, viteServer) => {
  const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};

// PROD MODE
export const serverBefore = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

// PROD MODE
export const serverAfter = (server) => {
  const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};
```

### Step 5: API Routes Setup

Set up the API routes in `src/server/api/user`. Below are the necessary routes:

#### GET /api/user

```js
// src/server/api/user/GET.js
import db from "../../db";

const GET_USERS = (req, res, next) => {
  db.users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.status(200).json({ data: users });
  });
};

export default GET_USERS;
```

#### POST /api/user

```js
// src/server/api/user/POST.js
import db from "../../db";

const CREATE_USER = (req, res, next) => {
  const { name, email } = req.body;
  db.users.insert({ name, email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error inserting user" });
    }
    res.status(201).json({
      data: user,
      message: "User successfully inserted",
    });
  });
};

export default CREATE_USER;
```

#### GET /api/user/:userId

```js
// src/server/api/user/[userId]/GET.js
import db from "../../../db";

const GET_USER = (req, res, next) => {
  const { userId } = req.params;

  db.users.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  });
};

export default GET_USER;
```

#### PUT /api/user/:userId

```js
// src/server/api/user/[userId]/PUT.js
import db from "../../../db";

const UPDATE_USER = (req, res, next) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const data = { _id: userId, name, email };
  db.users.update(
    { _id: userId },
    { $set: { name, email } },
    {},
    (err, numReplaced) => {
      if (err) {
        return res.status(500).json({ data, error: "Error updating user" });
      }
      if (numReplaced === 0) {
        return res.status(404).json({ data, error: "User not found" });
      }
      res.status(200).json({ data, message: "User successfully updated" });
    }
  );
};

export default UPDATE_USER;
```

#### DELETE /api/user/:userId

```js
// src/server/api/user/[userId]/DELETE.js
import db from "../../../db";

const DELETE_USER = (req, res, next) => {
  const { userId } = req.params;

  db.users.remove({ _id: userId }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting user" });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User successfully deleted" });
  });
};

export default DELETE_USER;
```

### Step 6: Configure vite-plugin-api-routes Plugin

To configure the `vite-plugin-api-routes` plugin, edit the `vite.config.js` file:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import apiRoutes from "vite-plugin-api-routes";

export default defineConfig({
  plugins: [
    react(),
    apiRoutes({
      mode: "isolated",
      configure: "src/server/configure.js", // Path to the configuration file
      dirs: [
        {
          dir: "src/server/api", // Path to the APIs
          route: "",
        },
      ],
    }),
  ],
});
```

## Frontend

### Step 7: Configure index.html

Make sure your `index.html` file contains the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CRUD Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/client/main.jsx"></script>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </body>
</html>
```

### Step 8: Configure main.jsx

Create the `src/client/main.jsx` file:

```jsx
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { UserAdmin } from "./user-admin";

const Timer = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toISOString());
    };
    const id = setInterval(update, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return <h4>{time}</h4>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Timer />
    <UserAdmin />
  </StrictMode>
);
```

### Step 9: Create the Data Provider

Create the `src/client/api/dataProvider.js` file:

```js
const NOP = (data) => data;

const getQuery = (params = {}) => {
  return Object.entries(params)
    .reduce((acc, [name, value]) => {
      acc.push(`${name}=${value}`);
      return acc;
    }, [])
    .join("&");
};

export const createDataProvider = ({
  url = "/api",
  resource = "",
  assertHeaders = NOP,
  assertOptions = NOP,
} = {}) => {
  const getList = async (params = {}) => {
    const query = getQuery(params);
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({ headers });
    try {
      const response = await fetch(`${url}/${resource}?${query}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error fetching the list" };
    }
  };
  const getOne = async (id, params = {}) => {
    const query = getQuery(params);
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({ headers });
    try {
      const response = await fetch(
        `${url}/${resource}/${id}?${query}`,
        options
      );
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error fetching the resource" };
    }
  };
  const createOne = async (data) => {
    const headers = assertHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const options = assertOptions({
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    try {
      const response = await fetch(`${url}/${resource}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error creating the resource" };
    }
  };

  const updateOne = async (id, data) => {
    const headers = assertHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const options = assertOptions({
      headers,
      method: "PUT",
      body: JSON.stringify(data),
    });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error updating the resource" };
    }
  };

  const deleteOne = async (id) => {
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({
      headers,
      method: "DELETE",
    });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error deleting the resource" };
    }
  };

  return { getList, getOne, createOne, updateOne, deleteOne };
};
```

Create the `src/client/api/index.js` file:

```js
import { createDataProvider } from "./dataProvider";

export const userDP = createDataProvider({ resource: "user" });
```

### Step 10: Creating the `UserAdmin` Component

Now, create the component `src/client/user-admin/index.jsx`:

```jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { userDP } from "../api";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [shouldReload, setShouldReload] = useState(true);

  return (
    <UserContext.Provider
      value={{ selectedKey, setSelectedKey, shouldReload, setShouldReload }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

const UserTable = () => {
  const { shouldReload, setShouldReload, setSelectedKey } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEdit = async (userId) => {
    setSelectedKey(userId);
  };

  const handleDelete = async (userId) => {
    const { message, error } = await userDP.deleteOne(userId);
    setData([]);
    setError(error);
    setMessage(message);
    setSelectedKey(null);
    if (!error) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const { data, message, error } = await userDP.getList({ q: searchQuery });
    setData(data);
    setError(error);
    setMessage(message);
    setShouldReload(false);
  };

  useEffect(() => {
    if (shouldReload) {
      handleSearch();
    }
  }, [shouldReload]);

  return (
    <div className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </InputGroup>
      {shouldReload && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(user._id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    Eliminar
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const UserForm = () => {
  const { selectedKey, setSelectedKey, setShouldReload } = useUserContext();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error, message } = selectedKey
      ? await userDP.updateOne(user._id, user)
      : await userDP.createOne(user);
    setError(error);
    setMessage(message);
    setUser(data);
    setShouldReload(true);
  };

  const handleReset = async () => {
    const {
      data = {
        name: "",
        email: "",
      },
      message,
      error,
    } = selectedKey ? await userDP.getOne(selectedKey) : {};
    setError(error);
    setMessage(message);
    setUser(data);
  };

  const onChangeAttr = (name, value) => {
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleNew = async () => {
    setError("");
    setMessage("");
    setUser({
      name: "",
      email: "",
    });
    setSelectedKey(null);
  };

  useEffect(() => {
    handleReset();
  }, [selectedKey]);

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Nombre"
        value={user.name}
        onChange={(e) => onChangeAttr("name", e.target.value)}
      />
      <Form.Control
        type="text"
        placeholder="Email"
        value={user.email}
        onChange={(e) => onChangeAttr("email", e.target.value)}
      />
      <ButtonGroup>
        <Button
          variant="primary"
          type="submit"
          className="mt-2"
          onClick={handleSubmit}
        >
          {user._id ? "Actualizar" : "Crear"}
        </Button>
        <Button variant="secondary" onClick={handleReset} className="mt-2 ml-2">
          Resetear
        </Button>
        <Button variant="warning" onClick={handleNew} className="mt-2 ml-2">
          New
        </Button>
      </ButtonGroup>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
    </div>
  );
};

export const UserAdmin = () => {
  return (
    <UserProvider>
      <Container>
        <h1>Gestión de Usuarios</h1>
        <Row>
          <Col>
            <UserTable />
          </Col>
          <Col>
            <UserForm />
          </Col>
        </Row>
      </Container>
    </UserProvider>
  );
};
```

## Step 11: Running the Application

To run your application, follow these steps:

1. **Start the Express Server**: You need to run the Express backend server in development mode.

   In the root of your project, run the following command:

   ```bash
   yarn dev
   ```

   This will start both the frontend development server (Vite) and the backend Express server, making your API routes available.

2. **Access the Application**: Open your browser and go to `http://localhost:3000` (or the port displayed in your terminal) to view the user management interface.

3. **Testing the Application**:
   - You can test CRUD operations for users, such as adding new users, updating, deleting, and listing all users, through the frontend interface.
   - The data will be stored in the `nedb` database, which is a lightweight database file stored locally.

---

## Conclusion

In this tutorial, we built a simple CRUD application for managing users using **ViteJS**, **React**, **Express**, and **nedb**.

Key Takeaways:

- **ViteJS** provides a fast and efficient development environment for React applications.
- **Express** is a lightweight and flexible framework for building backend APIs.
- **nedb** is a simple, file-based NoSQL database that's great for small projects and quick prototyping.
- We learned how to set up API routes for basic CRUD operations like creating, reading, updating, and deleting users.
- We also saw how to build a simple user interface to interact with the backend API.

This project can be expanded with more features, such as authentication, form validation, and pagination, to handle larger datasets. It’s a great starting point for building full-stack applications with **React** and **Express**.

---

## Further Improvements

To enhance the application, consider implementing the following features:

1. **Authentication**: Add login and authentication using sessions or JWT tokens for securing the application.
2. **Validation**: Implement form validation both on the client and server-side to ensure data integrity.
3. **Pagination**: For large datasets, add pagination in the API to avoid loading all the records at once.
4. **Deployment**: Deploy the app to a platform like Heroku, Vercel, or Netlify for production use.

---

## Troubleshooting

If you encounter any issues, here are some tips:

- **CORS Issues**: If you are running your frontend and backend on different ports, ensure you have configured CORS properly in your Express server.
- **Missing Dependencies**: Ensure that all dependencies are correctly installed by running `yarn install`.
- **API Routes**: Double-check the API routes and ensure that they are being handled correctly. Make sure the `vite-plugin-api-routes` plugin is correctly configured.

If you get an error message related to the database, check the permissions for the `users.db` file and make sure that the database file exists in the specified location.

---

## References

1. **ViteJS**: [https://vitejs.dev](https://vitejs.dev)
2. **ReactJS**: [https://reactjs.org](https://reactjs.org)
3. **ExpressJS**: [https://expressjs.com](https://expressjs.com)
4. **nedb**: [https://github.com/louischatriot/nedb](https://github.com/louischatriot/nedb)
5. **react-bootstrap**: [https://react-bootstrap.github.io](https://react-bootstrap.github.io)
6. **vite-plugin-api-routes**: [https://github.com/yracnet/vite-plugin-api-routes](https://github.com/yracnet/vite-plugin-api-routes)
