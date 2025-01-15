import db from "../../../db";

const DELETE_USER = (req, res, next) => {
  const { id } = req.params;

  db.users.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: "Error eliminando el usuario" });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  });
};

export default DELETE_USER;
