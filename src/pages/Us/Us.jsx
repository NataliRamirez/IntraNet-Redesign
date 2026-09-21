import { motion } from "framer-motion";
import { ShieldCheck, Lightbulb, HeartHandshake, Users } from "lucide-react";
import "./Us.css";
import OrganigramaImage from "../../assets/images/Organigrama - EMCA.png";

export default function Us() {
  const values = ["Honestidad", "Compromiso", "Respeto", "Diligencia", "Justicia", "Confianza"];
  const urlOrganigramaPDF = "https://emca-calarca-quindio.micolombiadigital.gov.co/sites/emca-calarca-quindio/content/files/000516/25760_estructura-organizacional.pdf";

  return (
    <div className="us">

      {/* Hero */}
      <section id="Nosotros" className="us-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Sobre Nosotros</h2>
          <p>
            En <strong>EMCA E.S.P</strong> trabajamos con responsabilidad y compromiso
            para garantizar servicios de calidad que contribuyan al bienestar de la comunidad.
          </p>
        </motion.div>
      </section>

      {/* Misión y Visión */}
      <section id="MisionVision" className="us-mv">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <ShieldCheck size={48} color="#3b82f6" />
          <h2>Misión</h2>
          <p>
            EMPRESAS PÚBLICAS DE CALARCÁ E.S.P. es una empresa industrial y comercial del estado,
            de orden municipal, con autonomía administrativa y financiera, prestadora de los servicios públicos domiciliarios de acueducto, alcantarillado y aseo en el municipio de Calarcá.
          </p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <Lightbulb size={48} color="#3b82f6" />
          <h2>Visión</h2>
          <p>
            Aspiramos siempre ser una empresa líder a nivel regional con innovación, eficacia y eficiencia,
            logrando estándares de cantidad, calidad y continuidad en la prestación de nuestros servicios,
            generando confianza en la comunidad y partes interesadas.
          </p>
        </motion.div>
      </section>

      {/* Valores */}
      <section className="us-values">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          {values.map((value, i) => (
            <motion.div
              key={i}
              className="value-item"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            >
              <HeartHandshake size={28} color="#3b82f6" />
              <span>{value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Organigrama */}
      <section id="Organigrama" className="us-organizational-chart">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="organizational-chart-content"
        >
          <Users size={48} color="#3b82f6" />
          <h2>Estructura Organizacional</h2>
          <p>
            Conozca la jerarquía y distribución de los cargos que conforman la estructura de EMCA E.S.P., asegurando una gestión eficiente y transparente.
          </p>

          <motion.div
            className="organizational-chart-visual"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <a href={urlOrganigramaPDF} target="_blank" rel="noopener noreferrer">
              <img
                src={OrganigramaImage}
                alt="Organigrama de EMCA E.S.P."
                style={{
                  maxWidth: '50%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              />
            </a>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              * Haga click en la imagen para ver el organigrama completo (PDF). 📄
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}