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

const students = await fetchStudents();

const teachers = [
  {
    nip: "19800112",
    name: "Drs. Hendra Surya",
    subject: "Matematika",
    classes: "X-A, XI-A",
    status: "Aktif",
  },
  {
    nip: "19750305",
    name: "Ibu Sri Lestari",
    subject: "Bahasa Indonesia",
    classes: "X-B, XII-B",
    status: "Aktif",
  },
  {
    nip: "19901215",
    name: "Bpk. Rudi Hermawan",
    subject: "Fisika",
    classes: "XI-A, XI-B",
    status: "Aktif",
  },
  {
    nip: "19850720",
    name: "Ibu Yanti Kusuma",
    subject: "Biologi",
    classes: "XII-A, XII-C",
    status: "Aktif",
  },
  {
    nip: "19930410",
    name: "Bpk. Andi Priyono",
    subject: "Sejarah",
    classes: "X-C, XI-C",
    status: "Cuti",
  },
  {
    nip: "19881130",
    name: "Ibu Mega Sari",
    subject: "Kimia",
    classes: "XI-B, XII-B",
    status: "Aktif",
  },
];

const absenceData = [
  {
    no: 1,
    name: "Ahmad Rafi",
    kelas: "X-A",
    date: "13/05/2026",
    status: "Hadir",
    ket: "-",
  },
  {
    no: 2,
    name: "Siti Rahma",
    kelas: "XI-B",
    date: "13/05/2026",
    status: "Hadir",
    ket: "-",
  },
  {
    no: 3,
    name: "Bima Laksono",
    kelas: "XII-C",
    date: "13/05/2026",
    status: "Izin",
    ket: "Keperluan keluarga",
  },
  {
    no: 4,
    name: "Dewi Wulandari",
    kelas: "X-B",
    date: "13/05/2026",
    status: "Hadir",
    ket: "-",
  },
  {
    no: 5,
    name: "Fajar Rizki",
    kelas: "XI-A",
    date: "13/05/2026",
    status: "Alpha",
    ket: "Tidak ada keterangan",
  },
  {
    no: 6,
    name: "Nadia Putri",
    kelas: "XII-A",
    date: "13/05/2026",
    status: "Sakit",
    ket: "Surat dokter",
  },
  {
    no: 7,
    name: "Hana Pertiwi",
    kelas: "XI-C",
    date: "13/05/2026",
    status: "Hadir",
    ket: "-",
  },
];

const assessments = await fetchAssessment();
const subjects = await fetchSubjects();
const classes = await fetchClasses();

const levels = await fetchLevel();

const historyEvents = [
  {
    icon: "📝",
    title: "Ujian Akhir Semester Genap",
    time: "13 Mei 2026, 09:00",
    desc: "Ujian dilaksanakan di semua kelas",
    color: "var(--accent)",
  },
  {
    icon: "🏆",
    title: "Pengumuman Juara Kelas",
    time: "10 Mei 2026, 14:00",
    desc: "Ahmad Rafi meraih peringkat 1 kelas X-A",
    color: "var(--amber)",
  },
  {
    icon: "📋",
    title: "Rekap Absensi Bulan April",
    time: "01 Mei 2026",
    desc: "Rata-rata kehadiran 93.5%",
    color: "var(--green)",
  },
  {
    icon: "🎓",
    title: "Penerimaan Siswa Baru",
    time: "15 Apr 2026",
    desc: "48 siswa baru diterima di kelas X",
    color: "var(--accent2)",
  },
  {
    icon: "📊",
    title: "Rapat Wali Kelas",
    time: "01 Apr 2026",
    desc: "Evaluasi semester ganjil selesai",
    color: "var(--cyan)",
  },
];

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

/* ── RENDER ───────────────────────────────────────── */
function renderAbsence() {
  const map = {
    Hadir: "pill-green",
    Izin: "pill-amber",
    Alpha: "pill-red",
    Sakit: "pill-blue",
  };
  document.getElementById("absence-tbody").innerHTML = absenceData
    .map(
      (r, i) => `
    <tr>
      <td>${r.no}</td>
      <td class="td-name">
        <div class="mini-avatar" style="background:linear-gradient(135deg,${gradients[i % gradients.length].join(",")})">
          ${initials(r.name)}</div>${r.name}
      </td>
      <td>${r.kelas}</td><td>${r.date}</td>
      <td><span class="pill ${map[r.status]}">${r.status}</span></td>
      <td style="color:var(--muted);font-size:12px">${r.ket}</td>
      <td><div class="td-action">
        <div class="action-btn">✏️</div>
        <div class="action-btn">🗑️</div>
      </div></td>
    </tr>`,
    )
    .join("");
}

