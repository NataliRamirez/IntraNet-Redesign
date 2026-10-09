import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

import logoEmca from "../../assets/images/logo-blanco.png";
import "./Login.css";


/**
 * Componente encargado de gestionar el inicio de sesión
 * de los usuarios de la Intranet EMCA.
 *
 * Las credenciales son validadas por el backend mediante
 * MySQL, bcrypt y JWT.
 */
export default function Login({ onClose }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();


  /**
   * Gestiona el envío del formulario de inicio de sesión.
   */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    /*
     * Validamos que los campos no estén vacíos.
     */
    if (!email || !password) {
      setError("Ingresa tu correo y contraseña");
      return;
    }

    try {

      setLoading(true);

      /*
       * URL del backend.
       */
      const API_URL = import.meta.env.VITE_API_URL;

      console.log("API_URL:", import.meta.env.VITE_API_URL);

      /*
       * Enviamos las credenciales al backend.
       */
      const response = await axios.post(
        `${API_URL}/auth/login`, {email, password,}
      );

      /*
       * Mostramos temporalmente la respuesta
       * para comprobar qué devuelve el backend.
       */
      console.log(
        "RESPUESTA DEL LOGIN:",
        response.data
      );

      const data = response.data;

      /*
       * Obtenemos el JWT.
       */
      const token = data.access_token || data.data?.access_token;

      /*
       * Si el backend no devuelve el token,
       * detenemos el proceso.
       */
      if (!token) {

        throw new Error(
          "El servidor no devolvió un token de acceso"
        );
      }

      /*
       * Guardamos el JWT mediante AuthContext.
       */
      const loginSuccess = login(token);

      if (!loginSuccess) {
        throw new Error("No fue posible guardar la sesión");
      }

      /*
       * Decodificamos únicamente el payload
       * para conocer el rol del usuario.
       *
       * La seguridad real está en el backend.
       */
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = payload.role?.toUpperCase();

      console.log("ROL DEL USUARIO:", role);

      if (role === "ADMINISTRADOR") {
        navigate("/admin");
      } else if (role === "COMUNICACIONES") {
        navigate("/comunications");
      } else {
        navigate("/");
      }

      /*
       * Cerramos el modal si existe.
       */
      if (onClose) {
        onClose();
      }

    } catch (error) {

      console.error(
        "Error al iniciar sesión:",
        error
      );

      if (error.response?.status === 401) {

        setError(
          "Correo o contraseña incorrectos"
        );

      } else if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message) ? error.response.data.message.join(", "): error.response.data.message);
      } else {

        setError(
          "No fue posible iniciar sesión. Intenta nuevamente."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="login-container">

      {/* Formulario principal */}
      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        {/* Logo institucional */}
        <div className="emca-logo">

          <img className="logoEmca" src={logoEmca} alt="Logo EMCA"/>

        </div>

        {/* Título */}
        <h2 className="login-title">INICIAR SESIÓN</h2>


        {/* Correo electrónico */}
        <div className="input-group">

          <input type="email" placeholder="Correo electrónico" value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

        </div>

        {/* Contraseña */}
        <div className="input-group">

          <input type="password" placeholder="Contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

        </div>

        {/* Mensaje de error */}
        {error && (

          <p className="login-error">{error}</p>

        )}


        {/* Botón */}
        <button className="loginForm-button" type="submit" disabled={loading}>

          {loading ? "INGRESANDO..." : "INGRESAR"}

        </button>
      </form>
    </div>
  );
}