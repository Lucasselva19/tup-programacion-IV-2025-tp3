import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [mail, setMail] = useState(null);
  const [error, setError] = useState(null);

  const login = async (mail, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(session.error);
      }

      setToken(session.token);
      setMail(session.mail);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const register = async (nombre, mail, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, mail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro.");
        // Si la respuesta no es OK, intenta leer el cuerpo como texto.
        // Esto captura errores como "Unauthorized" que no son JSON.
        const errorText = await response.text();
        throw new Error(errorText || "Error en el registro.");
      }

      // Si la respuesta es OK, se espera que sea JSON.
      await response.json();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setMail(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        mail,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        register,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Muestra un mensaje si el usuario no esta logeado
export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Ingrese para ver esta pagina</h2>;
  }

  return children;
};
