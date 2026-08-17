#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { parts, themes } = require("./datos-curso");

const root = path.resolve(__dirname, "..");
const contentRoot = path.join(root, "02_CONTENIDOS");

const pad = (value) => String(value).padStart(2, "0");
const writeNew = (file, body) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, body, "utf8");
};

for (const part of parts) {
  const partDir = path.join(contentRoot, `parte-${pad(part.id)}-${part.slug}`);
  fs.mkdirSync(partDir, { recursive: true });
  for (const theme of themes.filter((item) => item.part === part.id)) {
    const themeDir = path.join(partDir, `tema-${pad(theme.id)}-${theme.slug}`);
    fs.mkdirSync(themeDir, { recursive: true });
    const moduleLines = theme.modules.map(([title, duration], index) =>
      `- [Módulo ${index + 1}: ${title}](modulo-${pad(index + 1)}.md) - ${duration} min`
    ).join("\n");
    writeNew(path.join(themeDir, "tema.md"), `---\n` +
      `id: t${pad(theme.id)}\nparte: ${part.id}\ntitulo: "${theme.title}"\nslug: ${theme.slug}\n` +
      `fuente: ${theme.source}\npaginas: ${theme.pages}\nestado: ${theme.published ? "publicado" : "borrador"}\n---\n\n` +
      `# ${theme.title}\n\n## Promesa narrativa\n\n${theme.promise}\n\n## Módulos\n\n${moduleLines}\n\n` +
      `## Objetivos del tema\n\n- Comprender los conceptos centrales con lenguaje simple.\n- Relacionar cada idea con el recorrido de la planta hacia la cosmética natural.\n- Reconocer los límites de seguridad aplicables.\n\n## Notas editoriales\n\nPendiente de revisión temática y visual.\n`);

    theme.modules.forEach(([title, duration], index) => {
      const number = index + 1;
      const id = `t${pad(theme.id)}-m${pad(number)}`;
      writeNew(path.join(themeDir, `modulo-${pad(number)}.md`), `---\n` +
        `id: ${id}\ntema: t${pad(theme.id)}\nparte: ${part.id}\ntitulo: "${title}"\n` +
        `duracion: ${duration}\nestado: ${theme.published ? "publicado" : "borrador"}\n` +
        `fuente: ${theme.source}\npaginas_fuente: por-relevar\nimagenes: []\n---\n\n` +
        `# ${title}\n\n> Estado editorial: ${theme.published ? "publicado en la versión demo; revisar adaptación al curso completo" : "borrador estructural"}.\n\n` +
        `## Apertura narrativa\n\n[Desarrollar una escena, pregunta o transformación que invite a continuar.]\n\n` +
        `## Desarrollo conceptual\n\n[Desarrollar exclusivamente los conceptos respaldados por las páginas asignadas.]\n\n` +
        `## Conceptos interactivos\n\n- **Concepto pendiente:** definición clara y simple.\n\n` +
        `## Imágenes asociadas\n\n[Agregar los identificadores aprobados del inventario visual.]\n\n` +
        `## Observación guiada\n\n1. Localizá el elemento principal.\n2. Compará sus partes o etapas.\n3. Explicá con tus palabras qué muestra.\n\n` +
        `## Actividad breve\n\n[Actividad de relación, orden, comparación o explicación.]\n\n` +
        `## Cuestionario\n\n1. [Pregunta]\n   - a) [Opción]\n   - b) [Opción correcta]\n   - c) [Opción]\n   - Respuesta: b\n   - Devolución: [Explicación simple.]\n\n` +
        `## Puente narrativo\n\n[Pregunta o descubrimiento que conduce al módulo siguiente.]\n`);
    });
  }
}

const totalMinutes = themes.flatMap((theme) => theme.modules).reduce((sum, module) => sum + module[1], 0);
const index = parts.map((part) => {
  const rows = themes.filter((theme) => theme.part === part.id).map((theme) => {
    const relative = `parte-${pad(part.id)}-${part.slug}/tema-${pad(theme.id)}-${theme.slug}/tema.md`;
    return `- [Tema ${theme.id}: ${theme.title}](${relative}) - ${theme.modules.length} módulos`;
  }).join("\n");
  return `## Parte ${part.id}. ${part.title}\n\n${rows}`;
}).join("\n\n");
fs.writeFileSync(path.join(contentRoot, "INDICE_CONTENIDOS.md"), `# Índice de contenidos\n\n` +
  `Curso: **De la planta a la esencia**  \nPartes: **${parts.length}**  \nTemas: **${themes.length}**  \nMódulos: **${themes.flatMap((theme) => theme.modules).length}**  \nDuración estimada: **${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60} min**\n\n${index}\n`, "utf8");

console.log(`Contenidos listos: ${themes.length} temas y ${themes.flatMap((theme) => theme.modules).length} módulos.`);
