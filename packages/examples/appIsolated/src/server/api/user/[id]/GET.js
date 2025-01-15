import db from "../../../db";

const GET_USER = (req, res, next) => {
  const { id } = req.params;

  db.users.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo el usuario" });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ data: user });
  });
};
export default GET_USER;
