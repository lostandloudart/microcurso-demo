let progress = {};
try { progress = JSON.parse(localStorage.getItem("planta-esencia-progress-v2")) || {}; } catch { progress = {}; }
const complete = ["p01-m01", "p01-m02", "p01-m03", "p01-m04"].filter((id) => progress[id]).length;
document.querySelectorAll("[data-part-progress]").forEach((node) => { node.textContent = `${complete}/4 completados`; });
