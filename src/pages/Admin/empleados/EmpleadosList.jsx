import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Empleados.css";

export default function EmpleadosList() {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [empleadoActual, setEmpleadoActual] = useState(null);

  const [formEmpleado, setFormEmpleado] = useState({
    nombre: "",
    cedula: "",
    cargo: "",
    area: "",
    fecha_nacimiento: "",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/empleados`;

  function parseDateOnly(dateStr) {
    if (!dateStr) return null;
    // Si viene con T, corta antes de la T
    const pure = dateStr.split("T")[0];
    const parts = pure.split("-");
    if (parts.length !== 3) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]); // 1..12
    const day = Number(parts[2]);
    return new Date(year, month - 1, day);
  }

  function formatDateOnlyToLocale(dateStr, locale = "es-CO") {
    const d = parseDateOnly(dateStr);
    if (!d) return "";
    return d.toLocaleDateString(locale, {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });
  }

  const fetchEmpleados = async (nombre = "") => {
    try {
      setLoading(true);
      const url = nombre ? `${API_URL}?nombre=${nombre}` : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setEmpleados(data);
      setError("");
    } catch (err) {
      setError("Error al obtener empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleBuscar = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim() === "") {
      fetchEmpleados();
    } else {
      const filtrados = empleados.filter((emp) =>
        emp.nombre.toLowerCase().includes(valor.toLowerCase())
      );
      setEmpleados(filtrados);
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡El empleado será eliminado permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchEmpleados(busqueda);
        Swal.fire(
          "¡Eliminado!",
          "El empleado ha sido eliminado correctamente.",
          "success"
        );
      } catch (err) {
        Swal.fire("Error", "Error al eliminar el empleado.", "error");
      }
    }
  };

  const handleAbrirModalNuevo = () => {
    setFormEmpleado({
      nombre: "",
      cedula: "",
      cargo: "",
      area: "",
      fecha_nacimiento: "",
    });
    setEditando(false);
    setShowModal(true);
  };

  const handleAbrirModalEditar = (empleado) => {
    const fechaISO = empleado.fecha_nacimiento
      ? parseDateOnly(empleado.fecha_nacimiento)
      : null;

    setFormEmpleado({
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      cargo: empleado.cargo,
      area: empleado.area,
      fecha_nacimiento: fechaISO
        ? fechaISO.toISOString().slice(0, 10)
        : "",
    });
    setEmpleadoActual(empleado);
    setEditando(true);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setEmpleadoActual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!formEmpleado.nombre.trim() || !formEmpleado.cedula.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "El nombre y la cédula son obligatorios.",
      });
      return;
    }

    try {
      const method = editando ? "PUT" : "POST";
      const url = editando ? `${API_URL}/${empleadoActual.id}` : API_URL;
      const payload = { ...formEmpleado };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = editando ? "Error al actualizar" : "Error al crear";
        throw new Error(errorText);
      }

      Swal.fire({
        icon: "success",
        title: editando ? "Actualizado!" : "Guardado!",
        text: `El empleado ha sido ${editando ? "actualizado" : "registrado"} correctamente.`,
        showConfirmButton: false,
        timer: 1500,
      });

      await fetchEmpleados();
      setShowModal(false);
      setEmpleadoActual(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de Guardado",
        text: `Ocurrió un error: ${err.message}`,
      });
    }
  };

  return (
    <div className="empleados-container">
      <h1>Gestión de Empleados:</h1>

      <div className="empleados-controls">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={handleBuscar}
        />
        <button onClick={handleAbrirModalNuevo}>➕ Nuevo Empleado</button>
      </div>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="empleados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Cédula</th>
              <th>Cargo</th>
              <th>Área</th>
              <th>Fecha Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No se encontraron empleados.
                </td>
              </tr>
            ) : (
              empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.cedula}</td>
                  <td>{emp.cargo}</td>
                  <td>{emp.area}</td>
                  <td>{formatDateOnlyToLocale(emp.fecha_nacimiento)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleAbrirModalEditar(emp)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleEliminar(emp.id)}
                    >
                      🗑️ Eliminar 
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editando ? "Editar Empleado" : "Registrar Nuevo Empleado"}</h2>
            <form onSubmit={handleGuardar}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formEmpleado.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cedula"
                placeholder="Cédula"
                value={formEmpleado.cedula}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cargo"
                placeholder="Cargo"
                value={formEmpleado.cargo}
                onChange={handleChange}
              />
              <input
                type="text"
                name="area"
                placeholder="Área"
                value={formEmpleado.area}
                onChange={handleChange}
              />
              <input
                type="date"
                name="fecha_nacimiento"
                value={formEmpleado.fecha_nacimiento}
                onChange={handleChange}
              />
              <div className="modal-buttons">
                <button type="submit" className="action-btn">
                  {editando ? "Actualizar" : "Guardar"}
                </button>
                <button type="button" onClick={handleCerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
