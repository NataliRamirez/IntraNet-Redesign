import React from "react";
import "./Terms.css";

export default function TermsOfService() {
  return (
    <main className="terms-page">
      <section className="terms-header" id="termsofservice">
        <h1>TÉRMINOS Y CONDICIONES DE USO</h1>
        <p>
          Condiciones de acceso, uso y responsabilidades de los usuarios
          de la IntraNet de EMCA Empresas Públicas de Calarcá E.S.P.
        </p>
      </section>

      <section className="terms-content">

        {/* INFORMACIÓN DE LA EMPRESA */}
        <article className="terms-card">
          <h2>EMCA Empresas Públicas de Calarcá E.S.P.</h2>

          <ul>
            <li>NIT: 890.000.377-0</li>
            <li>Cra. 24 #39-54 Torre B, Calarcá, Quindío</li>
            <li>Teléfono: +57 (000) 0000000</li>
            <li>
              Correo electrónico: contactenos@emca-calarca-quindio.gov.co
            </li>
          </ul>

          <p className="p">
            Estos términos establecen las condiciones generales para el
            acceso y uso de la intranet institucional por parte de los
            empleados y demás usuarios autorizados.
          </p>
        </article>

        {/* OBJETIVO Y ALCANCE */}
        <article className="terms-card">
          <h2>OBJETIVO Y ALCANCE</h2>

          <p>
            Los presentes términos y condiciones tienen como finalidad
            establecer las reglas para el acceso y uso adecuado de la
            intranet de EMCA Empresas Públicas de Calarcá E.S.P., una
            plataforma tecnológica destinada a facilitar la comunicación
            interna, la consulta de información institucional y la
            gestión de contenidos relacionados con las actividades
            de la empresa.
          </p>

          <p>
            Estas condiciones se aplican a todos los usuarios que accedan
            a la plataforma, teniendo en cuenta los permisos y funciones
            asignados a cada cuenta.
          </p>

          <p>
            El uso de la intranet implica el compromiso de cumplir estas
            condiciones, las políticas institucionales y las disposiciones
            legales aplicables en Colombia.
          </p>
        </article>

        {/* DESCRIPCIÓN DE LA PLATAFORMA */}
        <article className="terms-card">
          <h2>DESCRIPCIÓN DE LOS SERVICIOS</h2>

          <p>
            La intranet es una herramienta de uso institucional que
            permite consultar y gestionar información relacionada con
            las actividades de EMCA. Entre sus funcionalidades se
            encuentran:
          </p>

          <ul>
            <li>Consulta de noticias, comunicados e información institucional.</li>
            <li>Consulta de eventos y actividades organizadas por la empresa.</li>
            <li>Visualización de notificaciones relacionadas con publicaciones y actualizaciones institucionales.</li>
            <li>Consulta de información organizacional, como el nombre, el área y el cargo de los empleados, de acuerdo con los permisos establecidos.</li>
            <li>Visualización de felicitaciones y recordatorios de cumpleaños, conforme a las autorizaciones y condiciones aplicables.</li>
            <li>Administración de noticias, eventos, usuarios y demás funcionalidades autorizadas para los responsables de la plataforma.</li>
            <li>Disposición de herramientas para empleados.</li>
          </ul>
        </article>

        {/* ACCESO A LA PLATAFORMA */}
        <article className="terms-card">
          <h2>ACCESO Y USO DE LA INTRANET</h2>

          <p>El acceso a las funcionalidades privadas de la intranet requiere una cuenta autorizada y, cuando corresponda, la autenticación mediante las credenciales asignadas al usuario.
          </p>
          <p>Cada usuario podrá acceder únicamente a las opciones y recursos habilitados según su perfil y las funciones que desempeñe dentro de la organización.</p>
          <p>El usuario se compromete a utilizar la plataforma de manera responsable, exclusivamente para los fines institucionales permitidos y respetando las normas internas de EMCA.</p>
        </article>

        {/* RESPONSABILIDADES DEL USUARIO */}
        <article className="terms-card">
          <h2>RESPONSABILIDADES DE LOS USUARIOS</h2>

          <p>
            Los usuarios de la intranet deberán cumplir las siguientes
            responsabilidades:
          </p>

          <ul>
            <li>
              Proporcionar información veraz y mantener actualizados
              los datos que les corresponda gestionar.
            </li>
            <li>
              Mantener la confidencialidad de sus credenciales de acceso
              y evitar compartirlas con otras personas.
            </li>
            <li>
              Cerrar su sesión cuando terminen de utilizar la plataforma,
              especialmente en equipos compartidos.
            </li>
            <li>
              Utilizar las noticias, eventos, notificaciones y demás
              recursos únicamente para los fines autorizados.
            </li>
            <li>
              Respetar la privacidad y los datos personales de los
              demás empleados.
            </li>
            <li>
              Informar al responsable de la plataforma sobre posibles
              fallas de seguridad, accesos sospechosos o errores
              que puedan afectar la información institucional.
            </li>
            <li>
              Abstenerse de realizar acciones que afecten el funcionamiento,
              la disponibilidad o la seguridad de la intranet.
            </li>
          </ul>
        </article>

        {/* RESTRICCIONES DE USO */}
        <article className="terms-card">
          <h2>USOS NO AUTORIZADOS</h2>

          <p>
            Está prohibido utilizar la intranet para realizar actividades
            que comprometan la seguridad, la integridad o el funcionamiento
            de la plataforma, así como para acceder a información sin
            autorización.
          </p>

          <ul>
            <li>
              Acceder a cuentas, módulos o información sin contar
              con los permisos correspondientes.
            </li>
            <li>
              Modificar, eliminar o publicar información institucional
              sin autorización.
            </li>
            <li>
              Compartir credenciales o permitir que terceros utilicen
              una cuenta personal.
            </li>
            <li>
              Intentar vulnerar los mecanismos de autenticación,
              seguridad o control de acceso.
            </li>
            <li>
              Utilizar la información de los empleados para fines
              personales o distintos de los autorizados.
            </li>
            <li>
              Publicar contenido ilegal, ofensivo, engañoso o que
              vulnere los derechos de otras personas.
            </li>
            <li>
              Utilizar la plataforma para actividades que no estén
              relacionadas con sus propósitos institucionales o que
              contravengan las normas de la empresa.
            </li>
          </ul>
        </article>

        {/* RESPONSABILIDADES DE LOS ADMINISTRADORES */}
        <article className="terms-card">
          <h2>RESPONSABILIDADES DE LOS ADMINISTRADORES</h2>

          <p>
            Los usuarios que cuenten con permisos administrativos
            deberán utilizar sus privilegios exclusivamente para
            desarrollar las funciones que les hayan sido asignadas.
          </p>

          <ul>
            <li>
              Gestionar usuarios y permisos de acuerdo con las
              autorizaciones institucionales.
            </li>
            <li>
              Publicar, actualizar o eliminar noticias y eventos
              conforme a sus responsabilidades.
            </li>
            <li>
              Proteger la confidencialidad de la información a la
              que tengan acceso.
            </li>
            <li>
              Evitar el uso indebido de las herramientas administrativas
              y de los datos personales disponibles en la plataforma.
            </li>
            <li>
              Reportar incidentes que puedan afectar la seguridad
              o disponibilidad del sistema.
            </li>
          </ul>
        </article>

        {/* PROTECCIÓN DE DATOS PERSONALES */}
        <article className="terms-card">
          <h2>PROTECCIÓN DE DATOS PERSONALES</h2>

          <p>
            El tratamiento de los datos personales que se realice
            mediante la intranet estará sujeto a la Política de
            Privacidad y Tratamiento de Datos Personales de EMCA,
            así como a la Ley 1581 de 2012 y demás normas aplicables
            en Colombia.
          </p>

          <p>
            Los usuarios deberán respetar la privacidad de sus
            compañeros y utilizar los datos personales únicamente
            cuando estén autorizados y para las finalidades
            institucionales correspondientes.
          </p>

          <p>
            La publicación de fotografías, cumpleaños u otra
            información personal deberá respetar las autorizaciones
            requeridas y los derechos de sus titulares.
          </p>

          <p>
            Estos términos no sustituyen la política de privacidad
            ni constituyen, por sí solos, una autorización para el
            tratamiento de datos personales.
          </p>
        </article>

        {/* PROPIEDAD INTELECTUAL */}
        <article className="terms-card">
          <h2>CONTENIDOS Y PROPIEDAD INTELECTUAL</h2>

          <p>
            Los textos, logotipos, diseños, imágenes, documentos y
            demás contenidos institucionales disponibles en la intranet
            deberán utilizarse respetando los derechos de propiedad
            intelectual y las autorizaciones correspondientes.
          </p>

          <p>
            Los usuarios no podrán reproducir, distribuir, modificar
            o utilizar los contenidos para fines distintos de los
            permitidos por la empresa o por la legislación aplicable.
          </p>

          <p>
            La publicación de contenido por parte de los usuarios
            deberá respetar los derechos de terceros y las políticas
            institucionales.
          </p>
        </article>

        {/* DISPONIBILIDAD Y MANTENIMIENTO */}
        <article className="terms-card">
          <h2>DISPONIBILIDAD Y MANTENIMIENTO</h2>

          <p>
            EMCA procurará mantener la intranet disponible y en
            condiciones adecuadas de funcionamiento. Sin embargo,
            el acceso podrá verse interrumpido temporalmente por
            mantenimiento, actualizaciones, fallas técnicas,
            problemas de conectividad o circunstancias ajenas
            al control de la empresa.
          </p>

          <p>
            Cuando sea posible, se procurará informar a los usuarios
            sobre los mantenimientos programados que afecten el
            funcionamiento de la plataforma.
          </p>
        </article>

        {/* MEDIDAS ANTE INCUMPLIMIENTOS */}
        <article className="terms-card">
          <h2>INCUMPLIMIENTO DE LOS TÉRMINOS</h2>

          <p>
            Cuando se identifique un posible incumplimiento de estos
            términos, EMCA podrá revisar la situación y adoptar
            medidas proporcionales dentro de sus competencias y
            conforme a las normas y procedimientos aplicables.
          </p>

          <p>
            Cuando resulte necesario para proteger la seguridad
            de la plataforma o de la información, podrán limitarse
            o suspenderse temporalmente los accesos afectados,
            de acuerdo con los procedimientos institucionales.
          </p>

          <p>
            Las medidas relacionadas con los empleados deberán
            respetar sus derechos, las normas laborales aplicables
            y los procedimientos internos correspondientes.
          </p>
        </article>

        {/* MODIFICACIONES */}
        <article className="terms-card">
          <h2>MODIFICACIONES DE LOS TÉRMINOS</h2>

          <p>
            EMCA podrá actualizar estos términos cuando existan
            cambios en las funcionalidades de la intranet, en los
            procedimientos institucionales o en la normativa aplicable.
          </p>

          <p>
            Las modificaciones serán comunicadas a los usuarios
            mediante los canales institucionales disponibles.
            La versión vigente deberá estar disponible para su consulta.
          </p>
        </article>

        {/* CONTACTO */}
        <article className="terms-card">
          <h2>CONTACTO Y SOPORTE</h2>

          <p>
            Para reportar errores, dificultades de acceso, incidentes
            de seguridad o inquietudes relacionadas con el uso de la
            intranet, los usuarios podrán comunicarse con el área
            responsable de la plataforma a través de los canales
            institucionales habilitados.
          </p>

          <p>
            Para consultas o reclamos relacionados con el tratamiento
            de datos personales, se deberá consultar la Política de
            Privacidad y Tratamiento de Datos Personales y utilizar
            los canales allí establecidos.
          </p>

          <ul>
            <li>
              Correo institucional: contactenos@emca-calarca-quindio.gov.co
            </li>
            <li>
              Dirección: Cra. 24 #39-54 Torre B, Calarcá, Quindío.
            </li>
          </ul>
        </article>

        {/* VIGENCIA */}
        <article className="terms-card">
          <h2>VIGENCIA</h2>

          <p>
            Estos términos entrarán en vigencia a partir de su
            aprobación y publicación por parte de EMCA Empresas
            Públicas de Calarcá E.S.P. y permanecerán vigentes
            hasta que sean modificados o sustituidos por una
            versión posterior.
          </p>
        </article>

        <div className="terms-footer">
          <p>Última actualización: octubre de 2026</p>
        </div>

      </section>
    </main>
  );
}
