#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "docs", "temas", "semillas", "index.html"), "utf8");
const contentDir = path.join(root, "02_CONTENIDOS", "parte-01-conocer-la-planta", "tema-03-semillas");

function decode(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function toMarkdown(fragment) {
  return decode(fragment)
    .replace(/<button class="concept-term"[^>]*data-definition="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g, (_, definition, term) => `**${term.trim()}** _(definición: ${definition.trim()})_`)
    .replace(/<figure[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g, (_, source, alt, caption) => {
      const editorialSource = source.replace("../../assets/images/", "../../../03_IMAGENES/tema-03-semillas/03_web/");
      return `\n\n![${alt}](${editorialSource})\n\n*${caption.replace(/<[^>]+>/g, "").trim()}*\n\n`;
    })
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n\n### $1\n\n")
    .replace(/<legend[^>]*>([\s\S]*?)<\/legend>/g, "\n\n#### $1\n\n")
    .replace(/<summary[^>]*>([\s\S]*?)<\/summary>/g, "\n\n**$1**\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "\n- $1")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, "\n\n$1\n\n")
    .replace(/<br\s*\/?\s*>/g, "\n")
    .replace(/<input[^>]*>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*0\d\s*$/gm, "")
    .trim();
}

const starts = [...html.matchAll(/<article class="module" id="modulo-(\d)"/g)];
if (starts.length !== 4) throw new Error(`Se esperaban 4 artículos y se encontraron ${starts.length}.`);

for (let index = 0; index < starts.length; index += 1) {
  const start = starts[index].index;
  const end = index + 1 < starts.length ? starts[index + 1].index : html.indexOf('<section class="completion-panel"', start);
  const article = html.slice(start, end);
  const file = path.join(contentDir, `modulo-0${index + 1}.md`);
  const previous = fs.readFileSync(file, "utf8");
  const frontmatter = previous.match(/^---\n[\s\S]*?\n---/)[0];
  const title = (article.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1]?.replace(/<[^>]+>/g, "").trim() || `Módulo ${index + 1}`;
  const markdown = toMarkdown(article);
  fs.writeFileSync(file, `${frontmatter}\n\n# ${title}\n\n> Texto migrado desde la versión web publicada. Listo para revisión y actualización editorial.\n\n## Contenido publicado migrado\n\n${markdown}\n`, "utf8");
}

console.log("Demo migrado a cuatro Markdown editables.");
