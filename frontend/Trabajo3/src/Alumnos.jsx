import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Alumnos() {
  const { fetchAuth } = useAuth();

  const [alumnos, setAlumnos] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchAlumnos = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();

      if (buscar) {
        searchParams.append("buscar", buscar);
      }

      const response = await fetchAuth(
        "http://localhost:3000/alumnos" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setAlumnos(data.data);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Esta seguro de que deseas eliminar este alumno?")) {
      const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return window.alert("Error al eliminar el alumno.");
      }

      await fetchAlumnos(buscar);
    }
  };

  return (
    <>
      <h1>Alumnos</h1>
      <Link role="button" to="/alumnos/crear" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Nuevo Alumno
      </Link>
      <div className="group">
        <input value={buscar} onChange={(e) => setBuscar(e.target.value)} />
        <button onClick={() => fetchAlumnos(buscar)}>Buscar</button>
      </div>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Apellido</th><th>DNI</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        {alumnos.map((alumno) => (
          <tr key={alumno.id}>
            <td>{alumno.nombre}</td><td>{alumno.apellido}</td><td>{alumno.dni}</td>
            <td>
              <Link role="button" className="outline" to={`/alumnos/${alumno.id}/modificar`}>Modificar</Link>
              <button className="outline" onClick={() => handleQuitar(alumno.id)}>Quitar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}
