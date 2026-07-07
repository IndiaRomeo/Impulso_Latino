import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, "entregables");
fs.mkdirSync(outDir, { recursive: true });

const report = {
  title: "Informe de desarrollo y costos",
  subtitle: "Proyecto Impulso Latino",
  date: "7 de mayo de 2026",
  client: "Impulso Latino",
  preparedBy: "",
  summary:
    "Se desarrollo una plataforma web para la gestion de solicitudes de prestamos, seguimiento de clientes, administracion interna y puesta en produccion para uso desde navegador o como aplicacion instalada en el dispositivo.",
  deliverables: [
    "Sitio publico responsive con secciones comerciales, requisitos, confianza, contacto y llamados a aplicar.",
    "Calculadora interactiva de prestamo para estimar cuotas segun monto y plazo.",
    "Formulario de solicitud en 4 pasos con registro de datos personales, laborales, bancarios y detalles del prestamo.",
    "Creacion de cuenta de cliente e inicio de sesion con rutas protegidas.",
    "Portal del cliente con estado de solicitud, perfil, prestamos, solicitudes nuevas y datos de desembolso.",
    "Panel administrativo tipo CRM para revisar leads, mover etapas, ver perfiles y gestionar informacion del cliente.",
    "Modulo de prestamos aprobados, saldo, cuotas, fechas y estado del prestamo.",
    "Modulo de mensajes de contacto conectado al panel administrativo, con asignacion por administrador.",
    "Base de datos en Supabase con perfiles, leads, prestamos, mensajes de contacto y politicas de seguridad RLS.",
    "Migraciones de base de datos para funcionalidades nuevas y separacion de trabajo por administradores.",
    "Configuracion PWA para instalar la plataforma en celular o computador como aplicacion.",
    "Guias de uso para cliente/equipo y guia de instalacion de la app."
  ],
  tech: [
    "React + Vite",
    "Tailwind CSS",
    "Supabase Auth y base de datos",
    "React Router",
    "PWA",
    "Resend para integraciones de correo"
  ],
  costs: [
    {
      item: "Desarrollo de la plataforma web",
      description:
        "Diseno e implementacion de sitio publico, formulario, portal de cliente, panel administrativo, CRM, autenticacion, conexion con base de datos y documentacion.",
      amount: 600000
    },
    {
      item: "Produccion y puesta en marcha",
      description:
        "Configuracion necesaria para dejar el proyecto funcionando en produccion, incluyendo preparacion de despliegue, servicios, dominio/hosting o equivalentes, base de datos en la nube y ajustes finales.",
      amount: 525000
    }
  ],
  notes: [
    "Los valores estan expresados en pesos colombianos (COP).",
    "El valor de produccion agrupa los costos necesarios para tener el proyecto disponible y funcionando fuera del entorno local.",
    "No incluye cambios futuros de alcance, nuevas funcionalidades o mantenimiento recurrente, salvo acuerdo adicional."
  ]
};

const money = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);

const total = report.costs.reduce((sum, row) => sum + row.amount, 0);