/* ── RENDER ASSESSMENT ─────────────────────────────────────────── */
function initDropdownAssessment() {
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

    document.getElementById("filter-classLevel-assessment").innerHTML =
      classData;
    document.getElementById("filter-classLevel-rapor").innerHTML = classData;
  }

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
  } else {
    let subjectsData = `
       <option value="all">Semua Mapel</option>
    `;
    subjectsData += subjects
      .map((s, i) => {
        return `
        <option value=\"${s.subject_name}\">${s.subject_name}</option>
      `;
      })
      .join("");

    document.getElementById("filter-subject-assessment").innerHTML =
      subjectsData;
  }

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

/* ── RENDER TEACHERS ─────────────────────────────────────────── */
function renderTeachers() {
  const smap = { Aktif: "pill-green", Cuti: "pill-amber" };
  document.getElementById("teacher-tbody").innerHTML = teachers
    .map(
      (t, i) => `
    <tr>
      <td style="font-size:12px;color:var(--muted)">${t.nip}</td>
      <td class="td-name">
        <div class="mini-avatar" style="background:linear-gradient(135deg,${gradients[i % gradients.length].join(",")})">
          ${initials(t.name)}</div>${t.name}
      </td>
      <td>${t.subject}</td><td style="color:var(--muted);font-size:12px">${t.classes}</td>
      <td><span class="pill ${smap[t.status]}">${t.status}</span></td>
      <td><div class="td-action">
        <div class="action-btn">✏️</div>
        <div class="action-btn">🗑️</div>
      </div></td>
    </tr>`,
    )
    .join("");
}

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

/* ── RENDER HISTORY ──────────────────────────────────────────── */
function renderHistory() {
  document.getElementById("history-timeline").innerHTML = historyEvents
    .map(
      (e) => `
    <div class="timeline-item">
      <div class="timeline-dot" style="border-color:${e.color};color:${e.color}">${e.icon}</div>
      <div class="timeline-body">
        <div class="timeline-title">${e.title}</div>
        <div class="timeline-time">🕐 ${e.time}</div>
        <div class="timeline-desc">${e.desc}</div>
      </div>
    </div>`,
    )
    .join("");

  const hmap = document.getElementById("heatmap-grid");
  const levels = [null, "h1", "h2", "h3", "h4"];
  hmap.innerHTML = Array.from({ length: 31 }, (_, i) => {
    const l = levels[Math.floor(Math.random() * 5)];
    return `<div class="heatmap-cell ${l || ""}" title="Hari ke-${i + 1}"></div>`;
  }).join("");
}

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

/* ── RAPOR  ──────────────────────────────────────────── */

// Ambil blob hasil POST lalu trigger download-nya di browser.
async function downloadRaporFile(url, body, fallbackFileName) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || `Server Error, Status: ${res.status}`);
  }

  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+)"/);
  const fileName = match ? match[1] : fallbackFileName;

  const tempLink = document.createElement("a");
  tempLink.href = blobUrl;
  tempLink.setAttribute("download", fileName);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobUrl);
}

function renderRapor() {
  const dropdownClass = document.getElementById("filter-classLevel-rapor");
  const dropdownSchoolYear = document.getElementById("filter-year-rapor");
  const dropdownSemester = document.getElementById("filter-semester-rapor");
  const btnPrintZip = document.getElementById("btn-print-zip-rapor");
  const btnPrintCombined = document.getElementById("btn-print-combined-rapor");
  const raporDate = document.getElementById("input-rapor-date-txt");
  const headmasterName = document.getElementById("input-headmaster-name-txt");

  function buildRequestBody() {
    if (!dropdownClass.value || dropdownClass.value === "all") {
      throw new Error("Pilih kelas terlebih dahulu");
    }
    return {
      classLevel: dropdownClass.value,
      schoolYear:
        dropdownSchoolYear.value === "all"
          ? undefined
          : dropdownSchoolYear.value,
      semester:
        dropdownSemester.value === "all" ? undefined : dropdownSemester.value,
      raporDate: raporDate.value,
      headmasterName: headmasterName.value,
    };
  }

  async function handlePrintAll(url, fallbackFileName, btn) {
    btn.disabled = true;
    try {
      const body = buildRequestBody();
      showStatus("Sedang membuat rapor....", "loading");
      await downloadRaporFile(url, body, fallbackFileName);
      showStatus("Berhasil membuat rapor", "success");
      hideStatus(1000);
    } catch (error) {
      showStatus(`Gagal! ${error.message}`, "error");
      hideStatus(3000);
    } finally {
      btn.disabled = false;
    }
  }

  btnPrintZip.addEventListener("click", () => {
    handlePrintAll(
      "http://localhost:9090/api/rapor/printZip",
      `Rapor_${dropdownClass.value.replace(/\s+/g, "_")}.zip`,
      btnPrintZip,
    );
  });

  btnPrintCombined.addEventListener("click", () => {
    handlePrintAll(
      "http://localhost:9090/api/rapor/printCombined",
      `Rapor_${dropdownClass.value.replace(/\s+/g, "_")}_gabungan.pdf`,
      btnPrintCombined,
    );
  });
}

