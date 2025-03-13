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
