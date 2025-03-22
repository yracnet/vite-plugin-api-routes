// src/server/db/index.js
import Datastore from "nedb";

export const users = new Datastore({
  filename: "./data/users.db",
  autoload: true,
});

const db = { users };
export default db;
