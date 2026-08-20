let progress = {};
try { progress = JSON.parse(localStorage.getItem("planta-esencia-progress-v2")) || {}; } catch { progress = {}; }
document.querySelectorAll("[data-part-progress]").forEach((node) => {
  const part = String(node.dataset.partProgress).padStart(2, "0");
  const total = Number(node.dataset.moduleCount);
  const complete = Array.from({ length: total }, (_, index) => `p${part}-m${String(index + 1).padStart(2, "0")}`).filter((id) => progress[id]).length;
  node.textContent = `${complete}/${total} completados`;
});
