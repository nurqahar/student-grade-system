/* ── FETCH ─────────────────────────────────────────── */
const BASE_URL = "http://localhost:9090/api";

const fetchLevel = async () => {
  const url = `${BASE_URL}/levels`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Res Status: ${res.status}`);
    }
    const responseArray = await res.json();
    return responseArray;
  } catch (error) {
    console.error(`Fetch Students Error!`, error.message);
  }
};
/* ── FETCH END ─────────────────────────────────────────── */

/* ── DATA ─────────────────────────────────────────── */
const levels = await fetchLevel();
const colors = [
  "#4f8ef7",
  "#7c5ef4",
  "#22d3a5",
  "#f59e3a",
  "#f05c7a",
  "#22d8e8",
];
const gradients = [
  ["#4f8ef7", "#7c5ef4"],
  ["#22d3a5", "#22d8e8"],
  ["#f59e3a", "#f05c7a"],
  ["#7c5ef4", "#f05c7a"],
  ["#4f8ef7", "#22d8e8"],
  ["#22d3a5", "#4f8ef7"],
];

/* ── RENDER LEVELS ──────────────────────────────────────────── */
function renderLevels() {
  document.getElementById("level-grid").innerHTML = levels
    .map(
      (l, i) => `
    <div class="level-card">
      <div class="level-num" style="background:${gradients[i]};color:${colors[i]}">${["X", "XI", "XII"][i]}</div>
      <div class="level-info">
        <div class="level-name">Kelas ${l.level_name}</div>
        <div class="level-meta">${l.desc}</div>
        <div style="display:flex;gap:16px;margin-top:8px">
          <span style="font-size:12px;color:var(--muted)">🏫 Jumlah kelas</span>
          <span style="font-size:12px;color:var(--muted)">🧑‍🎓 Jumlah siswa</span>
        </div>
      </div>
    </div>`,
    )
    .join("");
}

/* ── INIT ──────────────────────────────────────────── */
renderLevels();
