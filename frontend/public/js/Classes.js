/* ── FETCH ─────────────────────────────────────────── */
const BASE_URL = "http://localhost:9090/api";
const fetchClasses = async () => {
  const url = `${BASE_URL}/classes/viewDetail`;
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

const fetchStudents = async () => {
  const url = `${BASE_URL}/history_student/viewDetail`;
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

/* ── DATA ─────────────────────────────────────────── */
const classes = await fetchClasses();
const students = await fetchStudents();

/* ── RENDER CLASSES ──────────────────────────────────────────── */
function renderClasses() {
  document.getElementById("classes-tbody").innerHTML = classes
    .map((c, i) => {
      let totalStudent = students.filter((e) => {
        return (
          c.level_name + " " + c.class_name ===
          e.level_name + " " + e.class_name
        );
      });
      return `<tr>
      <td style="font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)">${i + 1}</td>
      <td style="font-weight:500">${c.level_name + " " + c.class_name}</td>
      <td style="font-size:12px;color:var(--muted)">${totalStudent[0].teacher_name + " " + totalStudent[0].teacher_title}</td>
      <td>${totalStudent.length}</td>
      <td><span class="pill pill-green">${totalStudent[0].status.toUpperCase()}</span></td>
    </tr>`;
    })
    .join("");
}

/* ── INIT ──────────────────────────────────────────── */
renderClasses();
