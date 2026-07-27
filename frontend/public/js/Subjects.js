/* ── FETCH ─────────────────────────────────────────── */
const BASE_URL = "http://localhost:9090/api";
const fetchSubjects = async () => {
  const url = `http://localhost:9090/api/subjects`;
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
const subjects = await fetchSubjects();
const gradients = [
  ["#4f8ef7", "#7c5ef4"],
  ["#22d3a5", "#22d8e8"],
  ["#f59e3a", "#f05c7a"],
  ["#7c5ef4", "#f05c7a"],
  ["#4f8ef7", "#22d8e8"],
  ["#22d3a5", "#4f8ef7"],
];

/* ── RENDER SUBJECTS ─────────────────────────────────────────── */
function renderSubjects() {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    document.getElementById("subject-grid").innerHTML = `
      <h3 class="subject-card" style="text-align: center; color: #888;">
            Tidak ada data untuk ditampilkan.
      </h3>
    `;
    return;
  }
  document.getElementById("subject-grid").innerHTML = subjects
    .map((s, i) => {
      const [c1, c2] = gradients[i % gradients.length];
      return `<div class="subject-card">
      <div class="subject-icon" style="background:linear-gradient(135deg,${c1}12,${c2}22)">📖</div>
      <div class="subject-name">${s.subject_name}</div>
    </div>`;
    })
    .join("");
}

/* ── INIT ──────────────────────────────────────────── */
renderSubjects();
