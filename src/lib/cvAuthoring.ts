import type { CvLanguage } from './cvVersions';

export type CvRow = { title: string; period: string; details: string; tools: string; role: string };
export type CvSection = { title: string; text: string; style: 'entries' | 'history' | 'table'; rows: CvRow[] };
export type CvDraft = { name: string; metadata: string; intro: string; sections: CvSection[] };

export const emptyCvRow: CvRow = { title: '', period: '', details: '', tools: '', role: '' };
export const cvRowFields = ['title', 'period', 'details', 'tools', 'role'] as const;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseCvDraft(value: unknown): CvDraft | null {
  if (typeof value !== 'string' || value.length > 65000) return null;
  try {
    const draft: unknown = JSON.parse(value);
    if (!record(draft) || typeof draft.name !== 'string' || !draft.name.trim() || typeof draft.metadata !== 'string' ||
      typeof draft.intro !== 'string' || !Array.isArray(draft.sections)) return null;
    const valid = draft.sections.every((section: unknown) => record(section) &&
      typeof section.title === 'string' && typeof section.text === 'string' &&
      (section.style === 'entries' || section.style === 'history' || section.style === 'table') &&
      Array.isArray(section.rows) && section.rows.every((row: unknown) =>
        record(row) && cvRowFields.every(field => typeof row[field] === 'string')));
    return valid ? draft as CvDraft : null;
  } catch {
    return null;
  }
}

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const html = (text: string) => text.replace(/[&<>"']/g, char => entities[char]);
const textBlock = (text: string) => text.trim() ? `<p class="text">${html(text.trim())}</p>` : '';

function cvSectionMarkup(section: CvSection, language: CvLanguage) {
  const rows = section.rows.filter(row => cvRowFields.some(key => row[key].trim()));
  if (!section.text.trim() && !rows.length) return '';
  const heading = section.title.trim() ? `<h2>${html(section.title)}</h2>` : '';
  if (language === 'ja' && section.style !== 'entries') {
    const history = section.style === 'history';
    const tableHeading = history ? ['期間', '会社名'] : ['期間', '職務内容', '環境', '役割・規模'];
    const table = rows.length ? `<table class="${history ? 'history' : 'work'}">
      <thead><tr>${tableHeading.map(column => `<th scope="col">${column}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(row => {
        const details = row.title.trim() ? `<strong>${html(row.title)}</strong>${textBlock(row.details)}` : html(row.details);
        const cells = history ? [html(row.period), html(row.title)] : [html(row.period), details, html(row.tools), html(row.role)];
        return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table>` : '';
    return `<section${rows.length === 1 ? ' class="single-table"' : ''}>${heading}${textBlock(section.text)}${table}</section>`;
  }
  const entries = rows.map(row => `<div class="entry">
    <div class="entry-head"><strong>${html(row.title)}</strong><span>${html(row.period)}</span></div>
    ${row.role.trim() ? `<i>${html(row.role)}</i>` : ''}
    ${textBlock(row.tools)}
    ${row.details.trim() ? `<ul>${row.details.split('\n').filter(line => line.trim()).map(line => `<li>${html(line.trim())}</li>`).join('')}</ul>` : ''}
  </div>`).join('');
  return `<section>${heading}${textBlock(section.text)}${entries}</section>`;
}

export function renderCvHtml(draft: CvDraft, language: CvLanguage) {
  const japanese = language === 'ja';
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(draft.name)} - ${japanese ? '職務経歴書' : 'CV'}</title>
  <style>
    * { box-sizing:border-box; }
    body { margin:0; background:#e3e5e8; color:#111; font:9pt/1.36 "Times New Roman",serif; }
    article { background:white; width:min(100%,210mm); min-height:297mm; margin:auto; padding:11mm 9mm; overflow-wrap:anywhere; }
    header { margin-bottom:3mm; }
    h1 { margin:0 0 1.4mm; font-size:18pt; line-height:1.12; text-transform:uppercase; }
    h2 { font-size:11pt; line-height:1.2; border-bottom:1px solid #111; margin:3.5mm 0 1.8mm; padding-bottom:.6mm; break-after:avoid; }
    p { margin:0; } .text,.meta { white-space:pre-wrap; } .meta { color:#444; }
    .entry { margin:0 0 2mm; } .entry-head { display:flex; justify-content:space-between; gap:5mm; break-after:avoid; }
    .entry-head span { text-align:right; } i { display:block; break-after:avoid; }
    ul { margin:.6mm 0 0; padding-left:3.7mm; } li { break-inside:avoid; }
    .ja { font:10pt/1.45 "Yu Mincho","Hiragino Mincho ProN","Noto Serif CJK JP",Meiryo,serif; }
    .ja article { padding:24mm 17mm 17mm 20mm; }
    .ja h1 { text-align:center; font-size:16pt; margin-bottom:4mm; }
    .ja h2 { border:0; font-size:10pt; margin:3.5mm 0 .7mm; padding:0; }
    .ja h2::before { content:"■"; margin-right:1mm; } .ja .meta { text-align:right; color:#111; }
    table { border-collapse:collapse; width:100%; margin-top:1mm; table-layout:fixed; font-size:9.5pt; }
    th,td { border:1px solid #222; padding:.65mm 1.5mm; vertical-align:top; white-space:pre-wrap; }
    th { background:#d4d4d4; } .history th:first-child { width:25%; } .work th:first-child { width:16%; }
    .work th:nth-child(2) { width:43%; } .work th:nth-child(3) { width:20%; } td .text { margin-top:.5mm; }
    @page { size:A4; margin:11mm 9mm; }
    @page japanese { size:A4; margin:17mm 17mm 17mm 20mm; }
    @media print {
      body { background:white; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
      article, .ja article { width:auto; margin:0; min-height:0; padding:0; }
      .ja article { page:japanese; } .ja header { padding-top:7mm; } thead { display:table-header-group; }
      tr, .single-table { break-inside:avoid; }
    }
  </style></head><body${japanese ? ' class="ja"' : ''}><article>
  <header><h1>${japanese ? '職務経歴書' : html(draft.name)}</h1>
  <p class="meta">${html(japanese ? [draft.metadata, `氏名：${draft.name}`].filter(Boolean).join('\n') : draft.metadata)}</p></header>
  ${japanese && draft.intro.trim() ? '<h2>職務経歴</h2>' : ''}${textBlock(draft.intro)}
  ${draft.sections.map(section => cvSectionMarkup(section, language)).join('')}
  </article></body></html>`;
}
