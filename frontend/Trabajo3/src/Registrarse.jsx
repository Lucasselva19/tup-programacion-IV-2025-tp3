import { useState } from "react";
import { useAuth } from "./Auth";

export const Registrarse = () => {
  const { error, register } = useAuth();

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(nombre, mail, password);
    if (result.success) {
      setOpen(false);
      window.alert("¡Usuario registrado con éxito! Ahora puedes ingresar.");
    }
  };

  return (
    <>
      <button className="secondary" onClick={() => setOpen(true)}>Registrarse</button>
      <dialog open={open}>
        <article>
          <h2>Crear una nueva cuenta</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
                <label htmlFor="nombre">Nombre:</label>
              <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <label htmlFor="mail">Mail:</label>
              <input
                name="mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
              <label htmlFor="password">Contraseña:</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Registrarse" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};