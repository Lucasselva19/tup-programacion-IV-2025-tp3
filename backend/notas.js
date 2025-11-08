import express from "express";
import { verificarValidaciones } from "./validaciones.js";
import { param } from "express-validator";
import { db } from "./db.js";

const router = express.Router();

const validarAlumnosId = param("alumnos_id").isInt({ min: 1 });
const validarMateriasId = param("materias_id").isInt({ min: 1 });

router.get(
  "/alumnos/:alumnos_id/materias/:materias_id",
  validarAlumnosId,
  validarMateriasId,
  verificarValidaciones,
  getnotas
);

router.post ("/", crearNota);

async function getnotas(req, res) {
  const alumnos_id = Number(req.params.alumnos_id);
  const materias_id = Number(req.params.materias_id);

  let sql =
    "SELECT ur.alumnos_id, ur.materias_id, u.nombre AS alumno, r.nombre AS materia, ur.nota1, ur.nota2, ur.nota3 \
     FROM notas ur \
     JOIN alumnos u ON ur.alumnos_id=u.id \
     JOIN materias r ON ur.materias_id=r.id \
     WHERE ur.alumnos_id=? AND ur.materias_id=?";

  const [rows] = await db.execute(sql, [alumnos_id, materias_id]);

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Alumno/materia no encontrado" });
  }

  res.json({ success: true, data: rows[0] });
}

async function crearNota(req, res) {
    const { alumnos_id, materias_id, nota1, nota2, nota3 } = req.body;

    let sql = "INSERT INTO notas (alumnos_id, materias_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)";
    const params = [alumnos_id, materias_id, nota1, nota2, nota3];

      const [result] = await db.execute(sql, params);
      
      return res.status(201).json({ 
        success: true, 
          message: "Nota creada con éxito", 
          id: result.insertId 
      });
}


router.put("/alumnos/:alumnos_id/materias/:materias_id", (req, res) => {});

router.delete("/alumnos/:alumnos_id", (req, res) => {});
router.delete("/materias/:materias_id", (req, res) => {});

router.delete("/alumnos/:alumnos_id/materias/:materias_id", (req, res) => {});

export default router;