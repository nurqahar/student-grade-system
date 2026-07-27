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
/* ── FETCH END ─────────────────────────────────────────── */

/* ── DATA ─────────────────────────────────────────── */

const students = await fetchStudents();

/* ── RENDER STUDENTS ─────────────────────────────────────────── */
function renderStudents(students) {
  //badge-students
  const badge_students = document.getElementById("badge-students");
  badge_students.innerText = students.length;

  const smap = {
    aktif: "pill-green",
    pindah: "pill-amber",
    keluar: "pill-red",
    lulus: "pill-blue",
    pkl: "pill-pink",
  };
  document.getElementById("student-tbody").innerHTML = students
    .map(
      (s, i) => `
    <tr>
      <td style="font-size:12px;color:var(--muted)">${s.student_nis}</td>
      <td class="td-name">
        <div class="mini-avatar" style="background:linear-gradient(135deg,${gradients[i % gradients.length].join(",")})">
          ${initials(s.student_name)}</div>${s.student_name}
      </td>
      <td>${s.level_name + " " + s.class_name}</td>
      <td>${s.student_nisn.replace("'", "")}</td>
      <td>${s.teacher_name + " " + s.teacher_title}</td>
      <td><span class="pill ${smap[s.status.toLowerCase()]}">${s.status.toUpperCase()}</span></td>
      <td><div class="td-action">
        <div class="action-btn" id="btn-more-student">👁️</div>
        <div class="action-btn" id="btn-edit-student">✏️</div>
        <div class="action-btn" id="btn-delete-student">🗑️</div>
      </div></td>
    </tr>`,
    )
    .join("");
}
function initDropdownStudent() {
  if (!classes || !Array.isArray(classes) || classes.length === 0) {
  } else {
    let classData = `
       <option value="all">Semua Kelas</option>
    `;
    classData += classes
      .map((c, i) => {
        return `
        <option value=\"${c.level_name + " " + c.class_name}\">${c.level_name + " " + c.class_name}</option>
      `;
      })
      .join("");

    document.getElementById("filter-classLevel-student").innerHTML = classData;
  }
}
function filterStudent() {
  const dropdownClassLevel = document.getElementById(
    "filter-classLevel-student",
  );
  const dropdownStatusStudent = document.getElementById(
    "filter-status-student",
  );

  dropdownClassLevel.addEventListener("change", () => {
    const filteredData = students.filter((item) => {
      const matchClass =
        dropdownClassLevel.value === "all"
          ? students
          : item.level_name + " " + item.class_name ===
            dropdownClassLevel.value;
      return matchClass;
    });

    if (!filteredData) return "empty";
    renderStudents(filteredData);
  });

  dropdownStatusStudent.addEventListener("change", () => {
    const filteredData = students.filter((item) => {
      const matchClass =
        dropdownStatusStudent.value === "all"
          ? students
          : item.status === dropdownStatusStudent.value;
      return matchClass;
    });

    if (!filteredData) return "empty";
    renderStudents(filteredData);
  });
}

/* ── INIT ──────────────────────────────────────────── */
initDropdownStudent();
renderStudents(students);
filterStudent();
