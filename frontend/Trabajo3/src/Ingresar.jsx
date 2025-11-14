import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
  const { error: authError, login } = useAuth();

  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!mail || !password) {
      setError("El mail y la contraseña son obligatorios.");
      return;
    }

    const result = await login(mail, password);
    if (result.success) {
      setOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>
      <dialog open={open}>
        <article>
          <h2>Ingrese mail y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="mail">mail:</label>
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
              {authError && !error && <p style={{ color: "red" }}>{authError}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );

};
