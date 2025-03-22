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
