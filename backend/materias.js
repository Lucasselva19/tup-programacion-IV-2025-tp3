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
      [rows] = await db.execute("SELECT * FROM materias WHERE nombre LIKE ?", [`%${buscar}%`]);
    } else {
      [rows] = await db.execute("SELECT * FROM materias");
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
      "SELECT id, nombre, codigo, año FROM materias WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "materia no encontrada" });
    }

    res.json({ success: true, data: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("nombre").isAlphanumeric("es-ES").isLength({ max: 50 }),
  body("año").isNumeric().isLength({ min: 4, max: 4 }),
  body("codigo").isNumeric(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, año, codigo } = req.body;

    const [result] = await db.execute(
      "INSERT INTO materias (nombre, año, codigo) VALUES (?,?,?)",
      [nombre, año, codigo]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, año, codigo },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").isAlphanumeric("es-ES").isLength({ max: 50 }),
  body("año").isNumeric().isLength({ min: 4, max: 4 }),
  body("codigo").isNumeric(),
  verificarValidaciones, 
  async(req, res) => {
    const id = Number(req.params.id);
    const { nombre, año, codigo } = req.body;

    const [result] = await db.execute(
      "UPDATE materias SET nombre=?, año=?, codigo=? WHERE id=?",
      [nombre, año, codigo, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Materia no encontrada" });
    }

    res.json({
      success: true,
      data: { id, nombre, año, codigo },
    });
  });

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute("DELETE FROM materias WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Materia no encontrada" });
    }

    res.json({ success: true, message: "Materia eliminada con éxito." });
  }
);

export default router;
