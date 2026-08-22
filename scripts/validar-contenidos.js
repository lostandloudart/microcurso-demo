#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname,"..");
const errors=[]; const warnings=[];
const moduleFiles=[
  ...[1,2,3,4].map((n)=>path.join(root,"02_CONTENIDOS","parte-01-la-gota-que-lo-empieza-todo",`modulo-${String(n).padStart(2,"0")}.md`)),
  ...[5,6,7,8].map((n)=>path.join(root,"02_CONTENIDOS","parte-02-aprender-a-leer-la-planta",`modulo-${String(n).padStart(2,"0")}.md`)),
  ...[9,10,11,12].map((n)=>path.join(root,"02_CONTENIDOS","parte-03-cultivar-y-cosechar-el-aroma",`modulo-${String(n).padStart(2,"0")}.md`)),
  ...[13,14,15,16,17,18,19].map((n)=>path.join(root,"02_CONTENIDOS","parte-04-del-vegetal-a-la-esencia",`modulo-${String(n).padStart(2,"0")}.md`))
];
for (const file of moduleFiles) {
  if (!fs.existsSync(file)) { errors.push(`Falta ${file}`); continue; }
  const body=fs.readFileSync(file,"utf8"); const words=body.split(/\s+/).length;
  const duration=Number((body.match(/^duracion:\s*(\d+)/m)||[])[1]);
  if (duration<20||duration>30) errors.push(`${file}: duración fuera de 20–30 minutos.`);
  if (words<550) warnings.push(`${file}: revisar si la lectura y actividades alcanzan la duración indicada (${words} palabras).`);
  for (const token of ["::: story","::: activity","::: quiz","::: bridge","{def=","fuentes:"]) if (!body.includes(token)) errors.push(`${file}: falta ${token}.`);
}
const html=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.isDirectory()&&entry.name==="temas")continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name.endsWith(".html"))html.push(file);}}
walk(path.join(root,"docs"));
if(html.length!==30) errors.push(`Se esperaban 30 HTML y se encontraron ${html.length}.`);
for(const file of html){const source=fs.readFileSync(file,"utf8");for(const match of source.matchAll(/(?:href|src)="([^"]+)"/g)){const ref=match[1];if(/^(?:https?:|#|mailto:)/.test(ref))continue;const clean=ref.split("?")[0].split("#")[0];if(!clean)continue;let target=path.resolve(path.dirname(file),clean);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,"index.html");if(!fs.existsSync(target))errors.push(`${path.relative(root,file)}: enlace roto ${ref}`);}}
const json=JSON.parse(fs.readFileSync(path.join(root,"03_IMAGENES","imagenes.json"),"utf8"));
for(const item of json.filter((i)=>/^p0[1234]-/.test(String(i.id)))){for(const key of ["archivo_original","archivo_recortado","archivo_web"]){if(!fs.existsSync(path.join(root,"03_IMAGENES",item[key])))errors.push(`Falta imagen ${item[key]}`);}if(!item.texto_alternativo||!item.consigna_observacion)errors.push(`${item.id}: accesibilidad u observación incompleta.`);}
console.log(`Partes 1 a 4: ${moduleFiles.length} módulos; sitio: ${html.length} páginas; errores: ${errors.length}; advertencias: ${warnings.length}.`);
warnings.forEach((v)=>console.warn(`AVISO ${v}`));
errors.forEach((v)=>console.error(`ERROR ${v}`));
if(errors.length)process.exit(1);
