import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Ingresar } from "./Ingresar";
import { Registrarse } from "./Registrarse";

export const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/alumnos">alumnos</Link>
          </li>
          <li>
            <Link to="/materias">materias</Link>
          </li>
          <li>
            <Link to="/notas">notas</Link>
          </li>
        </ul>
        <li>
          {isAuthenticated ? (
            <button onClick={() => logout()}>Salir</button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Ingresar />
              <Registrarse />
            </div>
          )}
        </li>
      </nav>
      <Outlet />
    </main>
  );
};