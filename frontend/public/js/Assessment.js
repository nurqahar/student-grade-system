/* ── FETCH ─────────────────────────────────────────── */
const BASE_URL = "http://localhost:9090/api";

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
const gradients = [
  ["#4f8ef7", "#7c5ef4"],
  ["#22d3a5", "#22d8e8"],
  ["#f59e3a", "#f05c7a"],
  ["#7c5ef4", "#f05c7a"],
  ["#4f8ef7", "#22d8e8"],
  ["#22d3a5", "#4f8ef7"],
];
const assessments = await fetchAssessment();

/* ── HELPERS ─────────────────────────────────────── */
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function gradeLabel(val) {
  if (val >= 90) return '<span class="pill pill-green">A</span>';
  if (val >= 80) return '<span class="pill pill-blue">B</span>';
  if (val >= 70) return '<span class="pill pill-amber">C</span>';
  return '<span class="pill pill-red">D</span>';
}

/* ── RENDER ASSESSMENT ─────────────────────────────────────────── */
function initDropdownAssessment() {
  if (!assessments || !Array.isArray(assessments) || assessments.length === 0) {
    document.querySelector("#assessment-table thead").style.display = "none";
    document.querySelector("#assessment-table tbody").innerHTML = `
    <tbody>
        <tr>
          <td style="text-align: center; padding: 20px; color: #888;">
            Tidak ada data untuk ditampilkan.
          </td>
        </tr>
    </tbody>
    `;
    return;
  } else {
    let tahunPelajaranData = `
       <option value="all">Semua Tahun Pelajaran</option>
    `;
    let semesterData = `
       <option value="all">Semua Semester</option>
    `;

    let filterSchoolYear = [...new Set(assessments.map((e) => e.school_year))];

    let filterSemester = [...new Set(assessments.map((e) => e.semester))];
    filterSemester.sort((a, b) => {
      return a - b;
    });

    semesterData += filterSemester
      .map((a, i) => {
        return `
        <option value=\"${a}\">${a}</option>
      `;
      })
      .join("");

    tahunPelajaranData += filterSchoolYear
      .map((a, i) => {
        return `
        <option value=\"${a}\">${a}</option>
      `;
      })
      .join("");

    document.getElementById("filter-year-assessment").innerHTML =
      tahunPelajaranData;
    document.getElementById("filter-semester-assessment").innerHTML =
      semesterData;

    document.getElementById("filter-year-rapor").innerHTML = tahunPelajaranData;
    document.getElementById("filter-semester-rapor").innerHTML = semesterData;
  }
}

function renderAssessment(assessments) {
  document.querySelector("#assessment-table thead").style.display = "";
  document.getElementById("assessment-tbody").innerHTML = assessments
    .map((r, i) => {
      return `<tr>
      <td>${i + 1}</td>
      <td>${r.student_nis}</td>
      <td class="td-name">
        <div class="mini-avatar" style="background:linear-gradient(135deg,${gradients[i % gradients.length].join(",")})">
          ${initials(r.student_name)}</div>${r.student_name}
      </td>
      <td>${r.level_name + " " + r.class_name}</td><td>${r.subject_name}</td>
      <td>${r.numeric_grade}</td>
      <td>${r.letter_grade}</td>
    </tr>`;
    })
    .join("");
}

/* ── FILTER ASSESSMENT ─────────────────────────────────────────── */
function filterAssessment() {
  const btnFilterAssessment = document.getElementById("btn-filter-assessment");
  btnFilterAssessment.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedClassLevel = document.getElementById(
      "filter-classLevel-assessment",
    );
    const selectedYear = document.getElementById("filter-year-assessment");
    const selectedSemester = document.getElementById(
      "filter-semester-assessment",
    );
    let classLevel = "all";
    if (selectedClassLevel !== "all") {
      classLevel = selectedClassLevel.value;
    }
    const selectedSubject = document.getElementById(
      "filter-subject-assessment",
    );

    const filteredData = assessments.filter((item) => {
      const matchClass =
        classLevel === "all"
          ? assessments
          : item.level_name + " " + item.class_name === classLevel;
      const matchSubject =
        selectedSubject.value === "all"
          ? assessments
          : item.subject_name === selectedSubject.value;

      const matchYear =
        selectedYear.value === "all"
          ? assessments
          : item.school_year === selectedYear.value;

      const matchSemester =
        selectedSemester.value === "all"
          ? assessments
          : item.semester === selectedSemester.value;

      return matchClass && matchSubject && matchYear;
    });

    if (!filteredData) return "empty";
    renderAssessment(filteredData);
  });
}

/* ── INIT ──────────────────────────────────────────── */
initDropdownAssessment();
renderAssessment(assessments);
filterAssessment();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Assessment");
});
