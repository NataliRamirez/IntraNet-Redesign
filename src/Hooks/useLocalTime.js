import { useState, useEffect } from "react";

/**
 * Hook personalizado que obtiene y actualiza
 * la fecha y hora local del sistema en tiempo real.
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

      const timeString = now.toLocaleTimeString("es-CO", {hour: "2-digit",minute: "2-digit",second: "2-digit",});
      const dateString = now.toLocaleDateString("es-CO", {day: "numeric",month: "long",year: "numeric",});
      setTime(timeString);
      setDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return { time, date };
}