let rawText = "";
let parsed = { headers: [], rows: [] };

// ── Drag & Drop ─────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById("drop-zone").classList.add("drag-over");
}

function handleDragLeave() {
  document.getElementById("drop-zone").classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById("drop-zone").classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
}

// ── File reader ──────────────────────────────────────────
function handleFile(file) {
  if (!file) return;
  if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
    showError("Please upload a valid .csv file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    rawText = e.target.result;
    document.getElementById("drop-zone").style.display = "none";
    document.getElementById("options-bar").style.display = "flex";
    reparse();
  };
  reader.readAsText(file);
}

// ── CSV Parser ───────────────────────────────────────────
function parseCSV(text, delimiter, hasHeader) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return { headers: [], rows: [] };

  // handles quoted fields e.g. "hello, world"
  function splitLine(line) {
    const result = [];
    let cur = "",
      inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuote = !inQuote;
        continue;
      }
      if (c === delimiter && !inQuote) {
        result.push(cur.trim());
        cur = "";
        continue;
      }
      cur += c;
    }
    result.push(cur.trim());
    return result;
  }

  let headers, rows;

  if (hasHeader) {
    headers = splitLine(lines[0]);
    rows = lines.slice(1).map(splitLine);
  } else {
    const first = splitLine(lines[0]);
    headers = first.map((_, i) => "Column " + (i + 1));
    rows = lines.map(splitLine);
  }

  return { headers, rows };
}

// ── Re-parse on option change ────────────────────────────
function reparse() {
  hideError();
  const delimiter = document.getElementById("delimiter").value;
  const hasHeader = document.getElementById("has-header").checked;
  parsed = parseCSV(rawText, delimiter, hasHeader);

  if (!parsed.headers.length) {
    showError("Could not parse the file. Try a different delimiter.");
    return;
  }

  renderStats();
  renderTable();
}

// ── Stats bar ────────────────────────────────────────────
function renderStats() {
  const totalRows = parsed.rows.length;
  const totalCols = parsed.headers.length;
  const emptyCells = parsed.rows.reduce(
    (acc, row) => acc + row.filter((c) => c === "").length,
    0,
  );

  document.getElementById("stats-bar").innerHTML = `
        <div class="stat-card">
          <div class="stat-label">Rows</div>
          <div class="stat-value">${totalRows.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Columns</div>
          <div class="stat-value">${totalCols}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Empty cells</div>
          <div class="stat-value">${emptyCells.toLocaleString()}</div>
        </div>
      `;
  document.getElementById("stats-bar").style.display = "grid";
}

// ── Table render ─────────────────────────────────────────
function renderTable() {
  const limitVal = document.getElementById("preview-rows").value;
  const limit = limitVal === "all" ? parsed.rows.length : parseInt(limitVal);
  const rows = parsed.rows.slice(0, limit);

  let html = "<thead><tr>";
  html += `<th>#</th>`;
  parsed.headers.forEach((h, i) => {
    html += `<th title="${h}">#${i + 1} ${h}</th>`;
  });
  html += "</tr></thead><tbody>";

  rows.forEach((row, index) => {
    html += "<tr>";
    html += `<td>${index + 1}</td>`;
    parsed.headers.forEach((_, ci) => {
      const val = row[ci] !== undefined ? row[ci] : "";
      html +=
        val === ""
          ? `<td><span class="empty-cell">—</span></td>`
          : `<td title="${val}">${val}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody>";
  document.getElementById("csv-table").innerHTML = html;
  document.getElementById("table-wrap").style.display = "block";

  const note = document.getElementById("truncation-note");
  if (parsed.rows.length > limit) {
    note.textContent = `Showing ${limit.toLocaleString()} of ${parsed.rows.length.toLocaleString()} rows`;
    note.style.display = "block";
  } else {
    note.style.display = "none";
  }
}

// ── Reset ────────────────────────────────────────────────
function resetAll() {
  rawText = "";
  parsed = { headers: [], rows: [] };
  document.getElementById("file-input").value = "";
  document.getElementById("drop-zone").style.display = "block";
  document.getElementById("options-bar").style.display = "none";
  document.getElementById("stats-bar").style.display = "none";
  document.getElementById("table-wrap").style.display = "none";
  document.getElementById("truncation-note").style.display = "none";
  hideError();
}

// ── Error helpers ────────────────────────────────────────
function showError(msg) {
  const box = document.getElementById("error-box");
  box.textContent = msg;
  box.style.display = "block";
}

function hideError() {
  document.getElementById("error-box").style.display = "none";
}

function convertToObj(parsed) {
  const newObject = parsed.rows.map((rows) => {
    const pairs = parsed.headers.map((headers, i) => [headers, rows[i]]);
    return Object.fromEntries(pairs);
  });
  return newObject;
}

async function postAsJson() {
  const btnUpload = document.getElementById("btn-upload");
  btnUpload.disabled = true;
  btnUpload.innerHTML = "⬆️Uploading...";

  const table_db = document.getElementById("table-db").value;
  const dataArray = convertToObj(parsed);
  const url = `http://localhost:9090/api/${table_db}/uploadCsv`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: dataArray,
    }),
  });

  if (response.status == 404) showSuccess(false, false);
  const result = await response.json();
  showSuccess(result, true);
  setTimeout(() => {
    showSuccess(false, false);
  }, 2000);

  //const url = `http://localhost:9090/api/${table_db}`;
  //const response = await fetch(url, {
  //  method: "GET",
  //  headers: { "Content-Type": "application/json" },
  //});
}

function showSuccess(isSuccess, isShown) {
  const btnUpdate = document.getElementById("btn-update");

  const successMsg = document.getElementById("success-message");
  const successWrapper = document.getElementById("success-wrapper");
  const btnUpload = document.getElementById("btn-upload");

  if (!isShown) return (successMsg.style.display = "none");

  btnUpdate.disabled = false;
  btnUpdate.innerHTML = "🔄️Update";
  btnUpload.disabled = false;
  btnUpload.innerHTML = "⬆️Upload";
  successWrapper.style.textAlign = "center";
  successMsg.style.display = "inline-block";
  successMsg.style.backgroundColor = "#ff7675";
  successMsg.style.padding = "10px";
  successMsg.style.color = "white";
  successMsg.style.borderRadius = "10px";

  if (!isSuccess) return (successMsg.innerHTML = "Failed! <br/>Try Again");

  successMsg.style.backgroundColor = "#00b894";
  successMsg.innerHTML = "Success!";
}

function debug() {
  const dataArray = convertToObj(parsed);
  console.log(dataArray);
  console.log("---");
  for ([key] of Object.entries(dataArray[0])) {
    console.log(key);
  }
  console.log("0", dataArray[0]);
}

async function updateBatch() {
  const btnUpdate = document.getElementById("btn-update");
  btnUpdate.disabled = true;
  btnUpdate.innerHTML = "Updating...";

  const btnUpload = document.getElementById("btn-upload");
  btnUpload.disabled = true;
  btnUpload.innerHTML = "⬆️Uploading...";

  const table_db = document.getElementById("table-db").value;
  const dataArray = convertToObj(parsed);
  const response = dataArray.map(async (dataObj, id) => {
    const url = `http://localhost:9090/api/${table_db}/${id + 8119}`;
    try {
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj),
      });
    } catch (error) {
      return error;
    }
  });

  if (response.status === 404) showSuccess(false, false);
  const result = await response;
  showSuccess(result, true);
  setTimeout(() => {
    showSuccess(false, false);
  }, 2000);
}
