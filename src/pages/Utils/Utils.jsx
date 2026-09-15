import "./Utilidades.css";
import pdfWord from "../../assets/images/PDF-WORD.jpg";
import wordPdf from "../../assets/images/WORD-PDF.jpg";
import pdfExcel from "../../assets/images/PDF-EXCEL.png";
import jpgPng from "../../assets/images/JPG-PNG.webp";
import excelPdf from "../../assets/images/EXCEL-PDF.png";
import removeImg from "../../assets/images/REMOVE-IMG.png";
import comprimirPdf from "../../assets/images/COMPRIMIR-PDF.png";
import dividirPdf from "../../assets/images/DIVIDIR-PDF.png";

export default function Utilidades() {
  const tools = [
    {
      title: "PDF a Word",
      description: "Convierte tus archivos PDF a documentos de Word editables.",
      image: pdfWord,
      url: "https://www.ilovepdf.com/pdf_to_word",
    },
    {
      title: "Word a PDF",
      description: "Convierte documentos de Word a archivos PDF fácilmente.",
      image: wordPdf,
      url: "https://www.ilovepdf.com/word_to_pdf",
    },
    {
      title: "PDF a Excel",
      description: "Extrae datos de PDF a hojas de Excel fácilmente.",
      image: pdfExcel,
      url: "https://www.ilovepdf.com/pdf_to_excel",
    },
    {
      title: "JPG a PNG",
      description: "Convierte imágenes JPG a formato PNG.",
      image: jpgPng,
      url: "https://convertio.co/jpg-png/",
    },
    {
      title: "Excel a PDF",
      description: "Exporta hojas de cálculo a un PDF listo para imprimir.",
      image: excelPdf,
      url: "https://www.ilovepdf.com/excel_to_pdf",
    },
    {
      title: "Remover fondo de imágenes",
      description: "Elimina el fondo de tus imágenes con un solo clic.",
      image: removeImg,
      url: "https://www.remove.bg/es",
    },
    {
      title: "Comprimir PDF",
      description: "Reduce el tamaño de tus archivos PDF sin perder calidad.",
      image: comprimirPdf,
      url: "https://www.ilovepdf.com/es/comprimir_pdf",
    },
    {
      title: "Dividir PDF",
      description: "Separa páginas específicas de un archivo PDF.",
      image: dividirPdf,
      url: "https://www.ilovepdf.com/es/dividir_pdf",
    },
  ];

  return (
    <div>
      <div className="utilidades-header">
        <h1>Sección de Utilidades 📃</h1>
        <p>
          En esta sección encontrarás herramientas útiles para tu trabajo diario,
          como convertir archivos PDF, imágenes y hojas de cálculo en diferentes formatos.
        </p>
      </div>

      <div className="utilidades-container">
        {tools.map((tool, index) => (
          <div className="utilidad-card" key={index}>
            <img
              src={tool.image}
              alt={tool.title}
              className="utilidad-image"
            />
            <h2 className="utilidad-title">{tool.title}</h2>
            <p className="utilidad-description">{tool.description}</p>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="utilidad-btn"
            >
              Ir a la herramienta
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
