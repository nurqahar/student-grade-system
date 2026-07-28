
# 📚 Student Grade System
Aplikasi untuk mengelola dan mencetak nilai siswa per semester. Proyek ini masih dalam tahap pengembangan aktif.

> ⚠️ **Status: Under Development**  
> Fitur-fitur di bawah masih dalam proses pembuatan dan dapat berubah sewaktu-waktu.

## 📝 Deskripsi

Aplikasi ini dibuat untuk membantu sekolah dalam mengelola data nilai siswa tiap semester, mulai dari input nilai, penyimpanan data, hingga mencetak rapor.

## ✨ Fitur

- [x] Import Data Csv
- [x] Input data siswa
- [x] Input nilai per mata pelajaran per semester
- [ ] Perhitungan nilai rata-rata otomatis
- [x] Cetak rapor ke PDF
- [ ] Riwayat nilai per siswa (multi-semester)
- [ ] Login untuk guru/admin
- [ ] Dashboard rekap nilai kelas

## 🛠️ Teknologi yang Digunakan

### Frontend
- HTML
- CSS
- JS

### Backend
- ExpressJS
- Puppeteer

### Database
- PostgreSQL

### Tools
- Docker


## 📂 Folder Structure
student-grade-system
├── Readme.md
├── backend
│   ├── app.mjs
│   ├── db
│   │   ├── knex.mjs
│   │   └── migration
│   │       └── 20260510103103_database_1.cjs
│   ├── docker
│   │   └── docker-compose.yaml
│   ├── jest.config.mjs
│   ├── knexfile.js
│   ├── modules
│   │   ├── absence
│   │   │   ├── absence.controller.mjs
│   │   │   ├── absence.model.mjs
│   │   │   └── absence.route.mjs
│   │   ├── achievements
│   │   │   ├── achievement.controller.mjs
│   │   │   ├── achievement.model.mjs
│   │   │   └── achievement.route.mjs
│   │   ├── assessment
│   │   │   ├── assessment.controller.mjs
│   │   │   ├── assessment.model.mjs
│   │   │   └── assessment.route.mjs
│   │   ├── base.controller.mjs
│   │   ├── base.model.mjs
│   │   ├── classes
│   │   │   ├── class.controller.mjs
│   │   │   ├── class.model.mjs
│   │   │   └── class.route.mjs
│   │   ├── generateRapor.mjs
│   │   ├── history_student
│   │   │   ├── history.controller.mjs
│   │   │   ├── history.model.mjs
│   │   │   └── history.route.mjs
│   │   ├── htmlToPdf.mjs
│   │   ├── index.route.mjs
│   │   ├── levels
│   │   │   ├── level.controller.mjs
│   │   │   ├── level.model.mjs
│   │   │   └── level.route.mjs
│   │   ├── rapor
│   │   │   ├── rapor.controller.mjs
│   │   │   ├── rapor.model.mjs
│   │   │   ├── rapor.route.mjs
│   │   │   └── rapor.service.mjs
│   │   ├── students
│   │   │   ├── student.controller.mjs
│   │   │   ├── student.model.mjs
│   │   │   └── student.route.mjs
│   │   ├── subjects
│   │   │   ├── subject.controller.mjs
│   │   │   ├── subject.model.mjs
│   │   │   └── subject.route.mjs
│   │   ├── teachers
│   │   │   ├── teacher.controller.mjs
│   │   │   ├── teacher.model.mjs
│   │   │   └── teacher.route.mjs
│   │   └── utils
│   │       └── response.mjs
│   ├── package-lock.json
│   └── package.json
└── frontend
    ├── app.mjs
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── css
    │   │   ├── style.css
    │   │   └── uploadCsv.css
    │   ├── js
    │   │   ├── Absence.js
    │   │   ├── Assessment.js
    │   │   ├── Classes.js
    │   │   ├── History.js
    │   │   ├── Level.js
    │   │   ├── Rapor.js
    │   │   ├── Students.js
    │   │   ├── Subjects.js
    │   │   ├── Teachers.js
    │   │   ├── generateRapor.js
    │   │   └── uploadCsv.js
    │   └── script.js
    └── views
        ├── index.ejs
        └── pages
            ├── Absence.ejs
            ├── Assessment.ejs
            ├── Classes.ejs
            ├── History.ejs
            ├── Level.ejs
            ├── Rapor.ejs
            ├── Setting.ejs
            ├── Students.ejs
            ├── SubjectMapping.ejs
            ├── Subjects.ejs
            ├── Teachers.ejs
            ├── uploadCsv.css
            ├── uploadCsv.html
            └── uploadCsv.js
