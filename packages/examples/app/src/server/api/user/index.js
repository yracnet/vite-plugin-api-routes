import db from "../../db";

export const GET = (req, res, next) => {
  db.users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo los usuarios" });
    }
    res.status(200).json({ data: users });
  });
};

export const POST = (req, res, next) => {
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
