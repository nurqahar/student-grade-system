/* ── FETCH ─────────────────────────────────────────── */
const BASE_URL = "http://localhost:9090/api";
const fetchAssessment = async () => {
  const url = `${BASE_URL}/assessment/getAllJoined`;
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

const fetchAssessmentStudent = async (id) => {
  const url = `${BASE_URL}/assessment/getByIdJoined/${id}`;
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
const gradients = [
  ["#4f8ef7", "#7c5ef4"],
  ["#22d3a5", "#22d8e8"],
  ["#f59e3a", "#f05c7a"],
  ["#7c5ef4", "#f05c7a"],
  ["#4f8ef7", "#22d8e8"],
  ["#22d3a5", "#4f8ef7"],
];
const assessments = await fetchAssessment();

const dataStudent = assessments.reduce((unique, current) => {
  const isExist = unique.some(
    (student) => student.student_nis === current.student_nis,
  );
  if (!isExist) {
    unique.push({
      student_id: current.student_id,
      student_nis: current.student_nis,
      student_nisn: current.student_nisn,
      student_name: current.student_name,
      class: current.level_name + " " + current.class_name,
      semester: current.semester,
      school_year: current.school_year,
      status: current.status,
      class_advisor:
        current.class_advisor_name + " " + current.class_advisor_title,
    });
  }
  return unique;
}, []);

const schoolYear = [...new Set(dataStudent.map((data) => data.school_year))];
const semester = [...new Set(dataStudent.map((data) => data.semester))].sort();

/* ── HELPERS ─────────────────────────────────────── */
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
const smap = {
  aktif: "pill-green",
  pindah: "pill-amber",
  keluar: "pill-red",
  lulus: "pill-blue",
  pkl: "pill-pink",
};

/* ── RENDER Rapor ─────────────────────────────────────────── */
function init() {
  document.getElementById("rapor-tbody").innerHTML = dataStudent
    .map((r, i) => {
      return `<tr>
      <td>${i + 1}</td>
      <td>${r.student_nis}</td>
      <td>${r.student_nisn}</td>
      <td>${r.student_name}</td>
      <td>${r.class}</td>
      <td>${r.class_advisor}</td>
      <td>${r.semester}</td>
      <td>${r.school_year}</td>
      <td><span class="pill ${smap[r.status.toLowerCase()]}">${r.status.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-print-rapor" id="${r.student_id}">🖨️</button>
      </td>
    </tr>`;
    })
    .join("");
}

function printRapor() {
  const btnPrintRapor = document
    .querySelectorAll(".btn-print-rapor")
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const studentAssessment = await fetchAssessmentStudent(btn.id);
        console.log(studentAssessment);
      });
    });
}
/* ── INIT ──────────────────────────────────────────── */
init();
printRapor();
