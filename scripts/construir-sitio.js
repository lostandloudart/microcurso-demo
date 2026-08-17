#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { parts, themes } = require("./datos-curso");

const root = path.resolve(__dirname, "..");
const docs = path.join(root, "docs");
const content = path.join(root, "02_CONTENIDOS");
const pad = (value) => String(value).padStart(2, "0");
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function parseFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Sin frontmatter: ${file}`);
  return Object.fromEntries(match[1].split("\n").map((line) => {
    const separator = line.indexOf(":");
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, "");
    return [key, value];
  }));
}

function contentDir(theme) {
  const part = parts.find((item) => item.id === theme.part);
  return path.join(content, `parte-${pad(part.id)}-${part.slug}`, `tema-${pad(theme.id)}-${theme.slug}`);
}

function themeView(theme) {
  const themeMeta = parseFrontmatter(path.join(contentDir(theme), "tema.md"));
  const modules = theme.modules.map((_, index) => parseFrontmatter(path.join(contentDir(theme), `modulo-${pad(index + 1)}.md`)));
  return { ...theme, ...themeMeta, number: theme.id, modules };
}

const views = themes.map(themeView);
const totalMinutes = views.flatMap((theme) => theme.modules).reduce((sum, module) => sum + Number(module.duracion), 0);

function shell({ title, description, depth = 0, body, script = "" }) {
  const prefix = depth ? "../../" : "";
  return `<!doctype html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <meta name="description" content="${escapeHtml(description)}" />\n  <title>${escapeHtml(title)} | De la planta a la esencia</title>\n  <link rel="stylesheet" href="${prefix}styles.css?v=curso-1" />${script ? `\n  <script src="${prefix}${script}" defer></script>` : ""}\n</head>\n<body class="course-hub">\n  <a class="skip-link" href="#contenido">Saltar al contenido</a>\n  <header class="site-header">\n    <a class="brand" href="${prefix}index.html" aria-label="Índice del curso"><span class="brand-mark" aria-hidden="true">E</span><span>De la planta a la esencia</span></a>\n    <span class="release-note">Curso en desarrollo</span>\n  </header>\n  <main id="contenido">${body}</main>\n  <footer><span>Curso de cosmética botánica y aceites esenciales</span><a href="${prefix}index.html">Volver al índice</a></footer>\n</body>\n</html>\n`;
}

const partSections = parts.map((part) => {
  const cards = views.filter((theme) => Number(theme.part) === part.id).map((theme) => {
    const duration = theme.modules.reduce((sum, module) => sum + Number(module.duracion), 0);
    const available = theme.estado === "publicado";
    return `<article class="theme-card${available ? " available" : ""}">\n` +
      `  <div class="theme-card-top"><span>Tema ${pad(theme.number)}</span><span class="status-pill">${available ? "Disponible" : "Próximamente"}</span></div>\n` +
      `  <h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.promise)}</p>\n` +
      `  <div class="theme-meta"><span>${theme.modules.length} módulos</span><span>${duration} min</span>${available ? `<span data-theme-progress="t${pad(theme.number)}" data-module-count="${theme.modules.length}">0/${theme.modules.length} completados</span>` : ""}</div>\n` +
      `  <a href="temas/${theme.slug}/index.html">${available ? "Comenzar el tema" : "Ver el recorrido"} <span aria-hidden="true">→</span></a>\n` +
      `</article>`;
  }).join("\n");
  return `<section class="part-section" aria-labelledby="parte-${part.id}"><div class="part-heading"><span>Parte ${part.id}</span><h2 id="parte-${part.id}">${escapeHtml(part.title)}</h2></div><div class="theme-grid">${cards}</div></section>`;
}).join("\n");

const indexBody = `\n<section class="hero hub-hero"><div class="eyebrow">Un recorrido de la planta al emprendimiento</div><h1>De la planta a la esencia</h1><p class="hero-intro">Todo comienza mucho antes del frasco. Primero hay una planta que debemos aprender a mirar; después llegan el cultivo, la transformación y el desafío de convertir el aroma en una experiencia cosmética responsable.</p><div class="course-meta"><span>${parts.length} partes</span><span>${views.length} temas</span><span>${views.flatMap((theme) => theme.modules).length} módulos</span><span>${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60} min</span></div><a class="primary-button button-link" href="#recorrido">Explorar el recorrido</a></section>\n` +
  `<section class="learning-goal" id="recorrido"><div><p class="section-number">El mapa completo</p><h2>Una historia en seis movimientos</h2></div><p>Cada parte responde una pregunta y deja abierta la siguiente. Los temas se publicarán progresivamente; el curso sobre semillas ya está disponible como primera experiencia completa.</p></section>\n${partSections}\n` +
  `<aside class="safety-note"><p class="section-number">Un límite importante</p><h2>Aprender no equivale a habilitarse para fabricar o vender</h2><p>El recorrido tiene finalidad educativa y cosmética. No reemplaza formación profesional, evaluación de seguridad, habilitaciones ni registro de productos.</p></aside>`;

fs.writeFileSync(path.join(docs, "index.html"), shell({ title: "Inicio", description: "Curso narrativo de cosmética natural ligada a aceites esenciales.", body: indexBody, script: "hub.js?v=curso-1" }), "utf8");

for (let index = 0; index < views.length; index += 1) {
  const theme = views[index];
  if (theme.estado === "publicado") continue;
  const duration = theme.modules.reduce((sum, module) => sum + Number(module.duracion), 0);
  const moduleCards = theme.modules.map((module, moduleIndex) => `<li><span>${pad(moduleIndex + 1)}</span><div><strong>${escapeHtml(module.titulo)}</strong><small>${module.duracion} minutos · ${escapeHtml(module.estado)}</small></div></li>`).join("\n");
  const previous = views[index - 1];
  const next = views[index + 1];
  const nav = `<nav class="theme-navigation" aria-label="Navegación entre temas">${previous ? `<a href="../${previous.slug}/index.html">← ${escapeHtml(previous.title)}</a>` : "<span></span>"}${next ? `<a href="../${next.slug}/index.html">${escapeHtml(next.title)} →</a>` : ""}</nav>`;
  const body = `<nav class="breadcrumb" aria-label="Migas de pan"><a href="../../index.html">Índice</a><span aria-hidden="true">/</span><span>Parte ${theme.part}</span></nav>` +
    `<section class="hero theme-hero"><div class="eyebrow">Tema ${pad(theme.number)} · En preparación</div><h1>${escapeHtml(theme.title)}</h1><p class="hero-intro">${escapeHtml(theme.promise)}</p><div class="course-meta"><span>${theme.modules.length} módulos</span><span>${duration} minutos</span><span>Contenido estructurado</span></div></section>` +
    `<section class="learning-goal"><div><p class="section-number">Próxima entrega</p><h2>El recorrido ya está definido</h2></div><p>Los módulos están preparados para recibir el desarrollo narrativo, las definiciones, las imágenes tratadas y sus cuestionarios. Esta página se activará cuando complete las revisiones editorial, visual y de seguridad.</p></section>` +
    `<section class="module-preview" aria-labelledby="modulos"><h2 id="modulos">Módulos del tema</h2><ol>${moduleCards}</ol></section>${nav}`;
  const out = path.join(docs, "temas", theme.slug);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "index.html"), shell({ title: theme.title, description: theme.promise, depth: 2, body }), "utf8");
}

console.log(`Sitio construido: índice y ${views.length} páginas temáticas.`);
