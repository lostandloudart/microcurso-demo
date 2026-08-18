#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname,"..");
const errors=[]; const warnings=[];
const moduleDir=path.join(root,"02_CONTENIDOS","parte-01-la-gota-que-lo-empieza-todo");
const moduleFiles=[1,2,3,4].map((n)=>path.join(moduleDir,`modulo-0${n}.md`));
for (const file of moduleFiles) {
  if (!fs.existsSync(file)) { errors.push(`Falta ${file}`); continue; }
  const body=fs.readFileSync(file,"utf8"); const words=body.split(/\s+/).length;
  const duration=Number((body.match(/^duracion:\s*(\d+)/m)||[])[1]);
  if (duration<20||duration>30) errors.push(`${file}: duración fuera de 20–30 minutos.`);
  if (words<550) warnings.push(`${file}: revisar si la lectura y actividades alcanzan la duración indicada (${words} palabras).`);
  for (const token of ["::: story","::: activity","::: quiz","::: bridge","{def=","fuentes:"]) if (!body.includes(token)) errors.push(`${file}: falta ${token}.`);
}
const html=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name.endsWith(".html"))html.push(file);}}
walk(path.join(root,"docs"));
if(html.length!==12) errors.push(`Se esperaban 12 HTML y se encontraron ${html.length}.`);
for(const file of html){const source=fs.readFileSync(file,"utf8");for(const match of source.matchAll(/(?:href|src)="([^"]+)"/g)){const ref=match[1];if(/^(?:https?:|#|mailto:)/.test(ref))continue;const clean=ref.split("?")[0].split("#")[0];if(!clean)continue;let target=path.resolve(path.dirname(file),clean);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,"index.html");if(!fs.existsSync(target))errors.push(`${path.relative(root,file)}: enlace roto ${ref}`);}}
const json=JSON.parse(fs.readFileSync(path.join(root,"03_IMAGENES","imagenes.json"),"utf8"));
for(const item of json.filter((i)=>String(i.id).startsWith("p01-"))){for(const key of ["archivo_original","archivo_recortado","archivo_web"]){if(!fs.existsSync(path.join(root,"03_IMAGENES",item[key])))errors.push(`Falta imagen ${item[key]}`);}if(!item.texto_alternativo||!item.consigna_observacion)errors.push(`${item.id}: accesibilidad u observación incompleta.`);}
console.log(`Parte 1: ${moduleFiles.length} módulos; sitio: ${html.length} páginas; errores: ${errors.length}; advertencias: ${warnings.length}.`);
warnings.forEach((v)=>console.warn(`AVISO ${v}`));
errors.forEach((v)=>console.error(`ERROR ${v}`));
if(errors.length)process.exit(1);
