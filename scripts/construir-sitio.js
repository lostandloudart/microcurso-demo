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

function parseModule(file) {
  const text = fs.readFileSync(file, "utf8");
  const meta = parseFrontmatter(file);
  return { meta, body: text.replace(/^---\n[\s\S]*?\n---\n*/, "") };
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*\{def=&quot;(.+?)&quot;\}/g, '<button class="concept-term" type="button" data-definition="$2">$1</button>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderQuiz(lines, moduleId) {
  const text = lines.join("\n");
  const questions = text.split(/^###\s+/m).slice(1).map((chunk) => {
    const chunkLines = chunk.trim().split("\n");
    const question = chunkLines.shift().trim();
    const options = chunkLines.filter((line) => /^- \[[ x]\]/.test(line)).map((line) => ({
      correct: line.startsWith("- [x]"),
      text: line.replace(/^- \[[ x]\]\s*/, "")
    }));
    const feedback = chunkLines.find((line) => line.startsWith("> Devolución:"))?.replace("> Devolución:", "").trim() || "Correcto.";
    return { question, options, feedback };
  });
  const fieldsets = questions.map((question, questionIndex) => {
    const answerIndex = question.options.findIndex((option) => option.correct);
    const labels = question.options.map((option, optionIndex) => `<label><input type="radio" name="${moduleId}-q${questionIndex + 1}" value="${String.fromCharCode(97 + optionIndex)}" /> ${renderInline(option.text)}</label>`).join("");
    return `<fieldset data-answer="${String.fromCharCode(97 + answerIndex)}" data-feedback="${escapeHtml(question.feedback)}"><legend>${renderInline(question.question)}</legend>${labels}<p class="question-feedback" aria-live="polite"></p></fieldset>`;
  }).join("");
  return `<form class="module-quiz" data-module-quiz="${moduleId}"><h3>Antes de seguir: recuperá las pistas</h3>${fieldsets}<button class="primary-button" type="submit">Comprobar mis respuestas</button><div class="quiz-result" role="status" tabindex="-1"></div></form>`;
}

function renderMarkdown(markdown, moduleId) {
  const lines = markdown.split("\n");
  const output = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }
    if (line.startsWith("::: ")) {
      const type = line.slice(4).trim();
      const inner = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") inner.push(lines[index++]);
      index += 1;
      if (type === "quiz") output.push(renderQuiz(inner, moduleId));
      else {
        const directiveClasses = {
          visual: "visual-section",
          activity: "activity-card full-activity",
          story: "story-opening",
          process: "process-summary",
          "key-ideas": "key-ideas"
        };
        const tag = ["story", "process"].includes(type) ? "section" : "aside";
        output.push(`<${tag} class="${directiveClasses[type] || "content-callout"}">${renderMarkdown(inner.join("\n"), moduleId)}</${tag}>`);
      }
      continue;
    }
    if (/^!\[/.test(line)) {
      const image = line.match(/^!\[(.*)\]\((.*)\)$/);
      let caption = "";
      let lookahead = index + 1;
      while (lookahead < lines.length && !lines[lookahead].trim()) lookahead += 1;
      if (/^\*.*\*$/.test(lines[lookahead]?.trim() || "")) {
        caption = lines[lookahead].trim().slice(1, -1);
        index = lookahead;
      }
      const source = `../../assets/images/${path.basename(image[2])}`;
      const tall = source.includes("frasco-aceite") ? " tall-figure" : " wide-figure";
      output.push(`<figure class="source-figure${tall}"><img src="${source}" alt="${escapeHtml(image[1])}" loading="lazy" /><figcaption>${renderInline(caption)}</figcaption></figure>`);
      index += 1;
      continue;
    }
    if (/^##\s+/.test(line)) { output.push(`<h3>${renderInline(line.replace(/^##\s+/, ""))}</h3>`); index += 1; continue; }
    if (/^###\s+/.test(line)) { output.push(`<h3>${renderInline(line.replace(/^###\s+/, ""))}</h3>`); index += 1; continue; }
    if (/^>\s+/.test(line)) { output.push(`<blockquote>${renderInline(line.replace(/^>\s+/, ""))}</blockquote>`); index += 1; continue; }
    if (/^-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^-\s+/, ""));
      output.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+\.\s+/, ""));
      output.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next) { index += 1; break; }
      if (/^(?:##|###|:::|>|-|\d+\.|!\[)/.test(next)) break;
      paragraph.push(next);
      index += 1;
    }
    output.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }
  return output.join("\n");
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

