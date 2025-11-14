import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const AgregarMateria = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    año: "",
    codigo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/materias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        return setErrores(data.errores);
      }
      return window.alert("Error al crear la materia");
    }
    navigate("/materias");
  };

  return (
    <article>
      <h2>Agregar Nueva Materia</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "nombre")}
            />
            {errores && <small>{errores.filter((e) => e.path === "nombre").map((e) => e.msg).join(", ")}</small>}
          </label>
          <label>
            Año
            <input
              required
              value={values.año}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "año")}
            />
            {errores && <small>{errores.filter((e) => e.path === "año").map((e) => e.msg).join(", ")}</small>}
          </label>
          <label>
            Código
            <input
              required
              value={values.codigo}
              onChange={(e) => setValues({ ...values, codigo: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "codigo")}
            />
            {errores && <small>{errores.filter((e) => e.path === "codigo").map((e) => e.msg).join(", ")}</small>}
          </label>
        </fieldset>
        <input type="submit" value="Agregar Materia" />
      </form>
    </article>
  );
};