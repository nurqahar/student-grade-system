import Assessment from "../assessment/assessment.model.mjs";
import Absence from "../absence/absence.model.mjs";

// KELAS 12
const subjectMapping_xii = {
  UMUM: [1, 2, 3, 4, 12, 26, 5, 6],
  TKJ: [13, 14, 15, 18, 20],
  TP: [13, 14, 15, 16, 22],
  TSM: [13, 14, 15, 19, 23],
  TOI: [13, 14, 15, 17, 21],
};

// KELAS 11
const subjectMapping_xi = {
  UMUM: [1, 2, 3, 33, 4, 12, 26, 5],
  TJKT: [13, 14, 18, 30, 20],
  TP: [13, 14, 16, 30, 31],
  TSM: [13, 14, 19, 30, 23],
  TOI: [13, 14, 17, 30, 32],
};

// KELAS 10
const subjectMapping_x = {
  UMUM: [1, 2, 3, 33, 4, 12, 26, 5, 6, 27],
  TJKT: [13, 14, 28, 29, 9],
  TP: [13, 14, 28, 29, 7],
  TSM: [13, 14, 28, 29, 10],
  TOI: [13, 14, 28, 29, 8],
};

function getSubjectMappingByLevel(levelName) {
  if (levelName === "X") return subjectMapping_x;
  if (levelName === "XI") return subjectMapping_xi;
  if (levelName === "XII") return subjectMapping_xii;
  return {};
}

// Mengambil kode prodi dari nama kelas, misal "TOI 2" -> "TOI"
function checkProdi(inputClassName) {
  const prodiMatch = (inputClassName || "").match(/^([a-z]+)/i);
  if (!prodiMatch) return false;
  return prodiMatch[1].toUpperCase();
}

function getSubjectByProdi(subjectMapping, prodi) {
  const key = (prodi || "").toUpperCase();
  return subjectMapping[key] || [];
}

function pickSubjectsByType(assessmentRows, subjectType) {
  return assessmentRows
    .filter((item) => item.subject_type === subjectType)
    .map((item) => ({
      subject_name: item.subject_name,
      subject_id: item.subject_id,
      numeric_grade: item.numeric_grade,
      letter_grade: item.letter_grade,
      competency_achievement: item.competency_achievement,
    }));
}

function sortBySubjectOrder(subjectList, order) {
  return [...subjectList].sort(
    (a, b) => order.indexOf(a.subject_id) - order.indexOf(b.subject_id),
  );
}

function findAbsenceByHistoryId(absenceRows, historyId) {
  const found = absenceRows.find((row) => row.history_id === historyId);
  return {
    sakit: found?.sakit ?? 0,
    izin: found?.izin ?? 0,
    alpa: found?.alpa ?? 0,
  };
}

// Menyusun object data siap-cetak untuk SATU siswa, dari kumpulan baris
// assessment (semua mapel milik satu history_id) + baris absensi terkait.
function buildStudentData({
  assessmentRowsForStudent,
  absenceRows,
  raporDate,
  headmasterName,
  number,
}) {
  const first = assessmentRowsForStudent[0];
  if (!first) return null;

  const subjectMapping = getSubjectMappingByLevel(first.level_name);
  const prodi = checkProdi(first.class_name);

  const umum = sortBySubjectOrder(
    pickSubjectsByType(assessmentRowsForStudent, "umum"),
    getSubjectByProdi(subjectMapping, "UMUM"),
  );
  const kejuruan = sortBySubjectOrder(
    pickSubjectsByType(assessmentRowsForStudent, "kejuruan"),
    getSubjectByProdi(subjectMapping, prodi),
  );
  const mulok = pickSubjectsByType(assessmentRowsForStudent, "mulok");
  const extra = pickSubjectsByType(assessmentRowsForStudent, "ekstra");

  const absence = findAbsenceByHistoryId(absenceRows, first.history_id);
  const semester = first.semester % 2 !== 0 ? 1 : 2;
  const phase = ["XII", "XI"].includes(first.level_name) ? "F" : "E";
  const classLevel = `${first.level_name} ${first.class_name}`;
  let status = first.status.toLowerCase();
  let keteranganKenaikan;
  if (status === "aktif") {
    keteranganKenaikan = "Naik Ke Kelas";
  } else if (status === "keluar" || status === "pindah") {
    keteranganKenaikan = "Tidak Naik Ke Kelas";
  }

  return {
    rapor_date: raporDate || "",
    headmaster_name: headmasterName || "",
    class_advisor_name: `${first.class_advisor_name}, ${first.class_advisor_title}`,
    class_advisor_note: first.class_advisor_note,
    umum,
    kejuruan,
    mulok,
    extra,
    sakit: absence.sakit,
    izin: absence.izin,
    alpa: absence.alpa,
    school_year: first.school_year,
    semester,
    phase,
    studentName: first.student_name,
    classLevel,
    levelName: first.level_name,
    nis: first.student_nis,
    nisn: (first.student_nisn || "").replace("'", ""),
    keteranganKenaikan,
    number,
  };
}

// Data rapor SEMUA siswa dalam satu kelas (dipakai untuk ZIP / PDF gabungan).
export async function getClassRaporData({
  levelName,
  className,
  schoolYear,
  semester,
  raporDate,
  headmasterName,
}) {
  const [assessmentRows, absenceRows] = await Promise.all([
    Assessment.viewDetail({ levelName, className, schoolYear, semester }),
    Absence.viewDetail({ levelName, className, schoolYear, semester }),
  ]);

  const historyIds = [...new Set(assessmentRows.map((r) => r.history_id))];

  return historyIds
    .map((historyId, idx) =>
      buildStudentData({
        assessmentRowsForStudent: assessmentRows.filter(
          (r) => r.history_id === historyId,
        ),
        absenceRows,
        raporDate,
        headmasterName,
        number: idx + 1,
      }),
    )
    .filter(Boolean);
}

// Data rapor SATU siswa saja (dipakai untuk cetak per-siswa).
export async function getStudentRaporData({
  historyId,
  raporDate,
  headmasterName,
}) {
  const [assessmentRows, absenceRows] = await Promise.all([
    Assessment.getByHistoryId(historyId),
    Absence.getByHistoryId(historyId),
  ]);

  if (!assessmentRows.length) return null;

  return buildStudentData({
    assessmentRowsForStudent: assessmentRows,
    absenceRows,
    raporDate,
    headmasterName,
    number: 1,
  });
}

// "XII TOI 2" -> { levelName: "XII", className: "TOI 2" }
export function splitClassLevel(classLevel) {
  const parts = (classLevel || "").trim().split(" ");
  const levelName = parts[0] || "";
  const className = parts.slice(1).join(" ");
  return { levelName, className };
}
