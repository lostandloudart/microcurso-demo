const storageKey = "curso-semillas-progress-v2";
const moduleIds = ["module-1", "module-2", "module-3", "module-4"];

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
  const followingText = wrapper.nextSibling;
  if (followingText?.nodeType === Node.TEXT_NODE && /^[.,;:]/.test(followingText.textContent)) {
    wrapper.insertBefore(document.createTextNode(followingText.textContent[0]), popup);
    followingText.textContent = followingText.textContent.slice(1);
  }
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
  const percentage = Math.round((completed / moduleIds.length) * 100);
  const label = document.querySelector("#progress-label");
  const bar = document.querySelector(".progress-track");

  label.textContent = `${completed} de ${moduleIds.length} módulos`;
  bar.setAttribute("aria-valuenow", String(percentage));
  document.querySelector("#progress-fill").style.width = `${percentage}%`;

  moduleIds.forEach((id, index) => {
    const complete = Boolean(progress[id]);
    const module = document.querySelector(`[data-module="${id}"]`);
    const status = document.querySelector(`[data-status="${id}"]`);
    module.dataset.complete = String(complete);
    status.textContent = complete ? `Módulo ${index + 1} completado` : `Módulo ${index + 1} pendiente`;
    status.classList.toggle("complete", complete);
  });

  document.querySelector("#completion-message").textContent =
    completed === moduleIds.length
      ? "Historia completa: recorriste el camino desde la semilla en descanso hasta la reanudación del crecimiento."
      : `Completaste ${completed} de ${moduleIds.length} capítulos. La historia continúa en las comprobaciones pendientes.`;
}

document.querySelector("#start-course").addEventListener("click", () => {
  const heading = document.querySelector("#modulo-1 h2");
  document.querySelector("#modulo-1").scrollIntoView();
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
});

document.querySelectorAll("[data-module-quiz]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fieldsets = [...form.querySelectorAll("fieldset")];
    const moduleId = form.dataset.moduleQuiz;
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
        return;
      }

      if (selected.value === fieldset.dataset.answer) {
        correct += 1;
        feedback.textContent = "Correcto.";
        feedback.classList.add("correct");
      } else {
        feedback.textContent = "Revisá la respuesta e intentá nuevamente.";
        feedback.classList.add("incorrect");
      }
    });

    const result = form.querySelector(".quiz-result");
    if (unanswered) {
      result.textContent = `Faltan ${unanswered} ${unanswered === 1 ? "respuesta" : "respuestas"}.`;
    } else if (correct === fieldsets.length) {
      result.textContent = `Módulo aprobado: ${correct} de ${fieldsets.length} respuestas correctas.`;
      progress[moduleId] = true;
      saveProgress();
      updateProgressDisplay();
    } else {
      result.textContent = `Resultado: ${correct} de ${fieldsets.length}. Revisá tus respuestas e intentá nuevamente.`;
    }
    result.focus();
  });
});

document.querySelector("#reset-progress").addEventListener("click", () => {
  progress = {};
  localStorage.removeItem(storageKey);
  document.querySelectorAll(".module-quiz").forEach((form) => form.reset());
  document.querySelectorAll(".question-feedback, .quiz-result").forEach((item) => {
    item.textContent = "";
    item.classList.remove("correct", "incorrect");
  });
  updateProgressDisplay();
});

updateProgressDisplay();
