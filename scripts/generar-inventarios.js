#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const imageRoot = path.join(root, "03_IMAGENES");
const images = JSON.parse(fs.readFileSync(path.join(imageRoot, "imagenes.json"), "utf8"));
const headers = ["id","parte","tema","modulo","titulo","descripcion","pdf_origen","pagina_origen","tipo_visual","archivo_original","archivo_recortado","archivo_web","versiones_adicionales","texto_alternativo","epigrafe","consigna_observacion","estado","notas_revision","fecha_actualizacion"];
const cell = (value) => `"${String(value ?? "").replaceAll('"','""')}"`;
fs.writeFileSync(path.join(imageRoot,"inventario_imagenes.csv"), [headers,...images.map((item)=>headers.map((key)=>item[key]))].map((row)=>row.map(cell).join(",")).join("\n")+"\n");
const table = images.map((item)=>`| ${item.id} | ![${item.texto_alternativo}](${item.archivo_web}) | ${item.titulo} | P${item.parte} M${item.modulo} | ${item.estado} | [original](${item.archivo_original}) · [recorte](${item.archivo_recortado}) · [web](${item.archivo_web}) |`).join("\n");
fs.writeFileSync(path.join(imageRoot,"INVENTARIO_IMAGENES.md"),`# Inventario de imágenes\n\n| ID | Vista | Título | Ubicación | Estado | Archivos |\n|---|---|---|---|---|---|\n${table}\n\n## Estados admitidos\n\nCandidata · Seleccionada · En recorte · Lista para revisar · Aprobada · Publicada · Reemplazar · Retirada.\n`);
console.log(`Inventario actualizado: ${images.length} imágenes.`);
