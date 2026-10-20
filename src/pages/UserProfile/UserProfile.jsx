import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";
import { FaUserCircle, FaEnvelope, FaIdCard, FaBriefcase, FaShieldAlt, FaEdit, FaSave, FaTimes, FaKey, FaSyncAlt,} from "react-icons/fa";
import "./UserProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserPerfil() {
  const { user } = useAuth();
  const token = user?.token;
  const [profile, setProfile] = useState({
    id: "",
    id_card: "",
    name: "",
    email: "",
    job_position: "",
    role: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    job_position: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const getAuthHeaders = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/users/profile`,
        getAuthHeaders()
      );

      const data = response.data?.user ?? response.data;
      const profileData = {
        id: data.id ?? "",
        id_card: data.id_card ?? "",
        name: data.name ?? "",
        email: data.email ?? "",
        job_position: data.job_position ?? "",
        role:
          typeof data.role === "object"
            ? data.role?.name ?? ""
            : data.role ?? "",
      };

      setProfile(profileData);
      setForm({
        name: profileData.name,
        email: profileData.email,
        job_position: profileData.job_position,
      });
    } catch (error) {
      console.error("Error al cargar el perfil:", error);

      Swal.fire("No se pudo cargar el perfil", error.response?.data?.message ||
          "Verifica tu sesión e intenta nuevamente.","error"
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token, loadProfile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setForm({
      name: profile.name,
      email: profile.email,
      job_position: profile.job_position,
    });

    setChangingPassword(false);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setForm({
      name: profile.name,
      email: profile.email,
      job_position: profile.job_position,
    });

    setEditing(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      Swal.fire(
        "Campos obligatorios",
        "El nombre y el correo electrónico son obligatorios.",
        "warning"
      );
      return;
    }

    const updatedData = {
      name: form.name.trim(),
      email: form.email.trim(),
      job_position: form.job_position.trim(),
    };

    try {
      setSaving(true);

      const response = await axios.patch(
        `${API_URL}/users/profile`,
        updatedData,
        getAuthHeaders()
      );

      const data = response.data?.user ?? response.data;

      const updatedProfile = {
        ...profile,
        id: data.id ?? profile.id,
        id_card: data.id_card ?? profile.id_card,
        name: data.name ?? updatedData.name,
        email: data.email ?? updatedData.email,
        job_position:
          data.job_position ?? updatedData.job_position,
        role:
          typeof data.role === "object"
            ? data.role?.name ?? profile.role
            : data.role ?? profile.role,
      };

      setProfile(updatedProfile);
      setForm({
        name: updatedProfile.name,
        email: updatedProfile.email,
        job_position: updatedProfile.job_position,
      });

      setEditing(false);

      await Swal.fire("¡Perfil actualizado!",response.data?.message ||
          "Tus datos se actualizaron correctamente.","success"
      );
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);

      const message = error.response?.data?.message;
      const errorMessage = Array.isArray(message)
        ? message.join("\n")
        : message || "No fue posible actualizar tus datos.";

      Swal.fire("Error al actualizar", errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Swal.fire(
        "Campos incompletos",
        "Completa todos los campos de contraseña.",
        "warning"
      );
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      Swal.fire(
        "Contraseña insegura",
        "La nueva contraseña debe tener al menos 8 caracteres.",
        "warning"
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire(
        "Las contraseñas no coinciden",
        "Verifica la confirmación de tu nueva contraseña.",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await axios.patch(
        `${API_URL}/users/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        getAuthHeaders()
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setChangingPassword(false);

      await Swal.fire("¡Contraseña actualizada!",response.data?.message ||
          "Tu contraseña se cambió correctamente.","success"
      );
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);

      const message = error.response?.data?.message;
      const errorMessage = Array.isArray(message)
        ? message.join("\n")
        : message || "No fue posible cambiar la contraseña.";

      Swal.fire("Error al cambiar la contraseña", errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="user-profile-loading">
        <FaSyncAlt className="profile-spinner" />
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <main className="user-profile">
      <header className="profile-header">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>

        <div className="profile-header-info">
          <span className="profile-eyebrow">INTRANET EMCA</span>
          <h1>Mi perfil</h1>
          <p>Consulta y administra tu información personal.</p>
        </div>

        <span className="profile-role">
          <FaShieldAlt />
          {profile.role || "Usuario"}
        </span>
      </header>

      <section className="profile-content">
        <div className="profile-section-heading">
          <div>
            <h2>Información personal</h2>
            <p>Estos son los datos asociados a tu cuenta.</p>
          </div>

          {!editing && (
            <button
              type="button"
              className="profile-btn profile-btn-primary"
              onClick={handleEdit}
            >
              <FaEdit />
              Editar perfil
            </button>
          )}
        </div>

        {editing ? (
          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div className="profile-field">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                maxLength={255}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                maxLength={255}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="job_position">Cargo</label>
              <input
                id="job_position"
                name="job_position"
                value={form.job_position}
                onChange={handleFormChange}
                maxLength={255}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-id-card">Documento de identidad</label>
              <input
                id="profile-id-card"
                value={profile.id_card || "No disponible"}
                disabled
              />
            </div>

            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-btn profile-btn-secondary"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <FaTimes />
                Cancelar
              </button>

              <button
                type="submit"
                className="profile-btn profile-btn-primary"
                disabled={saving}
              >
                <FaSave />
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <article className="profile-detail-card">
              <span className="profile-detail-icon">
                <FaUserCircle />
              </span>
              <div>
                <span>Nombre completo</span>
                <strong>{profile.name || "No disponible"}</strong>
              </div>
            </article>

            <article className="profile-detail-card">
              <span className="profile-detail-icon">
                <FaEnvelope />
              </span>
              <div>
                <span>Correo electrónico</span>
                <strong>{profile.email || "No disponible"}</strong>
              </div>
            </article>

            <article className="profile-detail-card">
              <span className="profile-detail-icon">
                <FaIdCard />
              </span>
              <div>
                <span>Documento de identidad</span>
                <strong>{profile.id_card || "No disponible"}</strong>
              </div>
            </article>

            <article className="profile-detail-card">
              <span className="profile-detail-icon">
                <FaBriefcase />
              </span>
              <div>
                <span>Cargo</span>
                <strong>{profile.job_position || "No disponible"}</strong>
              </div>
            </article>

            <article className="profile-detail-card">
              <span className="profile-detail-icon">
                <FaShieldAlt />
              </span>
              <div>
                <span>Rol de acceso</span>
                <strong>{profile.role || "No disponible"}</strong>
              </div>
            </article>
          </div>
        )}
      </section>

      <section className="profile-security">
        <div className="profile-section-heading">
          <div className="profile-security-title">
            <span className="profile-detail-icon">
              <FaKey />
            </span>

            <div>
              <h2>Seguridad de la cuenta</h2>
              <p>Mantén tu cuenta protegida.</p>
            </div>
          </div>

          {!changingPassword && (
            <button
              type="button"
              className="profile-btn profile-btn-secondary"
              onClick={() => {
                setChangingPassword(true);
                setEditing(false);
              }}
            >
              <FaKey />
              Cambiar contraseña
            </button>
          )}
        </div>

        {changingPassword && (
          <form
            className="profile-form profile-password-form"
            onSubmit={handleChangePassword}
          >
            <div className="profile-field">
              <label htmlFor="currentPassword">Contraseña actual</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                maxLength={72}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-btn profile-btn-secondary"
                disabled={saving}
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                <FaTimes />
                Cancelar
              </button>

              <button
                type="submit"
                className="profile-btn profile-btn-primary"
                disabled={saving}
              >
                <FaKey />
                {saving ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}