const storageKey = "planta-esencia-progress-v1";
const moduleElements = [...document.querySelectorAll("[data-module]")];
const moduleIds = moduleElements.map((module) => module.dataset.module);

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

let progress = loadProgress();
const conceptTerms = [...document.querySelectorAll(".concept-term")];

function closeConceptPopups(except = null) {
  conceptTerms.forEach((term) => {
    if (term === except) return;
    term.setAttribute("aria-expanded", "false");
    const popup = document.querySelector(`#${term.getAttribute("aria-controls")}`);
    if (popup) popup.hidden = true;
  });
}

conceptTerms.forEach((term, index) => {
  const wrapper = document.createElement("span");
  const popup = document.createElement("span");
  const popupId = `concept-definition-${index + 1}`;
  wrapper.className = "concept-wrap";
  popup.className = "concept-popup";
  popup.id = popupId;
  popup.setAttribute("role", "tooltip");
  popup.textContent = term.dataset.definition;
  popup.hidden = true;
  term.before(wrapper);
  wrapper.append(term, popup);
  term.setAttribute("aria-expanded", "false");
  term.setAttribute("aria-controls", popupId);
  term.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = term.getAttribute("aria-expanded") !== "true";
    closeConceptPopups(term);
    term.setAttribute("aria-expanded", String(willOpen));
    popup.hidden = !willOpen;
  });
});

document.addEventListener("click", () => closeConceptPopups());
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openTerm = document.querySelector('.concept-term[aria-expanded="true"]');
  closeConceptPopups();
  if (openTerm) openTerm.focus();
});

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function updateProgressDisplay() {
  const completed = moduleIds.filter((id) => progress[id]).length;
  const percentage = moduleIds.length ? Math.round((completed / moduleIds.length) * 100) : 0;
  const label = document.querySelector("#progress-label");
  const bar = document.querySelector(".progress-track");
  if (label) label.textContent = `${completed} de ${moduleIds.length} módulos`;
  if (bar) bar.setAttribute("aria-valuenow", String(percentage));
  const fill = document.querySelector("#progress-fill");
  if (fill) fill.style.width = `${percentage}%`;
  moduleElements.forEach((module, index) => {
    const complete = Boolean(progress[module.dataset.module]);
    module.dataset.complete = String(complete);
    const status = document.querySelector(`[data-status="${module.dataset.module}"]`);
    if (status) {
      status.textContent = complete ? `Módulo ${index + 1} completado` : `Módulo ${index + 1} pendiente`;
      status.classList.toggle("complete", complete);
    }
  });
  const message = document.querySelector("#completion-message");
  if (message) message.textContent = completed === moduleIds.length
    ? "Tema completo: ya podés continuar hacia la anatomía vegetal."
    : `Completaste ${completed} de ${moduleIds.length} módulos.`;
}

document.querySelector("#start-course")?.addEventListener("click", () => {
  const first = moduleElements[0];
  const heading = first?.querySelector("h2");
  first?.scrollIntoView();
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
});

document.querySelectorAll("[data-module-quiz]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fieldsets = [...form.querySelectorAll("fieldset")];
    let correct = 0;
    let unanswered = 0;
    fieldsets.forEach((fieldset) => {
      const selected = fieldset.querySelector("input:checked");
      const feedback = fieldset.querySelector(".question-feedback");
      feedback.classList.remove("correct", "incorrect");
      if (!selected) {
        unanswered += 1;
        feedback.textContent = "Seleccioná una respuesta.";
        feedback.classList.add("incorrect");
      } else if (selected.value === fieldset.dataset.answer) {
        correct += 1;
        feedback.textContent = fieldset.dataset.feedback;
        feedback.classList.add("correct");
      } else {
        feedback.textContent = "Revisá la explicación e intentá nuevamente.";
        feedback.classList.add("incorrect");
      }
    });
    const result = form.querySelector(".quiz-result");
    if (unanswered) result.textContent = `Faltan ${unanswered} ${unanswered === 1 ? "respuesta" : "respuestas"}.`;
    else if (correct === fieldsets.length) {
      result.textContent = `Módulo aprobado: ${correct} de ${fieldsets.length} respuestas correctas.`;
      progress[form.dataset.moduleQuiz] = true;
      saveProgress();
      updateProgressDisplay();
    } else result.textContent = `Resultado: ${correct} de ${fieldsets.length}. Podés intentarlo nuevamente.`;
    result.focus();
  });
});

document.querySelector("#reset-progress")?.addEventListener("click", () => {
  moduleIds.forEach((id) => { delete progress[id]; });
  saveProgress();
  document.querySelectorAll(".module-quiz").forEach((form) => form.reset());
  document.querySelectorAll(".question-feedback, .quiz-result").forEach((item) => { item.textContent = ""; });
  updateProgressDisplay();
});

updateProgressDisplay();
