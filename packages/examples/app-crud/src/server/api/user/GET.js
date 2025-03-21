// src/server/api/user/GET.js
import db from "../../db";

const GET_USERS = (req, res, next) => {
  db.users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.status(200).json({ data: users, from: req.data });
  });
};

export default GET_USERS;
