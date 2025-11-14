import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import { Layout } from "./Layout.jsx";
import { App } from "./App.jsx";
import { AuthPage, AuthProvider } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Alumnos } from "./Alumnos.jsx";
import { Materias } from "./Materias.jsx";
import { Notas } from "./notas.jsx";
import { AgregarAlumno } from "./AgregarAlumno.jsx";
import { AgregarMateria } from "./AgregarMateria.jsx";
import { ModificarAlumno } from "./ModificarAlumno.jsx";
import { ModificarMateria } from "./ModificarMateria.jsx";
import { AgregarNota } from "./AgregarNota.jsx";
import { ModificarNota } from "./ModificarNota.jsx";




createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route
              path="alumnos"
              element={
                <AuthPage>
                  <Alumnos />
                </AuthPage>
              }
            />
            <Route
              path="alumnos/crear"
              element={
                <AuthPage>
                  <AgregarAlumno />
                </AuthPage>
              }
            />
            <Route
              path="alumnos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarAlumno />
                </AuthPage>
              }
            />
            <Route
              path="materias"
              element={
                <AuthPage>
                  <Materias />
                </AuthPage>
              }
            />
            <Route
              path="materias/crear"
              element={
                <AuthPage>
                  <AgregarMateria />
                </AuthPage>
              }
            />
            <Route
              path="materias/:id/modificar"
              element={
                <AuthPage>
                  <ModificarMateria />
                </AuthPage>
              }
            />
            <Route
              path="notas"
              element={
                <AuthPage>
                  <Notas />
                </AuthPage>
              }
            />
            <Route
              path="notas/crear"
              element={
                <AuthPage>
                  <AgregarNota />
                </AuthPage>
              }
            />
            <Route
              path="notas/alumnos/:alumnos_id/materias/:materias_id/modificar"
              element={
                <AuthPage>
                  <ModificarNota />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
