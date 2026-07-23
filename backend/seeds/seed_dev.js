/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const studentsData = require("../templates/seed.students.js");
  const historyStudentData = require("../templates/seed.history_student.js");
  const assessmentData = require("../templates/seed.assessment.js");
  const absenceData = require("../templates/seed.absence.js");
  const achievementData = require("../templates/seed.achievements.js");
  const levels = "levels";
  const subjects = "subjects";
  const achievements = "achievements";
  const teachers = "teachers";
  const students = "students";
  const classes = "classes";
  const history_student = "history_student";
  const absence = "absence";
  const assessment = "assessment";

  // Deletes ALL existing entries
  await knex(assessment).del();
  await knex(absence).del();
  await knex(history_student).del();
  await knex(classes).del();
  await knex(students).del();
  await knex(teachers).del();
  await knex(achievements).del();
  await knex(subjects).del();
  await knex(levels).del();

  // Insert Data after DELETION
  await knex(levels).insert([
    { level_name: "X" },
    { level_name: "XI" },
    { level_name: "XII" },
  ]);
  await knex(subjects).insert([
    {
      subject_name: "Pendidikan Agama Islam dan Budi Pekerti",
      subject_type: "umum",
    },
    {
      subject_name: "Pendidikan Agama Hindu dan Budi Pekerti",
      subject_type: "umum",
    },
    {
      subject_name: "Pendidikan Agama Kristen dan Budi Pekerti",
      subject_type: "umum",
    },
    { subject_name: "Pendidikan Pancasila", subject_type: "umum" },
    { subject_name: "Sejarah", subject_type: "umum" },
    { subject_name: "Seni Budaya", subject_type: "umum" },
    { subject_name: "Dasar-dasar Teknik Pemesinan", subject_type: "kejuruan" },
    {
      subject_name: "Dasar-dasar Teknik Otomasi Industri",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Dasar-dasar Teknik Komputer dan Jaringan",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Dasar-dasar Teknik Sepeda Motor",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Muatan Lokal Bahasa Daerah",
      subject_type: "mulok",
    },
    { subject_name: "Bahasa Indonesia", subject_type: "umum" },
    { subject_name: "Matematika (Umum)", subject_type: "kejuruan" },
    { subject_name: "Bahasa Inggris", subject_type: "kejuruan" },
    {
      subject_name: "Produk Kreatif dan Kewirausahaan",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Konsentrasi Keahlian Teknik Pemesinan",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Konsentrasi Keahlian Teknik Otomasi Industri",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Konsentrasi Keahlian Teknik Komputer dan Jaringan",
      subject_type: "kejuruan",
    },
    {
      subject_name: "Konsentrasi Keahlian Teknik Sepeda Motor",
      subject_type: "kejuruan",
    },
    { subject_name: "Sistem Perancangan IoT", subject_type: "kejuruan" },
    { subject_name: "Gambar MEP", subject_type: "kejuruan" },
    { subject_name: "Pemrograman CNC", subject_type: "kejuruan" },
    { subject_name: "Gambar Teknik Manufaktur", subject_type: "kejuruan" },
    { subject_name: "Kursus Bahasa Asing", subject_type: "ekstra" },
    { subject_name: "Pramuka", subject_type: "ekstra" },
  ]);
  await knex(achievements).insert(achievementData);
  await knex(teachers).insert([
    { teacher_name: "Tri Haryoko", teacher_title: "S.Sn." },
    { teacher_name: "Reni Loly Mardianawati", teacher_title: "S.Pd." },
    { teacher_name: "Rita Indahwati", teacher_title: "S.Pd." },
    { teacher_name: "Angkit Sabekti", teacher_title: "S.T." },
    { teacher_name: "Dra. Nur Hidayati", teacher_title: "M.Pd.I." },
    { teacher_name: "Supandari", teacher_title: "S.Pd.Si" },
    { teacher_name: "Aji Widi Kuncoro", teacher_title: "S.Pd." },
    { teacher_name: "Faaruq Umar Ibnu Chatab Al Amin", teacher_title: "S.Pd." },
    { teacher_name: "Lutfi Arina", teacher_title: "S.Pd." },
  ]);
  await knex(students).insert(studentsData);
  await knex(classes).insert([
    { level_id: 3, class_name: "TKJ 1" },
    { level_id: 3, class_name: "TOI 1" },
    { level_id: 3, class_name: "TOI 2" },
    { level_id: 3, class_name: "TP 1" },
    { level_id: 3, class_name: "TP 2" },
    { level_id: 3, class_name: "TP 3" },
    { level_id: 3, class_name: "TP 4" },
    { level_id: 3, class_name: "TSM 1" },
    { level_id: 3, class_name: "TSM 2" },
  ]);
  await knex(history_student).insert(historyStudentData);
  await knex(absence).insert(absenceData);
  await knex(assessment).insert(assessmentData);
};
