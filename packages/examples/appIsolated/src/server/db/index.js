import Datastore from "nedb";

export const users = new Datastore({ filename: "./data/users.db", autoload: true });
export const products = new Datastore({ filename: "./data/products.db", autoload: true });

const db = { users, products };
export default db;
