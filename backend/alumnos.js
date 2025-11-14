import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();


router.get("/", verificarAutenticacion, async (req, res) => {
  const { buscar } = req.query;
  let rows;

  if (buscar) {
    [rows] = await db.execute("SELECT * FROM alumnos WHERE nombre LIKE ? OR apellido LIKE ?", [`%${buscar}%`, `%${buscar}%`]);
  } else {
    [rows] = await db.execute("SELECT * FROM alumnos");
  }

  res.json({
    success: true,
    data: rows,
  });
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, apellido, dni FROM alumnos WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Alumno no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("nombre").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni").isNumeric().isLength({ min: 7, max: 8 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni } = req.body;

    const [result] = await db.execute(
      "INSERT INTO alumnos (nombre, apellido, dni) VALUES (?,?,?)",
      [nombre, apellido, dni]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, apellido, dni },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones, 
  async(req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni } = req.body;

    const [result] = await db.execute(
      "UPDATE alumnos SET nombre=?, apellido=?, dni=? WHERE id=?",
      [nombre, apellido, dni, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Alumno no encontrado" });
    }

    res.json({
      success: true,
      data: { id, nombre, apellido, dni },
    });
  });

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute("DELETE FROM alumnos WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Alumno no encontrado" });
    }

    res.json({ success: true, message: "Alumno eliminado con éxito." });
  }
);

export default router;
