import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarAlumno = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState(null);

  const fetchAlumno = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Error al consultar por alumno:", data.message);
        return;
      }
      setValues(data.data);
    } catch (error) {
      console.error("Error de red o de autenticación:", error);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchAlumno();
  }, [fetchAlumno]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al modificar el alumno");
    }

    navigate("/alumnos");
  };

  if (!values) {
    return <div>Cargando...</div>;
  }

  return (
    <article>
      <h2>Modificar Alumno</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>
          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) => setValues({ ...values, apellido: e.target.value })}
            />
          </label>
          <label>
            DNI
            <input
              required
              value={values.dni}
              onChange={(e) => setValues({ ...values, dni: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};