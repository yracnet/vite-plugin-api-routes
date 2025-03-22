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
