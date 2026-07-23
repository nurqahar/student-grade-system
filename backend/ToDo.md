## Frontend

- [x] assessment page
- [x] filter assessment page
- [x] assessment: setelah filter, dropdown tetap pada pilihan terakhir
- [x] subjects page
- [x] level page
- [x] students page
- [x] add method upload
- [x] add new grade class x and xi

##

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
      <div class="level-stats">
        <div class="level-count" style="color:${l.color}">${l.students}</div>
        <div class="level-clabel">Siswa</div>
      </div>
    </div>`,
)
.join("");
}
const levels = [
{
name: "Kelas X",
desc: "Tingkat Pertama SMA",
classes: 3,
students: 90,
color: "var(--accent)",
bg: "rgba(79,142,247,.12)",
},
{
name: "Kelas XI",
desc: "Tingkat Kedua SMA",
classes: 3,
students: 96,
color: "var(--accent2)",
bg: "rgba(124,94,244,.12)",
},
{
name: "Kelas XII",
desc: "Tingkat Akhir SMA",
classes: 3,
students: 88,
color: "var(--green)",
bg: "rgba(34,211,165,.12)",
},
];

function renderClasses() {
document.getElementById("classes-tbody").innerHTML = classes
.map((c, i) => {
const pct = Math.round((c.students / c.cap) \* 100);
const pcol =
pct > 90 ? "var(--red)" : pct > 75 ? "var(--amber)" : "var(--green)";
return `<tr>
      <td style="font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)">${c.code}</td>
      <td style="font-weight:500">${c.name}</td>
      <td style="font-size:12px;color:var(--muted)">${c.wali}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-weight:600">${c.students}</span>
          <div style="flex:1;height:4px;background:var(--bg4);border-radius:99px;width:60px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${pcol};border-radius:99px"></div>
          </div>
        </div>
      </td>
      <td style="color:var(--muted)">${c.cap}</td>
      <td>${c.room}</td>
      <td><span class="pill pill-green">${c.status}</span></td>
    </tr>`;
})
.join("");
}
const classes = [
{
code: "X-A",
name: "Kelas X-A",
wali: "Drs. Hendra Surya",
students: 32,
cap: 36,
room: "R.101",
status: "Aktif",
},
{
code: "X-B",
name: "Kelas X-B",
wali: "Ibu Sri Lestari",
students: 30,
cap: 36,
room: "R.102",
status: "Aktif",
},
{
code: "X-C",
name: "Kelas X-C",
wali: "Ibu Ratna D.",
students: 28,
cap: 36,
room: "R.103",
status: "Aktif",
},
{
code: "XI-A",
name: "Kelas XI-A",
wali: "Bpk. Rudi Hermawan",
students: 34,
cap: 36,
room: "R.201",
status: "Aktif",
},
{
code: "XI-B",
name: "Kelas XI-B",
wali: "Ibu Mega Sari",
students: 33,
cap: 36,
room: "R.202",
status: "Aktif",
},
{
code: "XI-C",
name: "Kelas XI-C",
wali: "Bpk. Andi Priyono",
students: 29,
cap: 36,
room: "R.203",
status: "Aktif",
},
{
code: "XII-A",
name: "Kelas XII-A",
wali: "Ibu Yanti Kusuma",
students: 35,
cap: 36,
room: "R.301",
status: "Aktif",
},
{
code: "XII-B",
name: "Kelas XII-B",
wali: "Bpk. Wahyu S.",
students: 31,
cap: 36,
room: "R.302",
status: "Aktif",
},
{
code: "XII-C",
name: "Kelas XII-C",
wali: "Bpk. Firman T.",
students: 22,
cap: 36,
room: "R.303",
status: "Aktif",
},
];

function renderSubjects() {
document.getElementById("subject-grid").innerHTML = subjects
.map((s, i) => {
const [c1, c2] = gradients[i % gradients.length];
return `<div class="subject-card">
      <div class="subject-icon" style="background:linear-gradient(135deg,${c1}22,${c2}22)">${s.icon}</div>
      <div class="subject-name">${s.name}</div>
      <div class="subject-meta">${s.teacher} · ${s.hours} jam/minggu · ${s.students} siswa</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:11px;color:var(--muted)">Progress kurikulum</span>
        <span style="font-size:12px;font-weight:700;color:${c1}">${s.progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${s.progress}%;background:linear-gradient(90deg,${c1},${c2})"></div>
      </div>
    </div>`;
})
.join("");
}
