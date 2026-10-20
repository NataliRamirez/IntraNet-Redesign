import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminEmployees.css";

const API_URL = `${import.meta.env.VITE_API_URL}/employee`;

const getAuthHeaders = () => {
  let token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");

  if (!token) {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        token = user.token || user.accessToken || user.access_token || null;

        // Compatibilidad con el formato anterior del proyecto
        if (!token && typeof user.username === "string" && user.username.split(".").length === 3) {
          token = user.username;
        }
      } catch (error) {
        console.error("No se pudo leer el usuario guardado:", error);
      }
    }
  }

  if (!token) {
    throw new Error("No se encontró el token de autenticación. Inicia sesión nuevamente.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const initialForm = {
  id: null,
  name: "",
  id_card: "",
  job_position: "",
  area: "",
  birthday: "",
};

// =========================
// COMPONENTE PRINCIPAL
// =========================
export default function AdminEmployee() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  // =========================
  // CARGAR EMPLEADOS
  // =========================
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });

      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error al obtener empleados:", err);

      const status = err.response?.status;

      let message = "No se pudieron cargar los empleados.";

      if (status === 401) {
        message = "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message = "No tienes permisos para consultar los empleados.";
      } else if (status === 404) {
        message = "No se encontró la ruta de empleados. Verificar el endpoint.";
      } else if (
        err.message?.includes("token de autenticación")
      ) {
        message = err.message;
      }

      Swal.fire({ icon: "error", title: "Error", text: message, });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MANEJAR CAMBIOS DEL FORMULARIO
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREAR / ACTUALIZAR EMPLEADO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.id_card.trim() || !form.job_position.trim() || !form.area.trim() || !form.birthday) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes completar todos los campos del formulario.",
      });

      return;
    }

    if (!/^\d{1,10}$/.test(form.id_card.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Documento no válido",
        text: "El documento debe contener únicamente números y tener máximo 10 dígitos.",
      });

      return;
    }

    // Evitar fechas futuras
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (form.birthday > todayString) {
      Swal.fire({
        icon: "warning",
        title: "Fecha no válida",
        text: "La fecha de nacimiento no puede ser futura.",
      });

      return;
    }

    const payload = {
      name: form.name.trim(),
      id_card: form.id_card.trim(),
      job_position: form.job_position.trim(),
      area: form.area.trim(),
      birthday: form.birthday,
    };

    setSaving(true);

    try {
      const headers = getAuthHeaders();

      if (form.id) { //Actualizar empleado
        await axios.patch(`${API_URL}/${form.id}`, payload, { headers });
      } else { // Crear empleado
        await axios.post(API_URL, payload, { headers });
      }

      const wasEditing = Boolean(form.id);

      resetForm();
      await fetchEmployees();

      await Swal.fire({
        icon: "success",
        title: wasEditing ? "¡Empleado actualizado!" : "¡Empleado creado!",
        text: wasEditing ? "Los datos del empleado se actualizaron correctamente." : "El empleado se registró correctamente.",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error("Error guardando empleado:", err);

      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;

      let message = "Ocurrió un error al guardar el empleado.";

      if (status === 400) {
        message = Array.isArray(backendMessage)
          ? backendMessage.join(". ")
          : backendMessage || "Verifica los datos ingresados.";
      } else if (status === 401) {
        message = "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message = "No tienes permisos para crear o editar empleados.";
      } else if (status === 404) {
        message = "No se encontró el empleado o la ruta solicitada.";
      } else if (status === 409) {
        message = backendMessage || "El número de documento ya está registrado.";
      } else if (err.message?.includes("token de autenticación")) {
        message = err.message;
      }

      Swal.fire({ icon: "error", title: "Error al guardar", text: message, });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LIMPIAR FORMULARIO
  // =========================
  const resetForm = () => { setForm({ ...initialForm }); };

  // =========================
  // EDITAR EMPLEADO
  // =========================
  const handleEdit = (employee) => {
    setForm({
      id: employee.id,
      name: employee.name || "",
      id_card: employee.id_card || "",
      job_position: employee.job_position || "",
      area: employee.area || "",
      birthday: employee.birthday ? String(employee.birthday).slice(0, 10) : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth", });
  };

  // =========================
  // ELIMINAR EMPLEADO
  // =========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción eliminará el registro del empleado y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (Number(form.id) === Number(id)) {
        resetForm();
      }

      await fetchEmployees();

      await Swal.fire({
        icon: "success",
        title: "¡Empleado eliminado!",
        text: "El registro se eliminó correctamente.",
        showConfirmButton: false,
        timer: 1600,
      });
    } catch (err) {
      console.error("Error eliminando empleado:", err);

      const status = err.response?.status;
      let message = "No se pudo eliminar el empleado.";

      if (status === 401) {
        message = "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message = "No tienes permisos para eliminar empleados.";
      } else if (status === 404) {
        message = "El empleado no existe o ya fue eliminado.";
      } else if (status === 409) {
        message = "No se puede eliminar el empleado porque tiene registros relacionados.";
      } else if (
        err.message?.includes("token de autenticación")
      ) { message = err.message; }

      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: message,
      });
    }
  };

  // =========================
  // FILTRAR EMPLEADOS
  // =========================
  const areas = [
    ...new Set(employees.map((employee) => employee.area).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "es"));

  const filteredEmployees = employees.filter(
    (employee) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        employee.name?.toLowerCase().includes(searchText) ||
        employee.id_card?.toLowerCase().includes(searchText) ||
        employee.job_position?.toLowerCase().includes(searchText) ||
        employee.area?.toLowerCase().includes(searchText);

      const matchesArea = !areaFilter || employee.area === areaFilter;

      return matchesSearch && matchesArea;
    }
  );

  // =========================
  // FORMATEAR FECHA
  // =========================
  const formatBirthday = (birthday) => {
    if (!birthday) return "Sin fecha";

    const dateString = String(birthday).slice(0, 10);
    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    // Evitar cambios de día por zonas horarias
    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  };

  // =========================
  // VISTA
  // =========================
  return (
    <div className="admin-employee" id="FormEmployees">
      <section className="employee-section-form">
        <h2>{form.id ? "Editar empleado" : "Registrar nuevo empleado"}</h2>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            <div className="employee-field">
              <label htmlFor="employee-name">Nombre completo *</label>
              <input
                id="employee-name"
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                maxLength={255}
                autoComplete="name"
                required
              />
            </div>

            <div className="employee-field">
              <label htmlFor="employee-id-card">Número de documento *</label>

              <input
                id="employee-id-card"
                type="text"
                name="id_card"
                placeholder="Número de documento"
                value={form.id_card}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{1,10}"
                title="Ingresa únicamente números, máximo 10 dígitos."
                required
              />
            </div>

            <div className="employee-field">
              <label htmlFor="employee-job-position">Cargo *</label>

              <input
                id="employee-job-position"
                type="text"
                name="job_position"
                placeholder="Cargo del empleado"
                value={form.job_position}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="employee-field">
              <label htmlFor="employee-area">Área *</label>

              <input
                id="employee-area"
                type="text"
                name="area"
                placeholder="Área de trabajo"
                value={form.area}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="employee-field">
              <label htmlFor="employee-birthday">Fecha de nacimiento *</label>

              <input
                id="employee-birthday"
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                max={new Date().toLocaleDateString("en-CA")}
                required
              />
            </div>
          </div>

          <p className="employee-form-note">* Todos los campos son obligatorios.</p>

          <div className="employee-form-buttons">
            <button
              type="submit"
              className="employee-btn employee-btn-primary"
              disabled={saving}
            >
              {saving ? "Guardando..." : form.id ? "Actualizar empleado" : "Registrar empleado"}
            </button>

            {form.id && (
              <button
                type="button"
                className="employee-btn employee-btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="employee-section-list" id="Employees">
        <div className="employee-list-heading">
          <h2>Empleados registrados</h2>

          <span className="employee-count">
            {filteredEmployees.length} de {employees.length} empleados
          </span>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="employee-search-filters">
          <input
            type="search"
            placeholder="🔍 Buscar por nombre, documento, cargo o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar empleados"
          />

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            aria-label="Filtrar por área"
          >
            <option value="">Todas las áreas</option>

            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {(search || areaFilter) && (
            <button
              type="button"
              className="employee-btn employee-btn-secondary"
              onClick={() => {setSearch("");setAreaFilter("");}}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        {loading ? (<p className="employee-empty">Cargando empleados...</p>
        ) : employees.length === 0 ? (
          <p className="employee-empty">No hay empleados registrados.</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="employee-empty">No se encontraron empleados con los filtros seleccionados.</p>
        ) : (
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Cargo</th>
                  <th>Área</th>
                  <th>Fecha de nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td data-label="Documento">{employee.id_card}</td>

                    <td data-label="Nombre">{employee.name}</td>

                    <td data-label="Cargo">{employee.job_position}</td>

                    <td data-label="Área">
                      <span className="employee-area-badge">{employee.area}</span>
                    </td>

                    <td data-label="Fecha de nacimiento">{formatBirthday(employee.birthday)}</td>

                    <td data-label="Acciones" className="employee-actions">
                      <button
                        type="button"
                        className="employee-btn-edit"
                        onClick={() => handleEdit(employee)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="employee-btn-delete"
                        onClick={() => handleDelete(employee.id)}
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