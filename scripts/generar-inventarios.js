#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { parts, themes } = require("./datos-curso");

const root = path.resolve(__dirname, "..");
const imageRoot = path.join(root, "03_IMAGENES");
const sourceRoot = path.join(root, "01_FUENTES");
const images = JSON.parse(fs.readFileSync(path.join(imageRoot, "imagenes.json"), "utf8"));
const originalNames = [
  "1º%20clase%20aceites.pdf",
  "2°%20ANATOMÍA%20VEGETAL.pdf",
  "3°%20GENERALIDADES%20DE%20LAS%20SEMILLAS.pdf",
  "6° HERBARIO.pdf",
  "11°%20LABORES%20CULTURALES.pdf",
  "8°%20TÉCNICAS%20DE%20PODA.pdf",
  "4%20TÉCNICAS%20DE%20HIGIENE%20Y%20SEGURIDAD%20DE%20UN%20LABORATORIO.pdf",
  "5° clase tecnicas de separacion.pdf",
  "12°%20TÉCNICA%20DE%20EXTRACCIÓN%20DE%20LOS%20ACEITES%20ESENCIALES.pdf",
  "4%20clase%20-%20el%20origen.pdf",
  "7°%20TIPOS%20DE%20ACEITES%20ESENCIALES.pdf",
  "9°%20AROMATERAPIA.pdf",
  "10°%20AROMATERÁPIA%20SEGUNDA%20PARTE.pdf",
  "14°%20Técnicas%20de%20Masajes.pdf",
  "15°%20AGROINDUSTRIA%20ESENCIERA.pdf"
];

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = (headers, rows) => [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";

for (const theme of themes) {
  const dir = path.join(imageRoot, `tema-${String(theme.id).padStart(2, "0")}-${theme.slug}`);
  for (const stage of ["01_originales", "02_recortes", "03_web"]) fs.mkdirSync(path.join(dir, stage), { recursive: true });
}

const imageHeaders = ["id", "parte", "tema", "modulo", "titulo", "descripcion", "pdf_origen", "pagina_origen", "tipo_visual", "archivo_original", "archivo_recortado", "archivo_web", "versiones_adicionales", "texto_alternativo", "epigrafe", "consigna_observacion", "estado", "notas_revision", "fecha_actualizacion"];
fs.writeFileSync(path.join(imageRoot, "inventario_imagenes.csv"), csv(imageHeaders, images.map((item) => imageHeaders.map((key) => item[key]))));
const imageTable = images.map((item) => `| ${item.id} | ![${item.texto_alternativo}](${item.archivo_web}) | ${item.titulo} | T${item.tema} M${item.modulo} | ${item.estado} | [original](${item.archivo_original}) · [recorte](${item.archivo_recortado}) · [web](${item.archivo_web}) |`).join("\n");
fs.writeFileSync(path.join(imageRoot, "INVENTARIO_IMAGENES.md"), `# Inventario de imágenes\n\n` +
  `Este documento permite revisar cada visual, su tratamiento y su estado editorial. El CSV contiguo contiene todos los campos técnicos.\n\n` +
  `| ID | Vista | Título | Ubicación | Estado | Archivos |\n|---|---|---|---|---|---|\n${imageTable}\n\n` +
  `## Estados admitidos\n\nCandidata · Seleccionada · En recorte · Lista para revisar · Aprobada · Publicada · Reemplazar · Retirada.\n`, "utf8");

const manifestRows = themes.map((theme, index) => {
  const file = path.join(sourceRoot, "PDF", theme.source);
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  return `| ${theme.id} | ${theme.title} | \`${originalNames[index]}\` | \`${theme.source}\` | ${theme.pages} | \`${hash}\` |`;
}).join("\n");
fs.writeFileSync(path.join(sourceRoot, "MANIFIESTO_FUENTES.md"), `# Manifiesto de fuentes\n\n` +
  `Los archivos de esta carpeta son copias de trabajo. Los originales permanecen en la carpeta PDF superior.\n\n` +
  `| Tema | Uso | Nombre original | Copia normalizada | Páginas | SHA-256 |\n|---:|---|---|---|---:|---|\n${manifestRows}\n\n` +
  `## Duplicado detectado\n\nLos dos archivos titulados “Generalidades de las semillas” tenían el mismo SHA-256 (\`c3121cbee572d4a0c3ca68a619d129c1de41eb0d810155eb4cd4276c950122b4\`). Se conservó una sola copia normalizada.\n`, "utf8");

const mapHeaders = ["modulo_id", "parte", "tema_id", "tema", "modulo", "duracion_min", "pdf", "paginas_fuente", "estado_trazabilidad", "notas"];
const verifiedPages = {
  1: ["1-10", "10-12"],
  3: ["7-11", "12-17", "18-27", "28-32"]
};
const mapRows = themes.flatMap((theme) => theme.modules.map(([title, duration], index) => [
  `t${String(theme.id).padStart(2, "0")}-m${String(index + 1).padStart(2, "0")}`,
  theme.part, `t${String(theme.id).padStart(2, "0")}`, theme.title, title, duration, theme.source,
  verifiedPages[theme.id]?.[index] || "por-relevar",
  verifiedPages[theme.id] ? "verificado" : "pendiente", ""
]));
fs.writeFileSync(path.join(sourceRoot, "mapa_fuentes.csv"), csv(mapHeaders, mapRows));

const pendingHeaders = ["id", "tipo", "ubicacion", "prioridad", "estado", "responsable", "nota"];
const pendingRows = themes.filter((theme) => !theme.published).map((theme) => [`t${String(theme.id).padStart(2, "0")}`, "contenido", theme.title, "alta", "pendiente", "", "Desarrollar módulos y seleccionar imágenes"]);
fs.writeFileSync(path.join(root, "04_REVISION", "pendientes.csv"), csv(pendingHeaders, pendingRows));

console.log(`Inventarios listos: ${images.length} imágenes, ${themes.length} fuentes y ${mapRows.length} módulos trazados.`);
