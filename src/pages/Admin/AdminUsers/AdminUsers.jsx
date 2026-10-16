import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./AdminUsers.css";

// =========================
// CONFIGURACIÓN
// =========================
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/users`;
const ROLES_URL = `${BASE_URL}/users/roles`;
// =========================
// OBTENER TOKEN JWT
// =========================
const getAuthHeaders = () => {
  let token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  if (!token) {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        token =
          user.token ||
          user.accessToken ||
          user.access_token ||
          null;

        // Compatibilidad con el formato anterior del proyecto
        if (
          !token &&
          typeof user.username === "string" &&
          user.username.split(".").length === 3
        ) {
          token = user.username;
        }
      } catch (error) {
        console.error(
          "No se pudo leer el usuario guardado:",
          error
        );
      }
    }
  }

  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación. Inicia sesión nuevamente."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =========================
// COMPONENTE
// =========================
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    id_card: "",
    name: "",
    email: "",
    job_position: "",
    role_id: "",
    password: "",
  });

  // Búsqueda y filtros
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const headers = getAuthHeaders();

      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get(API_URL, { headers }),
        axios.get(ROLES_URL, { headers }),
      ]);

      setUsers(
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : []
      );

      setRoles(
        Array.isArray(rolesResponse.data)
          ? rolesResponse.data
          : []
      );
    } catch (err) {
      console.error("Error cargando usuarios:", err);

      let message = "No se pudieron cargar los usuarios y roles.";

      if (err.response?.status === 401) {
        message =
          "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (err.response?.status === 403) {
        message =
          "No tienes permisos para consultar los usuarios.";
      } else if (err.message?.includes("token de autenticación")) {
        message = err.message;
      } else if (
        err.response?.status === 404 &&
        err.config?.url?.includes("/roles")
      ) {
        message =
          "No se encontró la ruta /roles. Verifica el endpoint de roles de tu backend.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ACTUALIZAR CAMPOS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREAR / EDITAR USUARIO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.id_card.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.job_position.trim() ||
      !form.role_id
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos obligatorios.",
      });

      return;
    }

    if (!form.id && !form.password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña obligatoria",
        text: "Debes establecer una contraseña para el nuevo usuario.",
      });

      return;
    }

    if (form.password && form.password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña no válida",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });

      return;
    }

    try {
      const headers = getAuthHeaders();

      // Campos correspondientes a la tabla users.
      const payload = {
        id_card: form.id_card.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        job_position: form.job_position.trim(),
        role_id: Number(form.role_id),
      };

      // Solo enviar contraseña cuando se crea o se desea cambiar.
      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (form.id) {
        await axios.patch(
          `${API_URL}/${form.id}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(API_URL, payload, { headers });
      }

      await Swal.fire({
        icon: "success",
        title: form.id
          ? "¡Usuario actualizado!"
          : "¡Usuario creado!",
        text: "Los cambios se guardaron correctamente.",
        showConfirmButton: false,
        timer: 1800,
      });

      resetForm();
      await loadData();
    } catch (err) {
      console.error("Error guardando usuario:", err);

      const status = err.response?.status;
      let message = "No se pudo guardar el usuario.";

      if (status === 400) {
        message =
          err.response?.data?.message ||
          "Verifica los datos ingresados. Puede que el documento o correo ya estén registrados.";
      } else if (status === 401) {
        message =
          "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message =
          "No tienes permisos para crear o editar usuarios.";
      } else if (status === 409) {
        message =
          "El documento o correo electrónico ya se encuentra registrado.";
      } else if (err.message?.includes("token de autenticación")) {
        message = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: message,
      });
    }
  };

  // =========================
  // LIMPIAR FORMULARIO
  // =========================
  const resetForm = () => {
    setForm({
      id: null,
      id_card: "",
      name: "",
      email: "",
      job_position: "",
      role_id: "",
      password: "",
    });
  };

  // =========================
  // EDITAR USUARIO
  // =========================
  const handleEdit = (user) => {
    const userRoleId =
      user.role_id ??
      user.role?.id ??
      "";

    setForm({
      id: user.id,
      id_card: user.id_card || "",
      name: user.name || "",
      email: user.email || "",
      job_position: user.job_position || "",
      role_id: String(userRoleId),
      password: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // ELIMINAR USUARIO
  // =========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (form.id === id) {
        resetForm();
      }

      await loadData();

      Swal.fire({
        icon: "success",
        title: "¡Usuario eliminado!",
        text: "El usuario se eliminó correctamente.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error eliminando usuario:", err);

      const status = err.response?.status;
      let message = "No se pudo eliminar el usuario.";

      if (status === 401) {
        message =
          "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message =
          "No tienes permisos para eliminar usuarios.";
      } else if (status === 404) {
        message =
          "El usuario no existe o ya fue eliminado.";
      } else if (status === 409) {
        message =
          "No se puede eliminar este usuario porque tiene registros relacionados.";
      } else if (err.message?.includes("token de autenticación")) {
        message = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: message,
      });
    }
  };

  // =========================
  // NOMBRE DEL ROL
  // =========================
  const getRoleName = (user) => {
    if (user.role?.name) {
      return user.role.name;
    }

    const role = roles.find(
      (item) =>
        String(item.id) ===
        String(user.role_id ?? user.role?.id)
    );

    return role?.name || "Sin rol asignado";
  };

  // =========================
  // FILTRAR USUARIOS
  // =========================
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      user.name?.toLowerCase().includes(searchText) ||
      user.id_card?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.job_position?.toLowerCase().includes(searchText);

    const matchesRole =
      !roleFilter ||
      String(user.role_id ?? user.role?.id) ===
        String(roleFilter) ||
      getRoleName(user).toUpperCase() ===
        String(
          roles.find(
            (role) => String(role.id) === String(roleFilter)
          )?.name || ""
        ).toUpperCase();

    return matchesSearch && matchesRole;
  });

  // =========================
  // RENDERIZADO
  // =========================
  return (
    <div className="admin-users" id="FormUsers">
      {/* FORMULARIO */}
      <section className="users-section-form">
        <h2>
          {form.id
            ? "Editar usuario"
            : "Formulario para crear un usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="users-form">
          <div className="users-form-grid">
            <div className="users-field">
              <label htmlFor="id_card"> Número de documento * </label>

              <input
                id="id_card"
                name="id_card"
                type="text"
                placeholder="Número de documento"
                value={form.id_card}
                onChange={handleChange}
                maxLength={15}
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="name">Nombre completo *</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="email"> Correo electrónico *</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="usuario@emca.gov.co"
                value={form.email}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="job_position">Cargo *</label>

              <input
                id="job_position"
                name="job_position"
                type="text"
                placeholder="Cargo del empleado"
                value={form.job_position}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="role_id">Rol *</label>

              <select
                id="role_id"
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un rol</option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="users-field">
              <label htmlFor="password">
                {form.id
                  ? "Nueva contraseña (opcional)"
                  : "Contraseña *"}
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder={
                  form.id
                    ? "Dejar vacío para conservarla"
                    : "Mínimo 8 caracteres"
                }
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required={!form.id}
              />
            </div>
          </div>

          <p className="users-form-note">
            * Campos obligatorios. 
          </p>

          <div className="users-form-buttons">
            <button
              type="submit"
              className="users-btn users-btn-primary"
            >
              {form.id ? "Actualizar usuario" : "Crear usuario"}
            </button>

            {form.id && (
              <button
                type="button"
                className="users-btn users-btn-secondary"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* LISTADO */}
      <section className="users-section-list" id="Users">
        <div className="users-list-heading">
          <h2>Usuarios registrados</h2>

          <span className="users-count">
            {filteredUsers.length} de {users.length} usuarios
          </span>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="users-search-filters">
          <input
            type="search"
            placeholder="Buscar por nombre, documento, correo o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos los roles</option>

            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>

          {(search || roleFilter) && (
            <button
              type="button"
              className="users-btn users-btn-secondary"
              onClick={() => {
                setSearch("");
                setRoleFilter("");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        {loading ? (
          <p className="users-empty">
            Cargando usuarios...
          </p>
        ) : users.length === 0 ? (
          <p className="users-empty">
            No hay usuarios registrados.
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="users-empty">
            No se encontraron usuarios con los filtros seleccionados.
          </p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td data-label="Documento">
                      {user.id_card}
                    </td>

                    <td data-label="Nombre">
                      {user.name}
                    </td>

                    <td data-label="Correo">
                      {user.email}
                    </td>

                    <td data-label="Cargo">
                      {user.job_position || "Sin cargo"}
                    </td>

                    <td data-label="Rol">
                      <span
                        className={`users-role ${
                          getRoleName(user).toUpperCase() ===
                          "ADMINISTRADOR"
                            ? "users-role-admin"
                            : "users-role-comms"
                        }`}
                      >
                        {getRoleName(user)}
                      </span>
                    </td>

                    <td
                      data-label="Acciones"
                      className="users-actions"
                    >
                      <button
                        type="button"
                        className="users-btn-edit"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="users-btn-delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
