#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { parts } = require("./datos-curso");
const root = path.resolve(__dirname, "..");
const docs = path.join(root, "docs");
const content = path.join(root, "02_CONTENIDOS", "parte-01-la-gota-que-lo-empieza-todo");
const pad = (v) => String(v).padStart(2, "0");
const esc = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function parse(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = Object.fromEntries(match[1].split("\n").map((line) => {
    const at = line.indexOf(":");
    return [line.slice(0, at).trim(), line.slice(at + 1).trim().replace(/^"|"$/g, "")];
  }));
  return { meta, body: text.slice(match[0].length) };
}

function inline(value) {
  return esc(value)
    .replace(/\*\*([^*]+)\*\*\{def=&quot;(.+?)&quot;\}/g, '<button class="concept-term" type="button" data-definition="$2">$1</button>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function quiz(lines, id) {
  const questions = lines.join("\n").split(/^###\s+/m).slice(1).map((chunk) => {
    const rows = chunk.trim().split("\n");
    const title = rows.shift();
    const options = rows.filter((r) => /^- \[[ x]\]/.test(r)).map((r) => ({ correct: r.startsWith("- [x]"), text: r.replace(/^- \[[ x]\]\s*/, "") }));
    const feedback = rows.find((r) => r.startsWith("> Devolución:"))?.replace("> Devolución:", "").trim() || "Revisá la explicación y probá otra vez.";
    return { title, options, feedback };
  });
  return `<form class="module-quiz" data-module-quiz="${id}"><p class="section-number">Comprobación</p><h2>Recuperá las pistas</h2>${questions.map((q, qi) => `<fieldset data-answer="${q.options.findIndex((o) => o.correct)}" data-feedback="${esc(q.feedback)}"><legend>${inline(q.title)}</legend>${q.options.map((o, oi) => `<label><input type="radio" name="q${qi}" value="${oi}"> ${inline(o.text)}</label>`).join("")}<p class="question-feedback" aria-live="polite"></p></fieldset>`).join("")}<button class="primary-button" type="submit">Comprobar respuestas</button><div class="quiz-result" role="status" tabindex="-1"></div></form>`;
}

