import db from "../../../db";

export const GET = (req, res, next) => {
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

export const DELETE = (req, res, next) => {
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

export const PUT = (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const data = { _id: id, name, email };
  db.users.update({ _id: id }, { $set: { name, email } }, {}, (err, numReplaced) => {
    if (err) {
      return res.status(500).json({ data, error: "Error actualizando el usuario" });
    }
    if (numReplaced === 0) {
      return res.status(404).json({ data, error: "Usuario no encontrado" });
    }
    res.status(200).json({ data, message: "Usuario actualizado con éxito" });
  });
};
