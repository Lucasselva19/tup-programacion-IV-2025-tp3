import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Notas() {
  const { fetchAuth } = useAuth();

  const [notas, setNotas] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchNotas = useCallback(async (buscar) => {
    const searchParams = new URLSearchParams();
    if (buscar) {
      searchParams.append("buscar", buscar);
    }

    const response = await fetchAuth("http://localhost:3000/notas" + (searchParams.size > 0 ? "?" + searchParams.toString() : ""));
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.error);
      return;
    }
    setNotas(data.data);
  }, [fetchAuth]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleQuitar = async (alumnos_id, materias_id) => {
    if (window.confirm("¿Esta seguro de que deseas eliminar esta nota?")) {
      const response = await fetchAuth(`http://localhost:3000/notas/alumnos/${alumnos_id}/materias/${materias_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return window.alert("Error al eliminar la nota.");
      }
      await fetchNotas(buscar);
    }
  };

  return (
    <>
      <h1>Notas</h1>
      <Link role="button" to="/notas/crear">
        Nueva nota
      </Link>
      <div className="group">
        <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por alumno o materia..." />
        <button onClick={() => fetchNotas(buscar)}>Buscar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas && notas.map((n) => (
            <tr key={`${n.alumnos_id}-${n.materias_id}`}>
              <td>{`${n.nombre} ${n.apellido}`}</td>
              <td>{n.materia}</td>
              <td>{n.nota1}</td>
              <td>{n.nota2}</td>
              <td>{n.nota3}</td>
              <td>
                {(
                  (parseFloat(n.nota1) +
                    parseFloat(n.nota2) +
                    parseFloat(n.nota3)) /
                  3
                ).toFixed(2)}
              </td>
              <td>
                <Link role="button" className="outline" to={`/notas/alumnos/${n.alumnos_id}/materias/${n.materias_id}/modificar`}>Modificar
                </Link>
                <button className="outline" onClick={() => handleQuitar(n.alumnos_id, n.materias_id)}>
                  Quitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}