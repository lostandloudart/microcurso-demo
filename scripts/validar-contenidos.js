#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { themes } = require("./datos-curso");

const root = path.resolve(__dirname, "..");
const contentRoot = path.join(root, "02_CONTENIDOS");
const errors = [];
const warnings = [];
const moduleFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/modulo-\d+\.md$/.test(entry.name)) moduleFiles.push(file);
  }
}

walk(contentRoot);
const expected = themes.flatMap((theme) => theme.modules).length;
if (moduleFiles.length !== expected) errors.push(`Se esperaban ${expected} módulos y se encontraron ${moduleFiles.length}.`);

for (const file of moduleFiles) {
  const body = fs.readFileSync(file, "utf8");
  const duration = Number((body.match(/^duracion:\s*(\d+)/m) || [])[1]);
  const status = (body.match(/^estado:\s*(.+)/m) || [])[1]?.trim();
  if (duration < 20 || duration > 30) errors.push(`${file}: duración fuera del rango 20-30.`);
  if (status === "publicado") {
    if (!body.includes("## Contenido publicado migrado")) errors.push(`${file}: falta el contenido publicado migrado.`);
    if (body.split(/\s+/).length < 800) errors.push(`${file}: el contenido publicado es demasiado breve.`);
  } else {
    for (const section of ["Apertura narrativa", "Desarrollo conceptual", "Conceptos interactivos", "Imágenes asociadas", "Observación guiada", "Actividad breve", "Cuestionario", "Puente narrativo"]) {
      if (!body.includes(`## ${section}`)) errors.push(`${file}: falta la sección ${section}.`);
    }
  }
  if (body.includes("[Desarrollar") || body.includes("[Pregunta]")) warnings.push(`${file}: conserva contenido pendiente.`);
}

const docsRoot = path.join(root, "docs");
const htmlFiles = [];
walkHtml(docsRoot);
function walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(file);
    else if (entry.name.endsWith(".html")) htmlFiles.push(file);
  }
}

if (htmlFiles.length !== 16) errors.push(`Se esperaban 16 páginas HTML y se encontraron ${htmlFiles.length}.`);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|#|mailto:)/.test(reference)) continue;
    const clean = reference.split("?")[0].split("#")[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(file), clean);
    const resolved = fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, "index.html") : target;
    if (!fs.existsSync(resolved)) errors.push(`${file}: referencia inexistente ${reference}.`);
  }
}

const imageRoot = path.join(root, "03_IMAGENES");
const imageData = JSON.parse(fs.readFileSync(path.join(imageRoot, "imagenes.json"), "utf8"));
const listedImages = new Set(imageData.flatMap((item) => [item.archivo_original, item.archivo_recortado, item.archivo_web, item.versiones_adicionales].filter(Boolean)));
const physicalImages = [];
function walkImages(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(file);
    else if (/\.(?:jpe?g|png|webp)$/i.test(entry.name)) physicalImages.push(path.relative(imageRoot, file));
  }
}
walkImages(imageRoot);
for (const image of physicalImages) if (!listedImages.has(image)) errors.push(`Imagen sin inventariar: ${image}.`);
for (const image of listedImages) if (!fs.existsSync(path.join(imageRoot, image))) errors.push(`Imagen inventariada inexistente: ${image}.`);

console.log(`Módulos inspeccionados: ${moduleFiles.length}/${expected}`);
console.log(`Páginas HTML inspeccionadas: ${htmlFiles.length}/16`);
console.log(`Imágenes inventariadas: ${listedImages.size}/${physicalImages.length}`);
console.log(`Errores: ${errors.length}`);
console.log(`Advertencias editoriales: ${warnings.length}`);
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}
if (warnings.length) console.log("Los módulos no publicados permanecen correctamente identificados como borradores.");
