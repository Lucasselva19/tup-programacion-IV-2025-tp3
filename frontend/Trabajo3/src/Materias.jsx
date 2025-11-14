import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Materias() {
  const { fetchAuth } = useAuth();

  const [materias, setMaterias] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchMaterias = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();

      if (buscar) {
        searchParams.append("buscar", buscar);
      }

      const response = await fetchAuth(
        "http://localhost:3000/materias" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setMaterias(data.data);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Esta seguro de que deseas eliminar esta materia?")) {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return window.alert("Error al eliminar la materia.");
      }
      await fetchMaterias(buscar);
    }
  };

  return (
    <>
      <h1>Materias</h1>
      <Link role="button" to="/materias/crear" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Nueva Materia
      </Link>
      <div className="group">
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button onClick={() => fetchMaterias(buscar)}>Buscar</button>
      </div>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Código</th><th>Año</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        {materias.map((materia) => (
          <tr key={materia.id}>
            <td>{materia.nombre}</td><td>{materia.codigo}</td><td>{materia.año}</td>
            <td>
              <Link role="button" className="outline" to={`/materias/${materia.id}/modificar`}>Modificar</Link>
              <button className="outline" onClick={() => handleQuitar(materia.id)}>Quitar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}
