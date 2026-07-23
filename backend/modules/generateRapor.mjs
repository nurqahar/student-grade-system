import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
const __dirname = import.meta.dirname;

export function buildHtml(templateHtml, data) {
  const mjsContent = fs.readFileSync(
    path.resolve(__dirname, "..", "frontend", "rapor.mjs"),
    "utf8",
  );

  let html = templateHtml
    .replace(/\{\{rapor_date\}\}/g, data.rapor_date ?? "")
    .replace(/\{\{class_advisor_name\}\}/g, data.class_advisor_name ?? "")
    .replace(/\{\{headmaster_name\}\}/g, data.headmaster_name ?? "")
    .replace(/\{\{class_advisor_note\}\}/g, data.class_advisor_note ?? "")
    .replace(/\{\{sakit\}\}/g, data.sakit)
    .replace(/\{\{izin\}\}/g, data.izin)
    .replace(/\{\{alpa\}\}/g, data.alpa)
    .replace(/\{\{keteranganKenaikan\}\}/g, data.keteranganKenaikan);

  const scriptInject = `
    <script>window.__RAPOR_DATA__ = ${JSON.stringify(data)};<\/script>
    <script type="module">${mjsContent}<\/script>
  `;

  // Hapus tag src rapor.mjs yang lama, ganti dengan inline
  return html
    .replace('<script src="./rapor.mjs" type="module"></script>', "")
    .replace("</body>", scriptInject + "</body>");
}

// Menentukan template HTML rapor sesuai tingkat (X / XI / XII).
function getHtmlPath(levelName) {
  if (levelName === "X") {
    return path.resolve(__dirname, "..", "frontend", "rapor_x_genap.html");
  } else if (levelName === "XI") {
    return path.resolve(__dirname, "..", "frontend", "rapor_xi_genap.html");
  } else if (levelName === "XII") {
    return path.resolve(__dirname, "..", "frontend", "rapor_xii_genap.html");
  }
  throw new Error(`levelName tidak dikenali: ${levelName}`);
}

function pdfPrintOptions(data) {
  return {
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
        <div style="width: 100%; font-family: Arial; font-size: 10pt; padding: 0 15mm; margin-top: 10mm;">
            <table style="width: 100%; border-collapse: collapse; line-height: 1.2;">
                <tr>
                    <td style="width: 18%;">Nama</td>
                    <td style="width: 50%;">: ${data.studentName}</td>
                    <td style="width: 20%;">Kelas</td>
                    <td style="width: 20%;">: ${data.classLevel}</td>
                </tr>
                <tr>
                    <td>NIS/NISN</td>
                    <td>: ${data.nis} / ${data.nisn} </td>
                    <td>Fase</td>
                    <td>: ${data.phase}</td>
                </tr>
                <tr>
                    <td>Nama Sekolah</td>
                    <td>: SMK BINAWIYATA KARANGMALANG SRAGEN</td>
                    <td>Semester</td>
                    <td>: ${data.semester}</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>: Jl. Abimanyu No. 18 Taman Asri</td>
                    <td>Tahun Pelajaran</td>
                    <td>: ${data.school_year}</td>
                </tr>
            </table>
            <div style="border-bottom: 2px solid black; width: 100%; margin-top: 5px;"></div>            
        </div>`,
    footerTemplate: `
          <div style="width: 100%; font-family: 'Courier New'; font-size: 8pt; padding: 0 20mm;">
              <div style="border-top: 1.5px solid black; width: 100%; margin-bottom: 15px;"></div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; font-style: italic;">
                  <div style="font-weight: bold;">
                      ${data.classLevel}  |  ${data.studentName}  |  ${data.nis}
                  </div>
                  
                  <div style="font-weight:bold;">
                      Halaman &nbsp; : <span  class="pageNumber"></span>
                  </div>
              </div>
          </div>`,
    margin: {
      top: "10mm",
      bottom: "5mm",
      left: "20mm",
      right: "20mm",
    },
  };
}

export function buildFileName(data) {
  return `Rapor_${data.number}_${data.nis}_${data.studentName}_${data.classLevel}.pdf`;
}

// Render rapor SATU siswa menjadi Buffer PDF.
// `browser` WAJIB disediakan oleh pemanggil (agar bisa dipakai ulang untuk
// banyak siswa sekaligus tanpa launch/close browser berkali-kali) dan
// pemanggil bertanggung jawab menutup browser tsb setelah selesai.
export async function renderPdfBuffer(data, browser) {
  const page = await browser.newPage();
  try {
    const htmlPath = getHtmlPath(data.levelName);
    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    const populatedHtml = buildHtml(htmlContent, data);

    await page.setContent(populatedHtml, { waitUntil: "networkidle0" });
    const buffer = await page.pdf(pdfPrintOptions(data));
    return buffer;
  } finally {
    await page.close();
  }
}

// Dipakai oleh script CLI (frontend/raporHandler.mjs via `npm run gen_rapor`):
// generate 1 PDF lalu langsung ditulis ke folder ./rapor_pdf (relatif cwd),
// persis seperti perilaku sebelumnya.
async function generateRapor(data) {
  const browser = await puppeteer.launch();
  try {
    const buffer = await renderPdfBuffer(data, browser);

    const outDir = path.resolve(process.cwd(), "rapor_pdf");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outDir, buildFileName(data)), buffer);

    console.log(
      `PDF ${data.number} | ${data.studentName} | ${data.classLevel} Berhasil dibuat!`,
    );
  } finally {
    await browser.close();
  }
}

export default generateRapor;