function htmlEscape(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${htmlEscape(report.title)} - ${htmlEscape(report.subtitle)}</title>
  <style>
    @page { size: Letter; margin: 28mm 22mm; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
      margin: 0;
      background: #f3f4f6;
    }
    .page {
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
      background: white;
      padding: 0.9in;
      box-sizing: border-box;
    }
    .eyebrow {
      color: #2563eb;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    h1 {
      margin: 8px 0 4px;
      font-size: 30px;
      line-height: 1.1;
      color: #111827;
    }
    .subtitle {
      margin: 0 0 20px;
      color: #4b5563;
      font-size: 15px;
    }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      margin-bottom: 20px;
      background: #f9fafb;
    }
    .label {
      display: block;
      color: #6b7280;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 3px;
    }
    h2 {
      font-size: 16px;
      margin: 22px 0 8px;
      color: #1d4ed8;
    }
    p, li {
      font-size: 11.5px;
      line-height: 1.45;
    }
    ul {
      margin-top: 6px;
      padding-left: 18px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 11px;
    }
    th {
      text-align: left;
      background: #eff6ff;
      color: #1e3a8a;
      border: 1px solid #bfdbfe;
      padding: 9px;
    }
    td {
      border: 1px solid #d1d5db;
      padding: 9px;
      vertical-align: top;
    }
    .amount {
      width: 130px;
      text-align: right;
      white-space: nowrap;
      font-weight: 700;
    }
    .total td {
      background: #111827;
      color: white;
      font-weight: 700;
      font-size: 12px;
    }
    .note {
      background: #f9fafb;
      border-left: 4px solid #2563eb;
      padding: 10px 12px;
      margin-top: 14px;
    }
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 10.5px;
    }
    @media print {
      body { background: white; }
      .page { margin: 0; padding: 0; width: auto; min-height: auto; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="eyebrow">Entrega de proyecto</div>
    <h1>${htmlEscape(report.title)}</h1>
    <p class="subtitle">${htmlEscape(report.subtitle)}</p>

    <section class="meta">
      <div><span class="label">Cliente</span>${htmlEscape(report.client)}</div>
      <div><span class="label">Fecha</span>${htmlEscape(report.date)}</div>
      <div><span class="label">Proyecto</span>Plataforma web de gestion de prestamos</div>
      <div><span class="label">Total</span>${money(total)}</div>
    </section>

    <h2>Resumen del trabajo realizado</h2>
    <p>${htmlEscape(report.summary)}</p>

    <h2>Alcance entregado</h2>
    <ul>
      ${report.deliverables.map((item) => `<li>${htmlEscape(item)}</li>`).join("\n      ")}
    </ul>

    <h2>Tecnologias utilizadas</h2>
    <p>${report.tech.map(htmlEscape).join(" · ")}</p>

    <h2>Desglose de costos</h2>
    <table>
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Descripcion</th>
          <th class="amount">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${report.costs
          .map(
            (row) => `<tr>
          <td><strong>${htmlEscape(row.item)}</strong></td>
          <td>${htmlEscape(row.description)}</td>
          <td class="amount">${money(row.amount)}</td>
        </tr>`
          )
          .join("\n        ")}
        <tr class="total">
          <td colspan="2">Total del proyecto</td>
          <td class="amount">${money(total)}</td>
        </tr>
      </tbody>
    </table>

    <h2>Notas</h2>
    <div class="note">
      <ul>
        ${report.notes.map((item) => `<li>${htmlEscape(item)}</li>`).join("\n        ")}
      </ul>
    </div>

    <div class="footer">
      Documento preparado para presentar el alcance, entregables y costos del proyecto Impulso Latino.
    </div>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "informe_costos_impulso_latino.html"), html, "utf8");

