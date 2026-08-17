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
        feedback.textContent = `Correcto. Respaldo: ${fieldset.dataset.source}.`;
        feedback.classList.add("correct");
      } else {
        feedback.textContent = `Revisá la respuesta. Respaldo: ${fieldset.dataset.source}.`;
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
      result.textContent = `Resultado: ${correct} de ${fieldsets.length}. Revisá las referencias e intentá nuevamente.`;
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
