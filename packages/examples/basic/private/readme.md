# Sandbox Project

This is a sandbox project for testing and development. Below are the steps to install and run the project, as well as the required environment variables.

## Installation

To install the project dependencies, run the following command:

```
yarn install
```

## Running the Project

Once the dependencies are installed, you can start the project with:

```
yarn start
```

This will start the development server.

## Environment Variables

Make sure to have a `.env` file with the following environment variables configured:

```
# JWT INSTANCE
JWT_SECRET=F69F37EB4D1BAB673F7B5A7D41E3A
JWT_EXPIRES=5m

# SERVER DEPLOY
SERVER_HOST=127.0.0.1
SERVER_PORT=4000
```

### Variable Descriptions

- **JWT_SECRET**: Secret key used to sign JWT tokens.
- **JWT_EXPIRES**: Expiration time for the JWT.
- **SERVER_HOST**: The IP address of the server.
- **SERVER_PORT**: The port on which the server will listen.
