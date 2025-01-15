import db from "../../db";

const CREATE_USER = (req, res, next) => {
  const { name, email } = req.body;
  db.users.insert({ name, email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error al insertar el usuario" });
    }
    res.status(201).json({
      data: user,
      message: "Usuario insertado con éxito",
    });
  });
};

export default CREATE_USER;
