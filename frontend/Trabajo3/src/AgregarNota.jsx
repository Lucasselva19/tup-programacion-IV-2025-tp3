import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const AgregarNota = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [values, setValues] = useState({
    alumnos_id: "",
    materias_id: "",
    nota1: "",
    nota2: "",
    nota3: "",
  });

  useEffect(() => {
    const fetchAlumnosYMaterias = async () => {
      try {
        const [alumnosRes, materiasRes] = await Promise.all([
          fetchAuth("http://localhost:3000/alumnos"),
          fetchAuth("http://localhost:3000/materias"),
        ]);
        const alumnosData = await alumnosRes.json();
        const materiasData = await materiasRes.json();

        if (alumnosData.success) setAlumnos(alumnosData.data);
        if (materiasData.success) setMaterias(materiasData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAlumnosYMaterias();
  }, [fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    if (!values.alumnos_id || !values.materias_id) {
      return window.alert("Debe seleccionar un alumno y una materia.");
    }

    const response = await fetchAuth(`http://localhost:3000/notas/alumnos/${values.alumnos_id}/materias/${values.materias_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota1: values.nota1, nota2: values.nota2, nota3: values.nota3 }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errores) {
        return setErrores(data.errores);
      }
      setErrores([{ msg: data.message || "Error al crear la nota" }]);
      return window.alert(data.message || "Error al crear la nota");
    }
    navigate("/notas");
  };

  return (
    <article>
      <h2>Agregar Nueva Nota</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Alumno
            <select required value={values.alumnos_id} onChange={(e) => setValues({ ...values, alumnos_id: e.target.value })}>
              <option value="" disabled>Seleccione un alumno</option>
              {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
            </select>
          </label>
          <label>
            Materia
            <select required value={values.materias_id} onChange={(e) => setValues({ ...values, materias_id: e.target.value })}>
              <option value="" disabled>Seleccione una materia</option>
              {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </label>
          <label>
            Nota 1
            <input type="number" required min="1" max="10" value={values.nota1} onChange={(e) => setValues({ ...values, nota1: e.target.value })} />
          </label>
          <label>
            Nota 2
            <input type="number" required min="1" max="10" value={values.nota2} onChange={(e) => setValues({ ...values, nota2: e.target.value })} />
          </label>
          <label>
            Nota 3
            <input type="number" required min="1" max="10" value={values.nota3} onChange={(e) => setValues({ ...values, nota3: e.target.value })} />
          </label>
        </fieldset>
        {errores && (
          <small style={{ color: 'red' }}>
            {errores.map((e) => e.msg).join(", ")}
          </small>
        )}
        <input type="submit" value="Agregar Nota" />
      </form>
    </article>
  );
};