margin:

kiri

kanan

atas

bawah



20

20

20

10











&#x20;   <style>



:root {

&#x20;   /\* Atur Margin di Sini \*/

&#x20;   --margin-top: 20mm;

&#x20;   --margin-bottom: 10mm;

&#x20;   --margin-left: 20mm;

&#x20;   --margin-right: 20mm;

&#x20;   --font-size: 11pt;

}



@page {

&#x20;   size: A4;

&#x20;   margin: var(--margin-top) var(--margin-right) var(--margin-bottom) var(--margin-left);

}



body {

&#x20;   font-family: 'Arial', sans-serif;

&#x20;   font-size: var(--font-size);

&#x20;   line-height: 1.4;

&#x20;   margin: 0;

&#x20;   padding: 0;

}



.page-break {

&#x20;   page-break-after: always;

}



/\* Header Info Siswa \*/

.info-table {

&#x20;   width: 100%;

&#x20;   margin-bottom: 20px;

&#x20;   border-collapse: collapse;

}



.info-table td {

&#x20;   padding: 2px 5px;

&#x20;   vertical-align: top;

}



/\* Table Utama Nilai \*/

.main-table {

&#x20;   width: 100%;

&#x20;   border-collapse: collapse;

&#x20;   margin-bottom: 20px;

}



.main-table th, .main-table td {

&#x20;   border: 1px solid black;

&#x20;   padding: 8px;

&#x20;   text-align: left;

}



.main-table th {

&#x20;   background-color: #f2f2f2;

&#x20;   text-align: center;

}



.center { text-align: center; }

.bold { font-weight: bold; }

.group-header { background-color: #eee; font-weight: bold; }



/\* Footer / Tanda Tangan \*/

.signature-wrapper {

&#x20;   width: 100%;

&#x20;   margin-top: 30px;

}



.signature-table {

&#x20;   width: 100%;

&#x20;   border-collapse: collapse;

}



.signature-table td {

&#x20;   width: 33%;

&#x20;   text-align: center;

&#x20;   vertical-align: top;

&#x20;   padding-bottom: 60px;

}



.headmaster-sign {

&#x20;   margin-top: 20px;

&#x20;   text-align: center;

}



/\* Penomoran Halaman \*/

.footer-page {

&#x20;   text-align: right;

&#x20;   font-size: 9pt;

&#x20;   margin-top: 10px;

}

&#x20;   </style>



