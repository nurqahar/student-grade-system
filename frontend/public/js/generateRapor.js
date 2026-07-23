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
    .replace(/\{\{alpa\}\}/g, data.alpa);

  const scriptInject = `
    <script>window.__RAPOR_DATA__ = ${JSON.stringify(data)};<\/script>
    <script type="module">${mjsContent}<\/script>
  `;

  // Hapus tag src rapor.mjs yang lama, ganti dengan inline
  return html
    .replace('<script src="./rapor.mjs" type="module"></script>', "")
    .replace("</body>", scriptInject + "</body>");
}

async function htmlToPdf(data) {
  // 1. Jalankan browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 2. Baca file HTML yang sudah dibuat sebelumnya
  let htmlPath;
  // SEMESTER GENAP
  if (data.levelName === "X") {
    let htmlPath_x = path.resolve(
      __dirname,
      "..",
      "frontend",
      "rapor_x_genap.html",
    );
    htmlPath = htmlPath_x;
  } else if (data.levelName === "XI") {
    let htmlPath_xi = path.resolve(
      __dirname,
      "..",
      "frontend",
      "rapor_xi_genap.html",
    );
    htmlPath = htmlPath_xi;
  } else if (data.levelName === "XII") {
    let htmlPath_xii = path.resolve(__dirname, "..", "frontend", "rapor.html");
    htmlPath = htmlPath_xii;
  }
  const htmlContent = fs.readFileSync(htmlPath, "utf8");
  const populatedHtml = buildHtml(htmlContent, data);

  // 3. Masukkan konten ke dalam page
  await page.setContent(populatedHtml, { waitUntil: "domcontentloaded" });

  // 4. Generate PDF dengan pengaturan margin
  const pdfBuffer = await page.pdf({
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
  });

  await browser.close();
  return pdfBuffer;
}

export default htmlToPdf;
