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

      if (!response.ok) {
        throw new Error(session.error || session.message || "Error en el inicio de sesión.");
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error en el registro. Intente de nuevo." }));
        throw new Error(errorData.message || errorData.error || "Error en el registro.");
      }

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

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Ingrese para ver esta pagina</h2>;
  }

  return children;
};
