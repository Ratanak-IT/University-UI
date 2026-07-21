 
export type TranscriptRow = {
  code: string;
  subject: string;
  credits: number;
  score: number | null;
  grade: string;
};
 
export type TranscriptStudent = {
  fullName: string;
  studentId: string;
  nationalId: string;
  degreeProgram: string;
  academicYear: string;
  semester: string;
};
 
const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.5,
  B: 3.0,
  "B-": 2.5,
  "C+": 2.3,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};
 
function gradeToGpa(grade: string): number | null {
  return grade in GRADE_POINTS ? GRADE_POINTS[grade] : null;
}
 
function computeSemesterGpa(rows: TranscriptRow[]): number | null {
  const graded = rows.filter((r) => gradeToGpa(r.grade) !== null);
  if (graded.length === 0) return null;
  const totalCredits = graded.reduce((sum, r) => sum + r.credits, 0);
  const totalPoints = graded.reduce(
    (sum, r) => sum + r.credits * (gradeToGpa(r.grade) as number),
    0
  );
  return totalCredits === 0 ? null : totalPoints / totalCredits;
}
 
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
 
export function openTranscript(
  student: TranscriptStudent,
  rows: TranscriptRow[],
  cumulativeCgpa: number
) {
  const totalCredits = rows.reduce((sum, r) => sum + r.credits, 0);
  const semesterGpa = computeSemesterGpa(rows);
 
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const documentId = `TRX-${new Date().getFullYear()}-${student.studentId.replace(/\D/g, "").slice(-4).padStart(4, "0")}`;
 
  const tableRows = rows
    .map(
      (row, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td>${escapeHtml(row.code)}</td>
          <td class="subject-name">${escapeHtml(row.subject)}</td>
          <td class="center">${row.credits}</td>
          <td class="center">${row.score ?? "—"}</td>
          <td class="center">${escapeHtml(row.grade)}</td>
          <td class="center">${gradeToGpa(row.grade)?.toFixed(2) ?? "—"}</td>
        </tr>`
    )
    .join("");
 
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Official Academic Transcript · ${escapeHtml(student.fullName)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Arial, Helvetica, sans-serif;
    color: #111827;
    margin: 0 auto;
    padding: 48px 56px;
    max-width: 780px;
    position: relative;
  }
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    height: 320px;
    border-radius: 9999px;
    border: 2px solid #e5e7eb;
    opacity: 0.35;
    z-index: -1;
  }
  header.doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }
  .brand { display: flex; align-items: flex-start; gap: 14px; }
  .brand-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: #312e81;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }
  .brand-title { font-size: 22px; font-weight: 800; letter-spacing: 0.3px; }
  .brand-subtitle { font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin-top: 2px; }
  .badge {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 10px;
    border-radius: 4px;
    background: #fee2e2;
    color: #b91c1c;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }
  .doc-meta { text-align: right; font-size: 12px; color: #374151; line-height: 1.7; }
  .doc-meta b { font-weight: 700; }
  hr.divider { border: none; border-top: 2px solid #111827; margin: 6px 0 24px; }
  .info-grid { display: flex; justify-content: space-between; gap: 40px; margin-bottom: 28px; }
  .info-col { flex: 1; font-size: 12.5px; }
  .info-row { display: flex; margin-bottom: 10px; }
  .info-label { width: 130px; flex-shrink: 0; color: #64748b; font-weight: 700; letter-spacing: 0.3px; font-size: 11px; text-transform: uppercase; }
  .info-value { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead tr { background: #f8fafc; }
  th, td { border: 1px solid #e2e8f0; padding: 9px 10px; font-size: 12.5px; text-align: left; }
  th { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b; font-weight: 700; }
  td.center, th.center { text-align: center; }
  td.subject-name { font-weight: 600; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 56px; }
  .totals-box { min-width: 260px; font-size: 12.5px; }
  .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
  .totals-row b { font-weight: 700; }
  .totals-row.cgpa { border-top: 1px solid #cbd5e1; margin-top: 4px; padding-top: 10px; font-size: 14px; color: #312e81; font-weight: 800; }
  .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
  .sig-block { width: 210px; text-align: center; }
  .sig-name-script { font-family: "Brush Script MT", cursive; font-size: 22px; margin-bottom: 6px; color: #1e293b; }
  .sig-line { border-top: 1px solid #94a3b8; padding-top: 6px; }
  .sig-name { font-size: 11.5px; font-weight: 700; }
  .sig-title { font-size: 10px; color: #64748b; }
  .seal {
    width: 92px;
    height: 92px;
    border-radius: 9999px;
    border: 2px dashed #a5b4fc;
    color: #4338ca;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 8px;
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: 0.3px;
    padding: 6px;
  }
  .disclaimer { text-align: center; font-size: 10px; font-style: italic; color: #94a3b8; line-height: 1.6; }
  @media print {
    body { padding: 24px 32px; }
    @page { size: A4 portrait; margin: 14mm; }
  }
</style>
</head>
<body>
  <div class="watermark"></div>
 
  <header class="doc-header">
    <div class="brand">
      <div class="brand-icon">&#127891;</div>
      <div>
        <div class="brand-title">UNIVERSITY OF TECHNOLOGY</div>
        <div class="brand-subtitle">OFFICIAL ACADEMIC TRANSCRIPT</div>
        <span class="badge">CONFIDENTIAL</span>
      </div>
    </div>
    <div class="doc-meta">
      <div><b>Date of Issue:</b> ${issueDate}</div>
      <div><b>Document ID:</b> ${documentId}</div>
    </div>
  </header>
  <hr class="divider" />
 
  <div class="info-grid">
    <div class="info-col">
      <div class="info-row"><span class="info-label">Student Name</span><span class="info-value">: ${escapeHtml(student.fullName)}</span></div>
      <div class="info-row"><span class="info-label">Student ID</span><span class="info-value">: ${escapeHtml(student.studentId)}</span></div>
      <div class="info-row"><span class="info-label">National ID</span><span class="info-value">: ${escapeHtml(student.nationalId)}</span></div>
    </div>
    <div class="info-col">
      <div class="info-row"><span class="info-label">Degree Program</span><span class="info-value">: ${escapeHtml(student.degreeProgram)}</span></div>
      <div class="info-row"><span class="info-label">Academic Year</span><span class="info-value">: ${escapeHtml(student.academicYear)}</span></div>
      <div class="info-row"><span class="info-label">Semester</span><span class="info-value">: ${escapeHtml(student.semester)}</span></div>
    </div>
  </div>
 
  <table>
    <thead>
      <tr>
        <th class="center">No.</th>
        <th>Subject Code</th>
        <th>Subject</th>
        <th class="center">Credit</th>
        <th class="center">Score</th>
        <th class="center">Grade</th>
        <th class="center">GPA</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
 
  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Total Credits Earned</span><b>: ${totalCredits}</b></div>
      <div class="totals-row"><span>Semester GPA</span><b>: ${semesterGpa !== null ? semesterGpa.toFixed(2) : "—"}</b></div>
      <div class="totals-row cgpa"><span>Cumulative CGPA</span><span>: ${cumulativeCgpa.toFixed(2)}</span></div>
    </div>
  </div>
 
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-name-script">S.M. Williams</div>
      <div class="sig-line">
        <div class="sig-name">SARAH M. WILLIAMS</div>
        <div class="sig-title">ACADEMIC REGISTRAR</div>
      </div>
    </div>
    <div class="seal">OFFICIAL SEAL<br />UNIVERSITY OF<br />TECHNOLOGY</div>
    <div class="sig-block">
      <div class="sig-name-script">Dr. R. Chen</div>
      <div class="sig-line">
        <div class="sig-name">DR. CHEN PHIRUM</div>
        <div class="sig-title">DEAN, FACULTY OF IT</div>
      </div>
    </div>
  </div>
 
  <p class="disclaimer">
    Any alteration or erasure of this document renders it invalid. This transcript is official only if it bears the original university seal and
    authorized signatures. For verification, please contact the Registrar&apos;s Office at verify@utech.edu.
  </p>
</body>
</html>`;
 
  const win = window.open("", "_blank", "width=850,height=1100");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // Give the new document a tick to render before invoking print.
  win.onload = () => win.print();
  setTimeout(() => win.print(), 300);
}
