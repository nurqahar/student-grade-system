import puppeteer from "puppeteer";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { renderPdfBuffer, buildFileName } from "../generateRapor.mjs";
import {
  getClassRaporData,
  getStudentRaporData,
  splitClassLevel,
} from "./rapor.service.mjs";
import { successResponse, errorResponse } from "../utils/response.mjs";

// POST /api/rapor/printZip
// body: { classLevel, schoolYear?, semester?, raporDate, headmasterName }
// -> 1 file .zip berisi PDF rapor tiap siswa di kelas tsb.
export const printZip = async (req, res) => {
  const { classLevel, schoolYear, semester, raporDate, headmasterName } =
    req.body;

  if (!classLevel || classLevel === "all") {
    return errorResponse(res, {
      message: "Pilih kelas terlebih dahulu",
      statusCode: 400,
    });
  }

  const { levelName, className } = splitClassLevel(classLevel);
  let browser;

  try {
    const studentsData = await getClassRaporData({
      levelName,
      className,
      schoolYear,
      semester,
      raporDate,
      headmasterName,
    });

    if (!studentsData.length) {
      return errorResponse(res, {
        message: "Tidak ada data siswa untuk kelas ini",
        statusCode: 404,
      });
    }

    browser = await puppeteer.launch();
    const zip = new JSZip();

    for (const data of studentsData) {
      const buffer = await renderPdfBuffer(data, browser);
      zip.file(buildFileName(data), buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Rapor_${classLevel.replace(/\s+/g, "_")}.zip"`,
    );
    return res.send(zipBuffer);
  } catch (error) {
    return errorResponse(res, {
      errors: error,
    });
  } finally {
    if (browser) await browser.close();
  }
};

// POST /api/rapor/printCombined
// body: { classLevel, schoolYear?, semester?, raporDate, headmasterName }
// -> 1 file .pdf gabungan berisi rapor semua siswa di kelas tsb.
export const printCombined = async (req, res) => {
  const { classLevel, schoolYear, semester, raporDate, headmasterName } =
    req.body;

  if (!classLevel || classLevel === "all") {
    return errorResponse(res, {
      message: "Pilih kelas terlebih dahulu",
      statusCode: 400,
    });
  }

  const { levelName, className } = splitClassLevel(classLevel);
  let browser;

  try {
    const studentsData = await getClassRaporData({
      levelName,
      className,
      schoolYear,
      semester,
      raporDate,
      headmasterName,
    });

    if (!studentsData.length) {
      return errorResponse(res, {
        message: "Tidak ada data siswa untuk kelas ini",
        statusCode: 404,
      });
    }

    browser = await puppeteer.launch();
    const mergedPdf = await PDFDocument.create();

    for (const data of studentsData) {
      const buffer = await renderPdfBuffer(data, browser);
      const studentPdf = await PDFDocument.load(buffer);
      const copiedPages = await mergedPdf.copyPages(
        studentPdf,
        studentPdf.getPageIndices(),
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBuffer = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Rapor_${classLevel.replace(/\s+/g, "_")}_gabungan.pdf"`,
    );
    return res.send(Buffer.from(mergedBuffer));
  } catch (error) {
    console.error(error);
    return errorResponse(res, {
      errors: error,
    });
  } finally {
    if (browser) await browser.close();
  }
};

// GET /api/rapor/printStudent/:historyId?raporDate=...&headmasterName=...
// -> 1 file .pdf untuk satu siswa, ditampilkan inline (preview di tab baru).
export const printStudent = async (req, res) => {
  const historyId = parseInt(req.params.historyId, 10);
  const { raporDate, headmasterName } = req.query;

  if (!historyId) {
    return errorResponse(res, {
      message: "historyId tidak valid",
      statusCode: 400,
    });
  }

  let browser;
  try {
    const data = await getStudentRaporData({
      historyId,
      raporDate,
      headmasterName,
    });

    if (!data) {
      return errorResponse(res, {
        message: "Data nilai siswa tidak ditemukan",
        statusCode: 404,
      });
    }

    browser = await puppeteer.launch();
    const buffer = await renderPdfBuffer(data, browser);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${buildFileName(data)}"`,
    );
    return res.send(buffer);
  } catch (error) {
    console.error(error);
    return errorResponse(res, {
      errors: error,
    });
  } finally {
    if (browser) await browser.close();
  }
};