function renderPublishedTheme(theme) {
  const rawTheme = themes.find((item) => item.id === theme.number);
  const modules = rawTheme.modules.map((_, index) => parseModule(path.join(contentDir(rawTheme), `modulo-${pad(index + 1)}.md`)));
  const duration = modules.reduce((sum, module) => sum + Number(module.meta.duracion), 0);
  const moduleNav = modules.map((module, index) => `<a href="#${module.meta.id}"><span>${pad(index + 1)}</span><strong>${escapeHtml(module.meta.titulo)}</strong><small>${escapeHtml(module.meta.duracion)} minutos</small></a>`).join("");
  const articles = modules.map((module, index) => {
    const objective = module.body.match(/^>\s+(.+)$/m)?.[1] || "";
    const cleaned = module.body.replace(/^#\s+.+\n+/, "").replace(/^>\s+.+\n+/, "");
    const timePlan = String(module.meta.tiempos || "").split("|").map((item) => {
      const match = item.match(/^(\d+ min)\s+(.+)$/);
      return match ? `<span><strong>${match[1]}</strong> ${escapeHtml(match[2])}</span>` : "";
    }).join("");
    return `<article class="module" id="${module.meta.id}" data-module="${module.meta.id}"><header class="module-header"><div class="module-number" aria-hidden="true">${pad(index + 1)}</div><div><p class="section-number">Capítulo ${index + 1} · ${module.meta.duracion} minutos</p><h2>${escapeHtml(module.meta.titulo)}</h2><p class="chapter-question">${escapeHtml(module.meta.pregunta)}</p><p class="module-objective">${renderInline(objective)}</p></div></header><div class="time-plan">${timePlan}</div>${renderMarkdown(cleaned, module.meta.id)}</article>`;
  }).join("\n");
  const statusItems = modules.map((module, index) => `<span data-status="${module.meta.id}">Módulo ${index + 1} pendiente</span>`).join("");
  const body = `<nav class="breadcrumb" aria-label="Migas de pan"><a href="../../index.html">Índice</a><span aria-hidden="true">/</span><span>Parte 1</span></nav><section class="hero theme-hero"><div class="eyebrow">Tema ${pad(theme.number)} · ${duration} minutos</div><h1>${escapeHtml(theme.title)}</h1><p class="hero-intro">Un frasco concentra un aroma, pero también una historia. En este comienzo vamos a recorrerla hacia atrás y descubrir qué propiedades hacen único a un aceite esencial.</p><div class="course-meta"><span>${modules.length} módulos</span><span>${duration} minutos</span><span>2 imágenes</span><span>6 preguntas</span></div><button class="primary-button" id="start-course" type="button">Abrir la primera puerta</button></section><section class="learning-goal"><div><p class="section-number">La promesa del recorrido</p><h2>Mirar más allá del frasco</h2></div><p>${escapeHtml(theme.promise)}</p></section><p class="concept-hint"><span aria-hidden="true">+</span> Tocá los conceptos en <strong>negrita</strong> para ver una definición simple.</p><nav class="course-map" aria-label="Módulos del tema">${moduleNav}</nav>${articles}<section class="completion-panel" aria-labelledby="completion-title"><p class="section-number">Cierre del tema</p><h2 id="completion-title">La puerta quedó abierta</h2><p id="completion-message">Completaste 0 de ${modules.length} módulos.</p><div class="module-statuses">${statusItems}</div><p><a class="primary-button button-link light-button" href="../anatomia-vegetal/index.html">Continuar hacia anatomía vegetal →</a></p></section>`;
  return `<!doctype html>\n<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="description" content="Introducción narrativa a los aceites esenciales y su recorrido desde la planta." /><title>${escapeHtml(theme.title)} | De la planta a la esencia</title><link rel="stylesheet" href="../../styles.css?v=curso-3" /><script src="../../course-page.js?v=curso-3" defer></script></head><body><a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><a class="brand" href="../../index.html" aria-label="Volver al índice"><span class="brand-mark" aria-hidden="true">E</span><span>De la planta a la esencia</span></a><div class="header-progress"><span id="progress-label">0 de ${modules.length} módulos</span><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-labelledby="progress-label"><span id="progress-fill"></span></div></div></header><main id="contenido">${body}</main><footer><span>De la planta a la esencia · Tema ${pad(theme.number)}</span><button class="text-button" id="reset-progress" type="button">Reiniciar progreso</button></footer></body></html>`;
}

function shell({ title, description, depth = 0, body, script = "" }) {
  const prefix = depth ? "../../" : "";
  return `<!doctype html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <meta name="description" content="${escapeHtml(description)}" />\n  <title>${escapeHtml(title)} | De la planta a la esencia</title>\n  <link rel="stylesheet" href="${prefix}styles.css?v=curso-3" />${script ? `\n  <script src="${prefix}${script}" defer></script>` : ""}\n</head>\n<body class="course-hub">\n  <a class="skip-link" href="#contenido">Saltar al contenido</a>\n  <header class="site-header">\n    <a class="brand" href="${prefix}index.html" aria-label="Índice del curso"><span class="brand-mark" aria-hidden="true">E</span><span>De la planta a la esencia</span></a>\n    <span class="release-note">Curso en desarrollo</span>\n  </header>\n  <main id="contenido">${body}</main>\n  <footer><span>Curso de cosmética botánica y aceites esenciales</span><a href="${prefix}index.html">Volver al índice</a></footer>\n</body>\n</html>\n`;
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
  `<section class="learning-goal" id="recorrido"><div><p class="section-number">El mapa completo</p><h2>Una historia en seis movimientos</h2></div><p>Cada parte responde una pregunta y deja abierta la siguiente. Los temas se publicarán progresivamente; la introducción y el curso sobre semillas ya están disponibles.</p></section>\n${partSections}\n` +
  `<aside class="safety-note"><p class="section-number">Un límite importante</p><h2>Aprender no equivale a habilitarse para fabricar o vender</h2><p>El recorrido tiene finalidad educativa y cosmética. No reemplaza formación profesional, evaluación de seguridad, habilitaciones ni registro de productos.</p></aside>`;

fs.writeFileSync(path.join(docs, "index.html"), shell({ title: "Inicio", description: "Curso narrativo de cosmética natural ligada a aceites esenciales.", body: indexBody, script: "hub.js?v=curso-1" }), "utf8");

const introduction = views.find((theme) => theme.slug === "introduccion");
fs.mkdirSync(path.join(docs, "temas", "introduccion"), { recursive: true });
fs.writeFileSync(path.join(docs, "temas", "introduccion", "index.html"), renderPublishedTheme(introduction), "utf8");

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