function previewStudentRapor() {
  const btnPreviewRapor = document.getElementById("btn-preview-rapor");
  const dropdownClass = document.getElementById("filter-classLevel-rapor");
  const raporDate = document.getElementById("input-rapor-date-txt");
  const headmasterName = document.getElementById("input-headmaster-name-txt");
  const raporTbody = document.getElementById("rapor-tbody");

  btnPreviewRapor.addEventListener("click", () => {
    const filteredData = students.filter((item) => {
      const matchClass =
        dropdownClass.value === item.level_name + " " + item.class_name;
      return matchClass;
    });
    const smap = {
      aktif: "pill-green",
      pindah: "pill-amber",
      keluar: "pill-red",
      lulus: "pill-blue",
      pkl: "pill-pink",
    };
    raporTbody.innerHTML = filteredData
      .map(
        (s, i) => `
    <tr>
      <td style="font-size:12px;color:var(--muted)">${s.student_nis}</td>
      <td>${s.student_nisn.replace("'", "")}</td>
      <td class="td-name">
        <div class="mini-avatar" style="background:linear-gradient(135deg,${gradients[i % gradients.length].join(",")})">
          ${initials(s.student_name)}</div>${s.student_name}
      </td>
      <td>${s.level_name + " " + s.class_name}</td>
      <td>${s.teacher_name + " " + s.teacher_title}</td>
      <td>${s.semester}</td>
      <td>${s.school_year}</td>
      <td><span class="pill ${smap[s.status.toLowerCase()]}">${s.status.toUpperCase()}</span></td>
      <td><div class="td-action">
        <button class="btn btn-primary btn-print-student" data-history-id="${s.id}">Print</button>
      </div></td>
    </tr>`,
      )
      .join("");
  });

  // Event delegation: tombol Print per-baris dibuat ulang tiap kali Preview
  // di-klik, jadi listener dipasang sekali di parent (tbody), bukan per baris.
  raporTbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-print-student");
    if (!btn) return;

    const historyId = btn.dataset.historyId;
    const params = new URLSearchParams({
      raporDate: raporDate.value || "",
      headmasterName: headmasterName.value || "",
    });

    // Buka PDF di tab baru untuk preview; dari situ user tinggal download.
    window.open(
      `http://localhost:9090/api/rapor/printStudent/${historyId}?${params.toString()}`,
      "_blank",
    );
  });
}

/* ── STATUS HELPER ──────────────────────────────────────────── */
function showStatus(msg, statusType) {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = msg;
  statusMessage.className = statusType; // Mengisi class 'success', 'error', atau 'loading'
  statusMessage.style.display = "block"; // Munculkan elemen
}
function hideStatus(duration) {
  const statusMessage = document.getElementById("status-message");
  setTimeout(() => {
    statusMessage.style.display = "none";
  }, duration);
}
/* ── NAV ──────────────────────────────────────────── */
const titles = {
  dashboard: ["Dashboard", "Selamat datang, Admin Sekolah"],
  absence: ["Kehadiran", "Rekap absensi harian"],
  assessment: ["Assessment", "Penilaian & hasil ujian"],
  student: ["Siswa", "Data seluruh siswa"],
  teacher: ["Guru", "Data tenaga pengajar"],
  subject: ["Mata Pelajaran", "Kurikulum & jadwal"],
  history: ["Riwayat", "Histori akademik siswa"],
  classes: ["Kelas", "Data rombongan belajar"],
  level: ["Level", "Tingkatan pendidikan"],
  rapor: ["Rapor", "Cetak Rapor"],
  setting: ["Setting", "Pengaturan"],
};

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.dataset.panel;
    document
      .querySelectorAll(".nav-item")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".panel")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById("panel-" + panel).classList.add("active");
    const [t, s] = titles[panel] || [panel, ""];
    document.getElementById("topbar-title").textContent = t;
    document.getElementById("topbar-subtitle").textContent = s;
    // close sidebar on mobile
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("visible");
  });
});

/* hamburger */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("visible");
});
document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
});

/* ── INIT ──────────────────────────────────────────── */
renderAbsence();

initDropdownAssessment();
renderAssessment(assessments);
filterAssessment();

initDropdownStudent();
renderStudents(students);
filterStudent();

renderTeachers();
renderSubjects();
renderHistory();
renderClasses();
renderLevels();

renderRapor();
previewStudentRapor();
