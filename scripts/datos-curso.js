"use strict";

const parts = [
  { id: 1, slug: "conocer-la-planta", title: "Conocer la materia viva" },
  { id: 2, slug: "cultivar-el-aroma", title: "Cultivar el aroma" },
  { id: 3, slug: "transformar-la-planta", title: "Transformar la planta" },
  { id: 4, slug: "comprender-la-esencia", title: "Comprender la esencia" },
  { id: 5, slug: "del-aroma-a-la-cosmetica", title: "Del aroma a la cosmética" },
  { id: 6, slug: "emprendimiento", title: "Del cultivo al emprendimiento" }
];

const themes = [
  {
    id: 1, part: 1, slug: "introduccion", title: "El comienzo del viaje",
    source: "01_introduccion.pdf", pages: 12,
    promise: "Descubrir qué son los aceites esenciales y por qué el recorrido comienza mucho antes del frasco.",
    modules: [["El aroma que abre la puerta", 20], ["Qué es un aceite esencial", 25]]
  },
  {
    id: 2, part: 1, slug: "anatomia-vegetal", title: "Anatomía vegetal",
    source: "02_anatomia_vegetal.pdf", pages: 48,
    promise: "Aprender a leer la planta como un sistema de estructuras relacionadas.",
    modules: [["Leer una hoja", 25], ["Raíces y sostén", 25], ["Tallos que transportan", 25], ["Flores y frutos", 30]]
  },
  {
    id: 3, part: 1, slug: "semillas", title: "El secreto de las semillas",
    source: "03_semillas.pdf", pages: 32, published: true,
    promise: "Seguir la vida vegetal desde lo que una semilla guarda hasta el momento en que despierta.",
    modules: [["El secreto interior", 25], ["La bifurcación", 25], ["Bajo el fruto", 25], ["El despertar", 30]]
  },
  {
    id: 4, part: 1, slug: "herbario", title: "El herbario",
    source: "04_herbario.pdf", pages: 60,
    promise: "Transformar la observación botánica en un registro que pueda conservarse y compararse.",
    modules: [["Un archivo vivo", 25], ["Recolectar sin perder información", 25], ["Prensar, identificar y conservar", 30], ["Propiedades que anticipan la extracción", 25]]
  },
  {
    id: 5, part: 2, slug: "labores-culturales", title: "Labores culturales",
    source: "05_labores_culturales.pdf", pages: 42,
    promise: "Comprender las decisiones de cultivo que acompañan a la planta hasta la cosecha.",
    modules: [["Preparar el terreno", 25], ["Agua y nutrición", 25], ["Competencia y protección", 30], ["Cosecha y secado", 25]]
  },
  {
    id: 6, part: 2, slug: "tecnicas-poda", title: "Técnicas de poda",
    source: "06_tecnicas_poda.pdf", pages: 53,
    promise: "Leer cada corte como una intervención que modifica el crecimiento de la planta.",
    modules: [["Por qué podar", 20], ["Herramientas y cortes", 25], ["Ciclo y mantenimiento", 25]]
  },
  {
    id: 7, part: 3, slug: "seguridad-laboratorio", title: "Higiene y seguridad",
    source: "07_seguridad_laboratorio.pdf", pages: 4,
    promise: "Convertir la seguridad en una rutina previa a cualquier transformación.",
    modules: [["Antes de entrar al laboratorio", 20], ["Rutinas que protegen", 20]]
  },
  {
    id: 8, part: 3, slug: "tecnicas-separacion", title: "Técnicas de separación",
    source: "08_tecnicas_separacion.pdf", pages: 35,
    promise: "Reconocer las propiedades que permiten separar los componentes de una mezcla.",
    modules: [["Materia y mezclas", 25], ["Tamaño y densidad", 25], ["Cambios de estado", 25], ["Destilación y cromatografía", 25]]
  },
  {
    id: 9, part: 3, slug: "extraccion", title: "Extracción de aceites esenciales",
    source: "09_extraccion_aceites.pdf", pages: 35,
    promise: "Acompañar al aroma desde el tejido vegetal hasta su separación.",
    modules: [["El viaje de la destilación", 25], ["La fuerza del vapor", 25], ["Variantes de destilación", 30], ["Otros métodos y filtrado", 25]]
  },
  {
    id: 10, part: 4, slug: "origen-aceites", title: "Origen y naturaleza de los aceites",
    source: "10_origen_aceites.pdf", pages: 57,
    promise: "Entender dónde se forman las esencias y qué permite reconocer su identidad y calidad.",
    modules: [["Dónde se esconde la esencia", 25], ["Volatilidad y propiedades", 25], ["Calidad, rendimiento y nomenclatura", 30], ["La química del aroma", 25], ["La identidad cromatográfica", 25]]
  },
  {
    id: 11, part: 4, slug: "tipos-aceites", title: "Tipos de aceites esenciales",
    source: "11_tipos_aceites.pdf", pages: 62,
    promise: "Construir criterios simples para reconocer, elegir, diluir y conservar aceites.",
    modules: [["Familias y perfiles", 25], ["Criterios de selección", 25], ["Aceites vehiculares", 25], ["Dilución y conservación", 25], ["Uso cosmético responsable", 25]]
  },
  {
    id: 12, part: 5, slug: "aromaterapia-sensorial", title: "Aromaterapia sensorial",
    source: "12_aromaterapia_sensorial.pdf", pages: 93,
    promise: "Explorar la experiencia del aroma sin convertirla en una promesa médica.",
    modules: [["El olfato abre la historia", 25], ["Aroma, memoria y percepción", 25], ["Formas de uso y límites", 25], ["Preparaciones cosméticas y ambientales", 30]]
  },
  {
    id: 13, part: 5, slug: "arquitectura-fragancias", title: "Arquitectura de una fragancia",
    source: "13_arquitectura_fragancias.pdf", pages: 63,
    promise: "Seguir una fragancia en el tiempo y comprender cómo se organizan sus notas.",
    modules: [["Notas de salida", 20], ["Notas de corazón", 25], ["Notas de fondo", 25], ["Construir una experiencia aromática", 25]]
  },
  {
    id: 14, part: 5, slug: "tecnicas-masaje", title: "Técnicas de masaje",
    source: "14_tecnicas_masaje.pdf", pages: 17,
    promise: "Introducir el contacto cosmético mediante maniobras básicas y límites claros.",
    modules: [["Preparar el contacto", 20], ["Maniobras básicas y límites seguros", 25]]
  },
  {
    id: 15, part: 6, slug: "agroindustria-esenciera", title: "Agroindustria esenciera",
    source: "15_agroindustria_esenciera.pdf", pages: 30,
    promise: "Conectar el cultivo y la transformación con una mirada responsable de emprendimiento.",
    modules: [["De la planta a la cadena productiva", 25], ["Calidad, demanda y costos", 25], ["Emprender responsablemente", 30]]
  }
];

module.exports = { parts, themes };
