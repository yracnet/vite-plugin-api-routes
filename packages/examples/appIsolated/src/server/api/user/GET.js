import db from "../../db";

const GET_USERS = (req, res, next) => {
  console.log("LOG: GET_USERS");
  db.users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo los usuarios" });
    }
    res.status(200).json({ data: users });
  });
};

export default GET_USERS;
