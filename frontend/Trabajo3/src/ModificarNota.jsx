import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarNota = () => {
  const { fetchAuth } = useAuth();
  const { alumnos_id, materias_id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState(null);

  const fetchNota = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/notas/alumnos/${alumnos_id}/materias/${materias_id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Error al consultar por nota:", data.message);
        return;
      }
      setValues(data.data);
    } catch (error) {
      console.error("Error de red o de autenticación:", error);
    }
  }, [fetchAuth, alumnos_id, materias_id]);

  useEffect(() => {
    fetchNota();
  }, [fetchNota]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth(`http://localhost:3000/notas/alumnos/${alumnos_id}/materias/${materias_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nota1: values.nota1,
        nota2: values.nota2,
        nota3: values.nota3,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert(data.message || "Error al modificar la nota");
    }

    navigate("/notas");
  };

  if (!values) {
    return <div>Cargando...</div>;
  }

  return (
    <article>
      <h2>Modificar Nota</h2>
      <h3>Alumno: {values.nombre} {values.apellido}</h3>
      <h3>Materia: {values.materia}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nota 1
            <input
              type="number" required min="1" max="10"
              value={values.nota1}
              onChange={(e) => setValues({ ...values, nota1: e.target.value })}
            />
          </label>
          <label>
            Nota 2
            <input
              type="number" required min="1" max="10"
              value={values.nota2}
              onChange={(e) => setValues({ ...values, nota2: e.target.value })}
            />
          </label>
          <label>
            Nota 3
            <input
              type="number" required min="1" max="10"
              value={values.nota3}
              onChange={(e) => setValues({ ...values, nota3: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};