const classes = { story: "story-opening", activity: "activity-card", "visual-prompt": "visual-prompt", bridge: "story-bridge", "property-grid": "feature-grid", "function-grid": "feature-grid", "plant-map": "plant-map", "safety-grid": "safety-grid", "label-check": "label-check" };
function markdown(text, id) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith("::: ")) {
      const kind = line.slice(4).trim(); const inner = []; i++;
      while (i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i++]);
      i++;
      out.push(kind === "quiz" ? quiz(inner, id) : `<section class="${classes[kind] || "content-callout"}">${markdown(inner.join("\n"), id)}</section>`);
      continue;
    }
    const image = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (image) {
      let caption = ""; let j = i + 1; while (j < lines.length && !lines[j].trim()) j++;
      if (/^\*.*\*$/.test(lines[j]?.trim() || "")) { caption = lines[j].trim().slice(1, -1); i = j; }
      out.push(`<figure class="source-figure"><img src="../../assets/images/${esc(path.basename(image[2]))}" alt="${esc(image[1])}" loading="lazy"><figcaption>${inline(caption)}</figcaption></figure>`); i++; continue;
    }
    if (/^#\s+/.test(line)) { i++; continue; }
    if (/^##\s+/.test(line)) { out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`); i++; continue; }
    if (/^###\s+/.test(line)) { out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`); i++; continue; }
    if (/^>\s+/.test(line)) { out.push(`<p class="module-objective">${inline(line.replace(/^>\s+/, ""))}</p>`); i++; continue; }
    if (/^-\s+/.test(line)) { const items=[]; while (i < lines.length && /^-\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^-\s+/, "")); out.push(`<ul>${items.map((v)=>`<li>${inline(v)}</li>`).join("")}</ul>`); continue; }
    if (/^\d+\.\s+/.test(line)) { const items=[]; while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+\.\s+/, "")); out.push(`<ol>${items.map((v)=>`<li>${inline(v)}</li>`).join("")}</ol>`); continue; }
    const p=[line]; i++; while (i < lines.length && lines[i].trim() && !/^(?:#|>|-|\d+\.|:::|!\[)/.test(lines[i].trim())) p.push(lines[i++].trim());
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return out.join("\n");
}

function shell({ title, description, body, pageClass = "", script = "", depth = 0 }) {
  const prefix = depth ? "../../" : "";
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="${esc(description)}"><title>${esc(title)} | Curso Esencias Naturales</title><link rel="stylesheet" href="${prefix}styles.css?v=v2-2">${script ? `<script src="${prefix}${script}?v=v2-2" defer></script>` : ""}</head><body class="${pageClass}"><a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><a class="brand" href="${prefix}index.html"><span class="brand-mark" aria-hidden="true">E</span><span>Curso Esencias Naturales</span></a><span class="release-note">Parte 1 disponible</span></header><main id="contenido">${body}</main><footer><span>Curso Esencias Naturales · De la planta a la esencia</span><a href="${prefix}index.html">Índice general</a></footer><dialog class="definition-dialog"><button type="button" aria-label="Cerrar">×</button><h2></h2><p></p></dialog></body></html>`;
}

function moduleLink(number) { return `../../modulos/modulo-${pad(number)}/index.html`; }
const totalModules = parts.flatMap((p) => p.modules).length;
const totalMinutes = parts.reduce((sum, p) => sum + p.minutes, 0);

const partCards = parts.map((part) => `<article class="part-card ${part.published ? "available" : "locked"}"><div class="part-card-number">${pad(part.id)}</div><div><div class="part-card-top"><span>${part.minutes} min</span><span class="status-pill">${part.published ? "Disponible" : "Próximamente"}</span></div><h2>${esc(part.title)}</h2><p class="part-question">${esc(part.question)}</p><p>${esc(part.achievement)}</p><div class="theme-meta"><span>${part.modules.length} módulos</span>${part.published ? `<span data-part-progress>0/${part.modules.length} completados</span>` : ""}</div><a href="partes/parte-${pad(part.id)}/index.html">${part.published ? "Entrar a la parte" : "Ver el temario"} <span aria-hidden="true">→</span></a></div></article>`).join("");
const indexBody = `<section class="hero hub-hero"><div class="eyebrow">De la planta a la esencia</div><h1>Curso <em>Esencias Naturales</em></h1><p class="hero-intro">La travesía empieza con una gota y retrocede hasta la planta que la produjo. Después avanza por el cultivo, la extracción, la mezcla cosmética y la posibilidad de transformar conocimiento en un proyecto responsable.</p><div class="course-meta"><span>6 partes</span><span>${totalModules} módulos</span><span>${Math.floor(totalMinutes/60)} h ${totalMinutes%60} min</span></div><a class="primary-button button-link" href="partes/parte-01/index.html">Comenzar por la gota</a></section><section class="route-intro"><p class="section-number">El recorrido</p><h2>Seis preguntas, una sola historia</h2><p>Cada parte responde una pregunta y deja preparada la siguiente. La Parte 1 ya está completa; las demás muestran el rumbo antes de ser desarrolladas.</p></section><section class="parts-list">${partCards}</section>`;
fs.writeFileSync(path.join(docs, "index.html"), shell({ title: "Inicio", description: "Curso narrativo sobre aceites esenciales y cosmética natural.", body: indexBody, pageClass: "course-hub", script: "hub.js" }));

for (const part of parts) {
  const cards = part.modules.map(([number, title, minutes], index) => `<li class="module-card ${part.published ? "available" : "locked"}"><span class="module-index">${pad(index + 1)}</span><div><small>${minutes} minutos</small><h3>${esc(title)}</h3>${part.published ? `<span data-module-status="p01-m${pad(index + 1)}">Pendiente</span>` : `<span>En preparación</span>`}</div>${part.published ? `<a aria-label="Abrir ${esc(title)}" href="${moduleLink(number)}">→</a>` : ""}</li>`).join("");
  const body = `<nav class="breadcrumb"><a href="../../index.html">Índice</a><span>/</span><span>Parte ${part.id}</span></nav><section class="hero part-hero"><div class="eyebrow">Parte ${pad(part.id)} · ${part.minutes} minutos</div><h1>${esc(part.title)}</h1><p class="hero-intro">${esc(part.question)}</p><div class="part-achievement"><span>Al terminar</span><strong>${esc(part.achievement)}</strong></div></section><section class="module-preview"><p class="section-number">${part.modules.length} estaciones</p><h2>${part.published ? "Seguí la historia, módulo a módulo" : "El temario ya está trazado"}</h2><ol>${cards}</ol>${part.published ? `<a class="primary-button button-link" href="${moduleLink(1)}">Abrir el primer módulo</a>` : `<p class="coming-note">Esta parte se desarrollará respetando el nuevo guion.</p>`}</section>${part.published ? `<aside class="closing-teaser"><p class="section-number">Cierre integrador</p><h2>La historia de un aceite</h2><p>Al completar los cuatro módulos vas a construir una ficha que conecte origen, función, propiedades y precauciones.</p><a href="cierre.html">Ver la actividad final →</a></aside>` : ""}`;
  const dir = path.join(docs, "partes", `parte-${pad(part.id)}`); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shell({ title: `Parte ${part.id} · ${part.title}`, description: part.question, body, pageClass: "part-page", script: part.published ? "course-page.js" : "", depth: 2 }));
}

const moduleFiles = [1,2,3,4].map((n) => parse(path.join(content, `modulo-${pad(n)}.md`)));
for (let i = 0; i < moduleFiles.length; i++) {
  const { meta, body } = moduleFiles[i]; const number = i + 1;
  const nav = `<nav class="module-navigation">${number > 1 ? `<a href="../modulo-${pad(number - 1)}/index.html">← Módulo ${number - 1}</a>` : `<a href="../../partes/parte-01/index.html">← Presentación</a>`}<a href="${number < 4 ? `../modulo-${pad(number + 1)}/index.html` : "../../partes/parte-01/cierre.html"}">${number < 4 ? `Módulo ${number + 1}` : "Cierre integrador"} →</a></nav>`;
  const pageBody = `<nav class="breadcrumb"><a href="../../index.html">Índice</a><span>/</span><a href="../../partes/parte-01/index.html">Parte 1</a><span>/</span><span>Módulo ${number}</span></nav><article class="lesson" data-module="${meta.id}"><header class="lesson-hero"><div><p class="eyebrow">Módulo ${pad(number)} · ${meta.duracion} minutos</p><h1>${esc(meta.titulo)}</h1></div><div class="lesson-marker" aria-hidden="true">${pad(number)}</div></header><div class="reading-progress"><span></span></div><div class="lesson-content">${markdown(body, meta.id)}<section class="module-complete"><h2>Guardá esta estación</h2><p>Cuando puedas explicar la idea central con tus propias palabras, marcá el módulo como completado.</p><button class="primary-button complete-module" type="button">Marcar como completado</button></section>${nav}</div></article>`;
  const dir = path.join(docs, "modulos", `modulo-${pad(number)}`); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shell({ title: meta.titulo, description: `Módulo ${number} de la Parte 1.`, body: pageBody, pageClass: "lesson-page", script: "course-page.js", depth: 2 }));
}

const closeBody = `<nav class="breadcrumb"><a href="../../index.html">Índice</a><span>/</span><a href="index.html">Parte 1</a><span>/</span><span>Cierre</span></nav><section class="hero closing-hero"><div class="eyebrow">Cierre integrador · Parte 1</div><h1>La historia de un aceite</h1><p class="hero-intro">Elegí un aceite y reconstruí su camino desde la planta hasta el frasco. La ficha se guarda en este dispositivo mientras la completás.</p></section><form class="oil-story" data-oil-story><label>Nombre común<input name="common" autocomplete="off"></label><label>Nombre botánico<input name="botanical" autocomplete="off" placeholder="Género especie"></label><label>Parte de la planta<select name="part"><option value="">Seleccionar</option><option>Flor</option><option>Hoja o parte aérea</option><option>Madera</option><option>Raíz</option><option>Resina</option><option>Cáscara</option><option>Otra</option></select></label><label>¿Qué función puede cumplir el aroma para la planta?<textarea name="function"></textarea></label><label>Dos propiedades materiales<textarea name="properties" placeholder="Por ejemplo: volátil…"></textarea></label><label>Dos precauciones<textarea name="precautions"></textarea></label><label>Una pregunta que todavía necesitás investigar<textarea name="question"></textarea></label><div class="form-actions"><button class="primary-button" type="submit">Guardar ficha</button><button class="text-button" type="button" data-print>Imprimir</button></div><p class="save-status" role="status"></p></form><nav class="module-navigation"><a href="../../modulos/modulo-04/index.html">← Volver al módulo 4</a><a href="../parte-02/index.html">Mirar la Parte 2 →</a></nav>`;
fs.writeFileSync(path.join(docs, "partes", "parte-01", "cierre.html"), shell({ title: "La historia de un aceite", description: "Actividad integradora de la Parte 1.", body: closeBody, pageClass: "closing-page", script: "course-page.js", depth: 2 }));

console.log("Sitio V2 construido: índice, 6 partes, 4 módulos y cierre integrador.");
