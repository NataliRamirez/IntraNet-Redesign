import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import logoEmca from "../../assets/images/logo-blanco.png"
import "./Login.css";


/**
 * Componente encargado de gestionar el inicio de sesión
 * de los usuarios de la Intranet EMCA. Permite validar
 * credenciales, autenticar usuarios y redirigirlos según
 * el rol asignado.
 */
export default function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Gestiona el envío del formulario de inicio de sesión.
   * @param {Event} e Evento generado por el formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const validUsers = { admin: "admin123", comunications: "comu123" };

    if (validUsers[username] && validUsers[username] === password) {
      login(username);
      if (username === "admin") navigate("/admin");
      if (username === "comunications") navigate("/comunications");
      if (onClose) onClose();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">

      {/* Formulario principal de autenticación */}
      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        {/* Logo institucional */}
        <div className="emca-logo">
          <img
            className="logoEmca"
            src={logoEmca}
            alt="Logo Color"
          />
        </div>

        {/* Título del formulario */}
        <h2 className="login-title">
          INICIAR SESIÓN
        </h2>

        {/* Campo de usuario */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </div>

        {/* Campo de contraseña */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        {/* Mensaje de error */}
        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {/* Botón de acceso */}
        <button
          className="loginForm-button"
          type="submit"
        >
          INGRESAR
        </button>

      </form>
    </div>
  );
}