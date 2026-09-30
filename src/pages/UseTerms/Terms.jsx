import React from "react";
import "./Terms.css";

export default function Terms() {
  return (
    <main className="terms-page">
      <section className="terms-header">
        <h1>POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h1>
        <p>
          Información sobre el uso de la IntraNet y el tratamiento de
          los datos personales de sus usuarios.
        </p>
      </section>

      <section className="terms-content">

        <article className="terms-card">
          <h2>EMCA Empresas Públicas de Calarcá E.S.P.</h2>
          <ul>NIT: [Número de NIT]</ul>
          <ul>Domicilio: Cra. 24 #3974, Calarcá, Quindío</ul>
          <ul>Teléfono: +57 (606) 7421114</ul>
          <ul>Correo Electrónico: [correo_proteccion_datos@empresa.com]</ul>
        </article>

        <article className="terms-card">
          <h2>2. Uso de la plataforma</h2>
          <p>
            Los usuarios se comprometen a utilizar la plataforma de
            manera responsable, respetuosa y conforme a la legislación
            colombiana vigente.
          </p>

          <ul>
            <li>No compartir las credenciales de acceso.</li>
            <li>No utilizar cuentas pertenecientes a otros usuarios.</li>
            <li>No alterar, copiar o manipular información sin autorización.</li>
            <li>No realizar actividades que puedan afectar el funcionamiento de la plataforma.</li>
          </ul>
        </article>

        <article className="terms-card">
          <h2>3. Tratamiento de datos personales</h2>
          <p>
            La organización podrá recopilar y tratar datos personales
            necesarios para la gestión de usuarios, comunicación
            interna, administración de servicios y funcionamiento de
            la plataforma.
          </p>

          <p>
            Los datos serán tratados de acuerdo con la normativa
            colombiana aplicable en materia de protección de datos
            personales, incluyendo la Ley 1581 de 2012 y sus normas
            reglamentarias.
          </p>
        </article>

        <article className="terms-card">
          <h2>4. Información recopilada</h2>
          <p>
            Dependiendo de las funcionalidades utilizadas, la
            plataforma podrá almacenar información como:
          </p>

          <ul>
            <li>Nombre del usuario.</li>
            <li>Número de identificación.</li>
            <li>Correo electrónico.</li>
            <li>Cargo o área dentro de la organización.</li>
            <li>Información relacionada con el uso de la plataforma.</li>
          </ul>
        </article>

        <article className="terms-card">
          <h2>5. Finalidad del tratamiento</h2>
          <p>
            Los datos personales podrán ser utilizados para:
          </p>

          <ul>
            <li>Gestionar y autenticar las cuentas de usuario.</li>
            <li>Facilitar el acceso a los servicios de la IntraNet.</li>
            <li>Enviar comunicaciones relacionadas con la organización.</li>
            <li>Gestionar noticias, eventos y actividades internas.</li>
            <li>Mejorar la seguridad y funcionamiento de la plataforma.</li>
          </ul>
        </article>

        <article className="terms-card">
          <h2>6. Seguridad de la información</h2>
          <p>
            Se implementan medidas técnicas y organizativas orientadas
            a proteger la información contra accesos no autorizados,
            pérdida, alteración o divulgación indebida.
          </p>
        </article>

        <article className="terms-card">
          <h2>7. Derechos de los usuarios</h2>
          <p>
            Los titulares de los datos personales podrán ejercer los
            derechos reconocidos por la legislación colombiana,
            incluyendo consultar, actualizar, corregir o solicitar la
            supresión de sus datos cuando corresponda.
          </p>
        </article>

        <article className="terms-card">
          <h2>8. Responsabilidad del usuario</h2>
          <p>
            Cada usuario es responsable de mantener la confidencialidad
            de sus credenciales y de todas las actividades realizadas
            mediante su cuenta.
          </p>
        </article>

        <article className="terms-card">
          <h2>9. Cambios en los términos</h2>
          <p>
            La organización podrá actualizar estos términos cuando sea
            necesario para reflejar cambios legales, técnicos u
            operativos. Las modificaciones serán publicadas en esta
            plataforma.
          </p>
        </article>

        <article className="terms-card">
          <h2>10. Contacto</h2>
          <p>
            Para realizar consultas relacionadas con el tratamiento de
            datos personales o el uso de la plataforma, el usuario
            podrá comunicarse con los canales oficiales establecidos
            por la organización.
          </p>
        </article>

        <div className="terms-footer">
          <p>
            Última actualización: septiembre de 2026
          </p>
        </div>

      </section>
    </main>
  );
}
