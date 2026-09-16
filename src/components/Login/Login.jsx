import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FiUser, FiLock } from "react-icons/fi";
import "./Login.css";

export default function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUsers = { admin: "admin123", comunicaciones: "comu123" };

    if (validUsers[username] && validUsers[username] === password) {
      login(username);
      if (username === "admin") navigate("/admin");
      if (username === "comunicaciones") navigate("/comunicaciones");
      if (onClose) onClose();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="user-circle">
          <FiUser />
        </div>

        <h2 className="login-title">
          INICIAR SESIÓN
        </h2>

        <div className="input-group">
          <FiUser className="input-icon" />

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <FiLock className="input-icon" />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        {error && (
          <p className="login-error">{error}</p>
        )}

        <button
          className="login-btn"
          type="submit"
        >
          INGRESAR
        </button>
      </form>
    </div>
  );
}