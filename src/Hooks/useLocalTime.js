import { useState, useEffect } from "react";

/**
 * Hook personalizado que obtiene y actualiza
 * la fecha y hora local del sistema en tiempo real.
 *
 * Actualiza la información cada segundo y retorna
 * los valores formateados para ser utilizados
 * en cualquier componente de la aplicación.
 *
 * @returns {Object} Objeto con la hora y fecha actual.
 * @returns {string} returns.time - Hora actual en formato HH:MM:SS.
 * @returns {string} returns.date - Fecha actual en formato largo.
 */
export default function useLocalTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Hora con formato 2 dígitos
      const timeString = now.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Fecha larga con mes en letras
      const dateString = now.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return { time, date };
}
