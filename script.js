const storageKey = "microcurso-semillas-progress-v1";
const completionIds = ["lesson-1", "lesson-2", "lesson-3", "lesson-4", "quiz"];

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
  const completed = completionIds.filter((id) => progress[id]).length;
  const percentage = Math.round((completed / completionIds.length) * 100);
  const label = document.querySelector("#progress-label");
  const bar = document.querySelector(".progress-track");

  label.textContent = `${percentage}% completado`;
  bar.setAttribute("aria-valuenow", String(percentage));
  document.querySelector("#progress-fill").style.width = `${percentage}%`;

  document.querySelectorAll("[data-complete]").forEach((button) => {
    const done = Boolean(progress[button.dataset.complete]);
    button.setAttribute("aria-pressed", String(done));
    button.textContent = done ? "Lección completada" : "Marcar lección como completada";
  });
}

document.querySelector("#start-course").addEventListener("click", () => {
  document.querySelector("#leccion-1").scrollIntoView();
  document.querySelector("#leccion-1 h2").setAttribute("tabindex", "-1");
  document.querySelector("#leccion-1 h2").focus({ preventScroll: true });
});

document.querySelectorAll("[data-complete]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.complete;
    progress[id] = !progress[id];
    saveProgress();
    updateProgressDisplay();
  });
});

document.querySelector("#quiz-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const fieldsets = [...event.currentTarget.querySelectorAll("fieldset")];
  let correct = 0;
  let unanswered = 0;

  fieldsets.forEach((fieldset) => {
    const selected = fieldset.querySelector("input:checked");
    const feedback = fieldset.querySelector(".question-feedback");
    const source = fieldset.dataset.source;

    feedback.classList.remove("correct", "incorrect");
    if (!selected) {
      unanswered += 1;
      feedback.textContent = "Seleccioná una respuesta.";
      feedback.classList.add("incorrect");
      return;
    }

    if (selected.value === fieldset.dataset.answer) {
      correct += 1;
      feedback.textContent = `Correcto. Respaldo: ${source}.`;
      feedback.classList.add("correct");
    } else {
      feedback.textContent = `Revisá la respuesta. Respaldo: ${source}.`;
      feedback.classList.add("incorrect");
    }
  });

  const result = document.querySelector("#quiz-result");
  if (unanswered > 0) {
    result.textContent = `Faltan ${unanswered} ${unanswered === 1 ? "respuesta" : "respuestas"}.`;
  } else {
    result.textContent = `Resultado: ${correct} de ${fieldsets.length} respuestas correctas.`;
    progress.quiz = true;
    saveProgress();
    updateProgressDisplay();
  }
  result.focus();
});

document.querySelector("#reset-progress").addEventListener("click", () => {
  progress = {};
  localStorage.removeItem(storageKey);
  document.querySelector("#quiz-form").reset();
  document.querySelectorAll(".question-feedback").forEach((item) => {
    item.textContent = "";
    item.classList.remove("correct", "incorrect");
  });
  document.querySelector("#quiz-result").textContent = "";
  updateProgressDisplay();
});

updateProgressDisplay();
