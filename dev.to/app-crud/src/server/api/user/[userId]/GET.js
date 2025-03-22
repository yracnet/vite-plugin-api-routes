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
