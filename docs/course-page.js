const storageKey = "planta-esencia-progress-v2";
const storyKey = "planta-esencia-oil-story-v2";
const herbariumKey = "planta-esencia-herbarium-v2";
const cropCalendarKey = "planta-esencia-crop-calendar-v2";
const extractionPlanKey = "planta-esencia-extraction-plan-v2";
const blendPlanKey = "planta-esencia-blend-plan-v2";
let progress = {};
try { progress = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { progress = {}; }

const dialog = document.querySelector(".definition-dialog");
document.querySelectorAll(".concept-term").forEach((term) => term.addEventListener("click", () => {
  dialog.querySelector("h2").textContent = term.textContent;
  dialog.querySelector("p").textContent = term.dataset.definition;
  dialog.showModal();
}));
dialog?.querySelector("button")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

function save() { localStorage.setItem(storageKey, JSON.stringify(progress)); }
function refresh() {
  document.querySelectorAll("[data-module-status]").forEach((item) => {
    const done = Boolean(progress[item.dataset.moduleStatus]);
    item.textContent = done ? "Completado" : "Pendiente";
    item.classList.toggle("complete", done);
  });
  const lesson = document.querySelector("[data-module]");
  const button = document.querySelector(".complete-module");
  if (lesson && button) {
    const done = Boolean(progress[lesson.dataset.module]);
    button.textContent = done ? "Módulo completado ✓" : "Marcar como completado";
    button.classList.toggle("is-complete", done);
  }
}

document.querySelectorAll("[data-module-quiz]").forEach((form) => form.addEventListener("submit", (event) => {
  event.preventDefault(); let correct = 0; let missing = 0;
  const fields = [...form.querySelectorAll("fieldset")];
  fields.forEach((field) => {
    const chosen = field.querySelector("input:checked");
    const message = field.querySelector(".question-feedback");
    message.className = "question-feedback";
    if (!chosen) { missing++; message.textContent = "Elegí una respuesta."; message.classList.add("incorrect"); }
    else if (chosen.value === field.dataset.answer) { correct++; message.textContent = field.dataset.feedback; message.classList.add("correct"); }
    else { message.textContent = "Todavía no. Volvé a la idea central y probá otra vez."; message.classList.add("incorrect"); }
  });
  const result = form.querySelector(".quiz-result");
  result.textContent = missing ? `Faltan ${missing} respuestas.` : correct === fields.length ? `¡Muy bien! ${correct} de ${fields.length} respuestas correctas.` : `${correct} de ${fields.length}. Podés volver a intentarlo.`;
  result.focus();
}));

document.querySelector(".complete-module")?.addEventListener("click", () => {
  const id = document.querySelector("[data-module]").dataset.module;
  progress[id] = !progress[id]; save(); refresh();
});

const bar = document.querySelector(".reading-progress span");
if (bar) addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 100}%`;
}, { passive: true });

const story = document.querySelector("[data-oil-story]");
if (story) {
  try { const saved = JSON.parse(localStorage.getItem(storyKey)) || {}; Object.entries(saved).forEach(([name, value]) => { if (story.elements[name]) story.elements[name].value = value; }); } catch {}
  story.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(storyKey, JSON.stringify(Object.fromEntries(new FormData(story))));
    story.querySelector(".save-status").textContent = "Ficha guardada en este dispositivo.";
  });
  story.querySelector("[data-print]")?.addEventListener("click", () => print());
}

const herbarium = document.querySelector("[data-herbarium-record]");
if (herbarium) {
  try { const saved = JSON.parse(localStorage.getItem(herbariumKey)) || {}; Object.entries(saved).forEach(([name, value]) => { if (herbarium.elements[name]) herbarium.elements[name].value = value; }); } catch {}
  herbarium.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(herbariumKey, JSON.stringify(Object.fromEntries(new FormData(herbarium))));
    herbarium.querySelector(".save-status").textContent = "Las tres fichas quedaron guardadas en este dispositivo.";
  });
  herbarium.querySelector("[data-print]")?.addEventListener("click", () => print());
}

const cropCalendar = document.querySelector("[data-crop-calendar]");
if (cropCalendar) {
  try { const saved = JSON.parse(localStorage.getItem(cropCalendarKey)) || {}; Object.entries(saved).forEach(([name, value]) => { if (cropCalendar.elements[name]) cropCalendar.elements[name].value = value; }); } catch {}
  cropCalendar.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(cropCalendarKey, JSON.stringify(Object.fromEntries(new FormData(cropCalendar))));
    cropCalendar.querySelector(".save-status").textContent = "El calendario y el registro de secado quedaron guardados en este dispositivo.";
  });
  cropCalendar.querySelector("[data-print]")?.addEventListener("click", () => print());
}

const extractionPlan = document.querySelector("[data-extraction-plan]");
if (extractionPlan) {
  try { const saved = JSON.parse(localStorage.getItem(extractionPlanKey)) || {}; Object.entries(saved).forEach(([name, value]) => { if (extractionPlan.elements[name]) extractionPlan.elements[name].value = value; }); } catch {}
  const calculate = () => {
    const volume = Number(extractionPlan.elements["oil-volume"].value);
    const density = Number(extractionPlan.elements.density.value);
    const plantMass = Number(extractionPlan.elements["plant-mass"].value);
    if (volume > 0 && density > 0) {
      const oilMass = volume * density;
      extractionPlan.elements["oil-mass"].value = oilMass.toFixed(3);
      extractionPlan.elements.yield.value = plantMass > 0 ? (oilMass / plantMass * 100).toFixed(3) : "";
    }
  };
  ["oil-volume", "density", "plant-mass"].forEach((name) => extractionPlan.elements[name].addEventListener("input", calculate));
  extractionPlan.addEventListener("submit", (event) => {
    event.preventDefault(); calculate();
    localStorage.setItem(extractionPlanKey, JSON.stringify(Object.fromEntries(new FormData(extractionPlan))));
    extractionPlan.querySelector(".save-status").textContent = "El proceso de extracción quedó guardado en este dispositivo.";
  });
  extractionPlan.querySelector("[data-print]")?.addEventListener("click", () => print());
}

const blendPlan = document.querySelector("[data-blend-plan]");
if (blendPlan) {
  try { const saved = JSON.parse(localStorage.getItem(blendPlanKey)) || {}; Object.entries(saved).forEach(([name, value]) => { if (blendPlan.elements[name]) blendPlan.elements[name].value = value; }); } catch {}
  const totalDrops = () => {
    const total = [1,2,3].reduce((sum, number) => sum + Number(blendPlan.elements[`oil${number}-drops`].value || 0), 0);
    blendPlan.elements["total-drops"].value = total || "";
  };
  [1,2,3].forEach((number) => blendPlan.elements[`oil${number}-drops`].addEventListener("input", totalDrops));
  blendPlan.addEventListener("submit", (event) => {
    event.preventDefault(); totalDrops();
    localStorage.setItem(blendPlanKey, JSON.stringify(Object.fromEntries(new FormData(blendPlan))));
    blendPlan.querySelector(".save-status").textContent = "La mezcla quedó guardada en este dispositivo.";
  });
  blendPlan.querySelector("[data-print]")?.addEventListener("click", () => print());
}
refresh();
