import db from "../../db";

const GET_LIST_USERS = (req, res, next) => {
  db.users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo los usuarios" });
    }
    res.status(200).json({ data: users });
  });
};

export default GET_LIST_USERS;
