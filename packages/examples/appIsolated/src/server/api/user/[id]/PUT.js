import db from "../../../db";

const UPDATE_USER = (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const data = { _id: id, name, email };
  db.users.update(
    { _id: id },
    { $set: { name, email } },
    {},
    (err, numReplaced) => {
      if (err) {
        return res
          .status(500)
          .json({ data, error: "Error actualizando el usuario" });
      }
      if (numReplaced === 0) {
        return res.status(404).json({ data, error: "Usuario no encontrado" });
      }
      res.status(200).json({ data, message: "Usuario actualizado con éxito" });
    }
  );
};
export default UPDATE_USER;