function pdfEscape(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function makePdf() {
  const objects = [];
  const pages = [];
  const width = 612;
  const height = 792;
  const margin = 56;
  const maxY = height - margin;
  const minY = margin;
  let stream = "";
  let y = maxY;
  let pageNo = 1;

  function addPage() {
    if (stream) {
      pages.push(stream);
    }
    stream = "";
    y = maxY;
    stream += "0.95 0.97 1 rg 0 0 612 792 re f\n";
    stream += "1 1 1 rg 42 36 528 720 re f\n";
    stream += "0.88 0.90 0.94 RG 42 36 528 720 re S\n";
    stream += `0.45 0.49 0.56 rg BT /F1 8 Tf 500 28 Td (${pdfEscape(String(pageNo))}) Tj ET\n`;
    pageNo += 1;
  }

  function ensure(space) {
    if (y - space < minY) addPage();
  }

  function text(txt, x, size = 10, color = "0.12 0.16 0.22", font = "F1") {
    stream += `${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(txt)}) Tj ET\n`;
  }

  function line(x1, y1, x2, y2, color = "0.82 0.85 0.90") {
    stream += `${color} RG ${x1} ${y1} m ${x2} ${y2} l S\n`;
  }

  function para(txt, opts = {}) {
    const x = opts.x ?? margin;
    const size = opts.size ?? 10;
    const leading = opts.leading ?? size + 4;
    const maxChars = opts.maxChars ?? 92;
    const color = opts.color ?? "0.12 0.16 0.22";
    const font = opts.font ?? "F1";
    const lines = wrapText(txt, maxChars);
    ensure(lines.length * leading + 4);
    for (const l of lines) {
      text(l, x, size, color, font);
      y -= leading;
    }
    y -= opts.after ?? 3;
  }

  function heading(txt) {
    ensure(34);
    y -= 8;
    text(txt, margin, 14, "0.11 0.30 0.70", "F2");
    y -= 18;
    line(margin, y + 8, width - margin, y + 8, "0.75 0.83 0.96");
  }

  function bullet(txt) {
    const lines = wrapText(txt, 86);
    ensure(lines.length * 13 + 2);
    text("-", margin + 8, 10, "0.12 0.16 0.22", "F2");
    text(lines[0], margin + 24, 10);
    y -= 13;
    for (const l of lines.slice(1)) {
      text(l, margin + 24, 10);
      y -= 13;
    }
    y -= 1;
  }

  function rect(x, yy, w, h, fill, stroke) {
    stream += `${fill} rg ${x} ${yy} ${w} ${h} re f\n`;
    stream += `${stroke} RG ${x} ${yy} ${w} ${h} re S\n`;
  }

  addPage();
  text("ENTREGA DE PROYECTO", margin, 9, "0.15 0.39 0.92", "F2");
  y -= 28;
  text(report.title, margin, 24, "0.07 0.09 0.15", "F2");
  y -= 20;
  text(report.subtitle, margin, 12, "0.29 0.33 0.39");
  y -= 26;

  rect(margin, y - 58, 500, 58, "0.98 0.98 0.99", "0.82 0.85 0.90");
  text(`Cliente: ${report.client}`, margin + 14, 10, "0.12 0.16 0.22", "F2");
  text(`Fecha: ${report.date}`, margin + 274, 10, "0.12 0.16 0.22", "F2");
  y -= 23;
  text("Proyecto: Plataforma web de gestion de prestamos", margin + 14, 10);
  text(`Total: ${money(total)}`, margin + 274, 10, "0.07 0.09 0.15", "F2");
  y -= 42;

  heading("Resumen del trabajo realizado");
  para(report.summary, { maxChars: 90 });

  heading("Alcance entregado");
  report.deliverables.forEach(bullet);

  heading("Tecnologias utilizadas");
  para(report.tech.join(" · "), { maxChars: 90 });

  heading("Desglose de costos");
  ensure(160);
  const tableX = margin;
  const tableW = 500;
  const rowH = 42;
  rect(tableX, y - 22, tableW, 22, "0.93 0.96 1", "0.75 0.83 0.96");
  text("Concepto", tableX + 8, 10, "0.12 0.23 0.49", "F2");
  text("Descripcion", tableX + 168, 10, "0.12 0.23 0.49", "F2");
  text("Valor", tableX + 438, 10, "0.12 0.23 0.49", "F2");
  y -= 22;
  for (const row of report.costs) {
    rect(tableX, y - rowH, tableW, rowH, "1 1 1", "0.82 0.85 0.90");
    text(row.item, tableX + 8, 9, "0.07 0.09 0.15", "F2");
    const desc = wrapText(row.description, 48).slice(0, 3);
    let descY = y;
    for (const l of desc) {
      stream += `0.12 0.16 0.22 rg BT /F1 8.5 Tf ${tableX + 168} ${descY} Td (${pdfEscape(l)}) Tj ET\n`;
      descY -= 11;
    }
    text(money(row.amount), tableX + 414, 9, "0.07 0.09 0.15", "F2");
    y -= rowH;
  }
  rect(tableX, y - 25, tableW, 25, "0.07 0.09 0.15", "0.07 0.09 0.15");
  text("Total del proyecto", tableX + 8, 11, "1 1 1", "F2");
  text(money(total), tableX + 408, 11, "1 1 1", "F2");
  y -= 38;

  heading("Notas");
  report.notes.forEach(bullet);

  y -= 16;
  line(margin, y, width - margin, y);
  y -= 16;
  para("Documento preparado para presentar el alcance, entregables y costos del proyecto Impulso Latino.", {
    size: 8.5,
    color: "0.42 0.45 0.50",
    maxChars: 110
  });

  pages.push(stream);

  const font1 = objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const font2 = objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageObjNums = [];
  const contentObjNums = [];
  for (const content of pages) {
    const contentObj = objects.push(`<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}endstream`);
    contentObjNums.push(contentObj);
    const pageObj = objects.push(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentObj} 0 R >>`
    );
    pageObjNums.push(pageObj);
  }
  const pagesObj = objects.push(
    `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${pageObjNums.length} >>`
  );
  for (const n of pageObjNums) {
    objects[n - 1] = objects[n - 1].replace("/Parent 0 0 R", `/Parent ${pagesObj} 0 R`);
  }
  const catalogObj = objects.push(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  fs.writeFileSync(path.join(outDir, "informe_costos_impulso_latino.pdf"), Buffer.from(pdf, "latin1"));
}

makePdf();

console.log("Generado:");
console.log(path.join(outDir, "informe_costos_impulso_latino.html"));
console.log(path.join(outDir, "informe_costos_impulso_latino.pdf"));
