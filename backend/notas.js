import express from "express";
import { verificarValidaciones } from "./validaciones.js";
import { param } from "express-validator";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";

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

router.post (
  "/alumnos/:alumnos_id/materias/:materias_id",
  validarAlumnosId,
  validarMateriasId,
  verificarValidaciones,
  crearNota);

router.put(
  "/alumnos/:alumnos_id/materias/:materias_id",
  validarAlumnosId,
  validarMateriasId,
  verificarValidaciones,
  modificarNota);

router.delete(
  "/alumnos/:alumnos_id/materias/:materias_id",
  validarAlumnosId,
  validarMateriasId,
  verificarValidaciones,
  borrarNota);

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
    const alumnos_id = Number(req.params.alumnos_id);
    const materias_id = Number(req.params.materias_id);
    const { nota1, nota2, nota3 } = req.body;

    let sql = "INSERT INTO notas (alumnos_id, materias_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)";
    const params = [alumnos_id, materias_id, nota1, nota2, nota3];

      const [result] = await db.execute(sql, params);
      
      return res.status(201).json({ 
        success: true, 
        message: "Nota creada con éxito", 
        id: result.insertId 
      });
    }
    


async function modificarNota(req, res) {
    const alumnos_id = Number(req.params.alumnos_id);
    const materias_id = Number(req.params.materias_id);
    const { nota1, nota2, nota3 } = req.body;

    let sql = "UPDATE notas SET nota1=?, nota2=?, nota3=? WHERE alumnos_id=? AND materias_id=?";
    const params = [nota1, nota2, nota3, alumnos_id, materias_id];

    try {
        const [result] = await db.execute(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nota no encontrada para actualizar." });
        }

        return res.status(200).json({ success: true, message: "Nota actualizada con éxito." });

    } catch (error) {
        console.error("Error en la consulta PUT:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor al actualizar la nota." });
    }
}

async function borrarNota(req, res) {
    const alumnos_id = Number(req.params.alumnos_id);
    const materias_id = Number(req.params.materias_id);

    let sql = "DELETE FROM notas WHERE alumnos_id=? AND materias_id=?";
    
    try {
        const [result] = await db.execute(sql, [alumnos_id, materias_id]); // Corregido para usar los IDs de params

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nota no encontrada para eliminar." });
        }

        return res.status(204).send(); 

    } catch (error) {
        console.error("Error en la consulta DELETE:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor al eliminar la nota." });
    }
}

export default router;