const storageKey = "planta-esencia-progress-v1";

let progress = {};
try {
  progress = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  progress = {};
}

document.querySelectorAll("[data-theme-progress]").forEach((element) => {
  const prefix = element.dataset.themeProgress;
  const total = Number(element.dataset.moduleCount);
  const complete = Object.keys(progress).filter((key) => key.startsWith(`${prefix}-`) && progress[key]).length;
  element.textContent = `${complete}/${total} completados`;
});
