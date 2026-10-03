const state = {
  language: localStorage.getItem('goatfell-language') || 'en',
  role: localStorage.getItem('goatfell-role') || 'goatfell',
  currentView: 'overview',
  orderFilter: 'all',
  ceFilter: 'all',
  specOrderId: localStorage.getItem('goatfell-spec-order') || 'GF-2607-01',
  specContentLanguage: localStorage.getItem('goatfell-spec-content-language') || 'en',
  search: '',
  presentationPartner: sessionStorage.getItem('goatfell-presentation-partner') || '',
  pendingUpload: null,
  currentUserId: localStorage.getItem('goatfell-current-user') || 'USR-ADAM',
  users: JSON.parse(localStorage.getItem('goatfell-users') || 'null') || [
    { id: 'USR-ADAM', name: 'Adam', email: 'demo-admin@example.com', organisation: 'Goatfell UK', role: 'Administrator', boundary: 'goatfell', orders: ['all'], status: 'active' },
    { id: 'USR-JUSTIN', name: 'Justin', email: 'demo-manager@example.com', organisation: 'Goatfell UK', role: 'Project manager', boundary: 'goatfell', orders: ['all'], status: 'active' },
    { id: 'USR-SEPH', name: 'Partner A OEM', email: 'partner-a@example.com', organisation: 'Partner A', role: 'OEM collaborator', boundary: 'sephiroth', orders: ['GF-2607-01', 'GF-2606-04', 'GF-2606-02'], status: 'active' },
    { id: 'USR-EARTH', name: 'Partner B OEM', email: 'partner-b@example.com', organisation: 'Partner B', role: 'OEM collaborator', boundary: 'earthstorm', orders: ['GF-2605-08', 'GF-2605-03'], status: 'invited' },
    { id: 'USR-FREIGHT', name: 'Freight Partner', email: 'freight@example.com', organisation: 'Freight Partner', role: 'Freight collaborator', boundary: 'freight', orders: ['GF-2605-08', 'GF-2605-03'], status: 'active' }
  ],
  tasks: JSON.parse(localStorage.getItem('goatfell-tasks') || 'null') || [
    { id: 1, title: 'Confirm leg quantity and X-frame design', order: 'GF-2607-01', due: 'Today', owner: 'Goatfell', done: false },
    { id: 2, title: 'Approve revised fitment drawing v3', order: 'GF-2606-04', due: 'Tomorrow', owner: 'Goatfell', done: false },
    { id: 3, title: 'Upload production completion video', order: 'GF-2606-02', due: '03 Oct', owner: 'Partner A', done: false },
    { id: 4, title: 'Confirm factory pickup window', order: 'GF-2605-08', due: '05 Oct', owner: 'Freight Partner', done: true }
  ],
  certificates: JSON.parse(localStorage.getItem('goatfell-certificates') || 'null') || [
    { id: 1, oem: 'Partner A', model: 'LUX', component: 'Inverter / charger', document: 'EU Declaration of Conformity', ref: 'SEP-INV-26-04', status: 'verified', review: '30 Apr 2027' },
    { id: 2, oem: 'Partner A', model: 'LUX', component: 'Induction hob', document: 'CE declaration', ref: 'SEP-HOB-25-11', status: 'review', review: '18 Oct 2026' },
    { id: 3, oem: 'Partner A', model: 'LUX', component: 'CO₂ detector', document: 'Test report', ref: '—', status: 'missing', review: 'Required now' },
    { id: 4, oem: 'Partner B', model: 'INDIE', component: 'Diesel heater', document: 'CE declaration', ref: 'ES-DH-2601', status: 'verified', review: '12 Jan 2028' },
    { id: 5, oem: 'Partner B', model: 'INDIE', component: 'Solar controller', document: 'Technical file', ref: '—', status: 'missing', review: 'Required now' },
    { id: 6, oem: 'Partner B', model: 'INDIE', component: '240V sockets', document: 'Supplier declaration', ref: 'ES-SKT-2403', status: 'review', review: '04 Nov 2026' },
    { id: 7, oem: 'Legacy Partner', model: 'Legacy', component: 'Battery system', document: 'Historic declaration', ref: 'IO-2024-18', status: 'expired', review: 'Expired 02 Aug 2026' }
  ]
};

const signedInUser = state.users.find(user => user.id === state.currentUserId) || state.users[0];
if (signedInUser.boundary !== 'goatfell') state.role = signedInUser.boundary;
if (signedInUser.boundary === 'goatfell' && state.presentationPartner) state.role = state.presentationPartner;

const orders = JSON.parse(localStorage.getItem('goatfell-orders') || 'null') || [
  { id: 'GF-2607-01', unit: 'GF-LUX-026', model: 'LUX Compact', oem: 'Partner A', vehicle: 'Toyota Hilux · 2026', customer: 'Demo Customer A', stage: 'Quote review', status: 'attention', progress: 24, value: 0, cost: 0, next: 'Resolve 3 variances', date: '04 Oct 2026' },
  { id: 'GF-2606-04', unit: 'GF-LUX-025', model: 'LUX Extended', oem: 'Partner A', vehicle: 'Ford Ranger · 2025', customer: 'Demo Customer B', stage: 'Drawing approval', status: 'active', progress: 48, value: 0, cost: 0, next: 'Approve drawing v3', date: '02 Oct 2026' },
  { id: 'GF-2606-02', unit: 'GF-LUX-024', model: 'LUX Compact', oem: 'Partner A', vehicle: 'KGM Musso · 2026', customer: 'Demo Customer C', stage: 'Production', status: 'active', progress: 63, value: 0, cost: 0, next: 'Completion evidence', date: '08 Oct 2026' },
  { id: 'GF-2605-08', unit: 'GF-IND-014', model: 'INDIE Double-side', oem: 'Partner B', vehicle: 'Isuzu D-Max · 2025', customer: 'Demo Customer D', stage: 'Freight', status: 'active', progress: 82, value: 0, cost: 0, next: 'Confirm collection', date: '05 Oct 2026' },
  { id: 'GF-2605-03', unit: 'GF-IND-013', model: 'INDIE Triangle', oem: 'Partner B', vehicle: 'KGM Musso · 2025', customer: 'Demo Customer E', stage: 'UK warehouse', status: 'complete', progress: 94, value: 0, cost: 0, next: 'Customer PDI', date: '07 Oct 2026' },
  { id: 'GF-RPR-019', unit: 'Legacy Partner-LEG-008', model: 'Legacy repair', oem: 'Legacy Partner', vehicle: 'Toyota Hilux · 2023', customer: 'Demo Customer F', stage: 'Warranty repair', status: 'attention', progress: 35, value: 0, cost: 0, next: 'Replacement part ETA', date: '11 Oct 2026' }
];

function persistOrders() {
  localStorage.setItem('goatfell-orders', JSON.stringify(orders));
}

function vehicleLabel(value) {
  const label = String(value || '').trim();
  if (!label) return 'Pickup not recorded · Year n/a';
  return /\b(?:19|20)\d{2}\b/.test(label) ? label : `${label} · Year n/a`;
}

function oemKey(oem) {
  return ({ 'Partner A': 'sephiroth', 'Partner B': 'earthstorm', 'Legacy Partner': 'iood' })[oem] || 'other';
}

const sourceDocuments = JSON.parse(localStorage.getItem('goatfell-source-documents') || 'null') || [
  { id: 'DOC-REQ-2607', name: 'LUX customer specification.xlsx', kind: 'Customer specification', owner: 'Goatfell', orderIds: ['GF-2607-01'], specIds: 'all', version: 4, status: 'verified', updated: '30 Sep 2026', attached: false, versions: [{ version: 4, fileName: 'LUX customer specification.xlsx', at: '30 Sep 2026', actor: 'Adam · Goatfell', reason: 'Latest approved customer requirements' }] },
  { id: 'DOC-QUOTE-2607', name: 'Partner A quotation 10B13.pdf', kind: 'OEM quotation', owner: 'Partner A', orderIds: ['GF-2607-01'], specIds: 'all', version: 2, status: 'review', updated: '01 Oct 2026', attached: false, versions: [{ version: 2, fileName: 'Partner A quotation 10B13.pdf', at: '01 Oct 2026', actor: 'Partner A OEM', reason: 'OEM response under Goatfell review' }] },
  { id: 'DOC-MEASURE-2607', name: 'Toyota Hilux customer measurement form.xlsx', kind: 'Pickup measurement form', owner: 'Goatfell', orderIds: ['GF-2607-01'], specIds: ['DIM.BEDGAP', 'MOUNT.LEGS'], version: 1, status: 'verified', updated: '30 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'Toyota Hilux customer measurement form.xlsx', at: '30 Sep 2026', actor: 'Adam · Goatfell', reason: 'Design reference measurements supplied for this order' }] },
  { id: 'DOC-CONTRACT-2607', name: 'Procurement contract 10B12.pdf', kind: 'Procurement contract', owner: 'Goatfell', orderIds: ['GF-2607-01'], specIds: [], version: 1, status: 'verified', updated: '22 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'Procurement contract 10B12.pdf', at: '22 Sep 2026', actor: 'Adam · Goatfell', reason: 'Executed contract record' }] },
  { id: 'DOC-DRAWING-2606', name: 'LUX Extended fitment drawing.pdf', kind: 'Approval drawing', owner: 'Partner A', orderIds: ['GF-2606-04'], specIds: ['MOUNT.LEGS', 'DIM.BEDGAP'], version: 3, status: 'review', updated: '01 Oct 2026', attached: false, versions: [{ version: 3, fileName: 'LUX Extended fitment drawing.pdf', at: '01 Oct 2026', actor: 'Partner A OEM', reason: 'Revised mounting bracket geometry' }] },
  { id: 'DOC-ES-CONTRACT-2605', name: 'Partner B manufacturing contract.pdf', kind: 'Procurement contract', owner: 'Partner B', orderIds: ['GF-2605-08', 'GF-2605-03'], specIds: [], version: 1, status: 'verified', updated: '21 Apr 2026', attached: false, versions: [{ version: 1, fileName: 'Partner B manufacturing contract.pdf', at: '21 Apr 2026', actor: 'Partner B OEM', reason: 'Signed multi-unit contract' }] }
];

if (!sourceDocuments.some(document => document.id === 'DOC-MEASURE-2607')) {
  sourceDocuments.push({ id: 'DOC-MEASURE-2607', name: 'Toyota Hilux customer measurement form.xlsx', kind: 'Pickup measurement form', owner: 'Goatfell', orderIds: ['GF-2607-01'], specIds: ['DIM.BEDGAP', 'MOUNT.LEGS'], version: 1, status: 'verified', updated: '30 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'Toyota Hilux customer measurement form.xlsx', at: '30 Sep 2026', actor: 'Adam · Goatfell', reason: 'Design reference measurements supplied for this order' }] });
  localStorage.setItem('goatfell-source-documents', JSON.stringify(sourceDocuments));
}

[
  { id: 'DOC-CE-INV', name: 'Inverter EU Declaration of Conformity.pdf', kind: 'CE source certificate', owner: 'Partner A', orderIds: ['GF-2607-01', 'GF-2606-04', 'GF-2606-02'], specIds: ['ELEC.INVERTER'], version: 1, status: 'verified', updated: '30 Apr 2026', attached: false, versions: [{ version: 1, fileName: 'Inverter EU Declaration of Conformity.pdf', at: '30 Apr 2026', actor: 'Partner A OEM', reason: 'Certificate supplied for LUX inverter/charger' }] },
  { id: 'DOC-CE-HOB', name: 'Induction hob CE declaration.pdf', kind: 'CE source certificate', owner: 'Partner A', orderIds: ['GF-2607-01'], specIds: ['ELEC.HOB'], version: 1, status: 'review', updated: '18 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'Induction hob CE declaration.pdf', at: '18 Sep 2026', actor: 'Partner A OEM', reason: 'Review against quoted induction hob model' }] },
  { id: 'DOC-CE-CO2-REQ', name: 'LUX technical protocol — CO2 detector requirement.pdf', kind: 'Compliance requirement source', owner: 'Goatfell', orderIds: ['GF-2607-01'], specIds: ['SAFETY.CO2'], version: 2, status: 'verified', updated: '25 Sep 2026', attached: false, versions: [{ version: 2, fileName: 'LUX technical protocol — CO2 detector requirement.pdf', at: '25 Sep 2026', actor: 'Justin · Goatfell', reason: 'Source requirement; OEM certificate remains missing' }] },
  { id: 'DOC-CE-HEATER', name: 'Diesel heater CE declaration.pdf', kind: 'CE source certificate', owner: 'Partner B', orderIds: ['GF-2605-08', 'GF-2605-03'], specIds: ['HEAT.DIESEL'], version: 1, status: 'verified', updated: '12 Jan 2026', attached: false, versions: [{ version: 1, fileName: 'Diesel heater CE declaration.pdf', at: '12 Jan 2026', actor: 'Partner B OEM', reason: 'Certificate supplied for INDIE diesel heater' }] },
  { id: 'DOC-PROD-ELEC', name: 'LUX electrical function test.pdf', kind: 'Production evidence', owner: 'Partner A', orderIds: ['GF-2606-04'], specIds: [], version: 1, status: 'verified', updated: '30 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'LUX electrical function test.pdf', at: '30 Sep 2026', actor: 'Partner A OEM', reason: 'Electrical evidence submitted for production gate' }] },
  { id: 'DOC-INSPECT-LUX', name: 'LUX factory inspection checklist.docx', kind: 'Inspection source', owner: 'Goatfell', orderIds: ['GF-2606-02'], specIds: [], version: 2, status: 'review', updated: '30 Sep 2026', attached: false, versions: [{ version: 2, fileName: 'LUX factory inspection checklist.docx', at: '30 Sep 2026', actor: 'Justin · Goatfell', reason: 'Current inspection checklist and actions' }] },
  { id: 'DOC-DELIVERY-FEEDBACK', name: 'Camper delivery feedback.xlsx', kind: 'Repair source', owner: 'Goatfell', orderIds: ['GF-RPR-019'], specIds: [], version: 3, status: 'verified', updated: '28 Sep 2026', attached: false, versions: [{ version: 3, fileName: 'Camper delivery feedback.xlsx', at: '28 Sep 2026', actor: 'Adam · Goatfell', reason: 'Original evidence for Legacy Partner warranty case' }] },
  { id: 'DOC-INDIE-FEEDBACK', name: 'INDIE delivery feedback.xlsx', kind: 'Repair source', owner: 'Goatfell', orderIds: ['GF-2605-03'], specIds: [], version: 1, status: 'verified', updated: '12 Sep 2026', attached: false, versions: [{ version: 1, fileName: 'INDIE delivery feedback.xlsx', at: '12 Sep 2026', actor: 'Adam · Goatfell', reason: 'Order-specific evidence for INDIE corrective action' }] }
].forEach(document => {
  if (!sourceDocuments.some(existing => existing.id === document.id)) sourceDocuments.push(document);
});
persistSourceDocuments();

const certificateSourceMap = { 1: 'DOC-CE-INV', 2: 'DOC-CE-HOB', 3: 'DOC-CE-CO2-REQ', 4: 'DOC-CE-HEATER', 5: 'DOC-ES-CONTRACT-2605', 6: 'DOC-ES-CONTRACT-2605', 7: 'DOC-ES-CONTRACT-2605' };
state.certificates.forEach(certificate => { if (!certificate.sourceId) certificate.sourceId = certificateSourceMap[certificate.id]; });
localStorage.setItem('goatfell-certificates', JSON.stringify(state.certificates));

function persistSourceDocuments() {
  localStorage.setItem('goatfell-source-documents', JSON.stringify(sourceDocuments));
}

function documentsForOrder(orderId) {
  return sourceDocuments.filter(doc => doc.orderIds.includes(orderId) && canAccessSourceDocument(doc));
}

function documentsForSpec(specId) {
  return sourceDocuments.filter(doc => (doc.specIds === 'all' || doc.specIds.includes(specId)) && canAccessSourceDocument(doc));
}

function canAccessOrder(order) {
  if (!order) return false;
  if (order.archivedAt && state.role !== 'goatfell') return false;
  if (state.role === 'goatfell') return true;
  const roleAllows = state.role === 'sephiroth' ? order.oem === 'Partner A'
    : state.role === 'earthstorm' ? order.oem === 'Partner B'
      : state.role === 'freight' && ['Freight', 'UK warehouse'].includes(order.stage);
  if (!roleAllows) return false;
  const user = state.users.find(item => item.id === state.currentUserId);
  if (!user || user.boundary === 'goatfell') return true;
  return user.orders.includes('all') || user.orders.includes(order.id);
}

function canAccessSourceDocument(documentRecord) {
  if (!documentRecord) return false;
  if (state.role === 'goatfell') return true;
  const linkedOrders = documentRecord.orderIds.map(id => orders.find(order => order.id === id)).filter(Boolean);
  if (state.role === 'freight') return linkedOrders.some(order => canAccessOrder(order)) && /shipping|packing|collection|invoice|delivery/i.test(`${documentRecord.kind} ${documentRecord.name}`);
  return linkedOrders.some(order => canAccessOrder(order));
}

function restrictedView(kicker, title, message) {
  return `${pageHead(kicker, title, message)}<div class="privacy-banner">◉ This account has no assigned records in this portfolio view.</div><section class="panel"><div class="empty-state"><strong>Nothing shared with this organisation</strong>Use Orders to open work assigned to this account. Goatfell-private and other partner records remain hidden.</div></section>`;
}

function openFileDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('goatfell-source-files', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeSourceFile(documentId, file) {
  const database = await openFileDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction('files', 'readwrite');
    transaction.objectStore('files').put(file, documentId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function getSourceFile(documentId) {
  const database = await openFileDatabase();
  const file = await new Promise((resolve, reject) => {
    const request = database.transaction('files').objectStore('files').get(documentId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file;
}

async function deleteSourceFile(documentId) {
  const database = await openFileDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction('files', 'readwrite');
    transaction.objectStore('files').delete(documentId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

function recordDeletion(kind, target, reason, snapshot = {}) {
  const audit = JSON.parse(localStorage.getItem('goatfell-deletion-audit') || '[]');
  audit.unshift({ id: Date.now(), kind, target, reason, actor: actorName(), at: nowLabel(), snapshot });
  localStorage.setItem('goatfell-deletion-audit', JSON.stringify(audit.slice(0, 100)));
}

const privateDocumentTypes = ['Customer contract', 'Customer identity', 'Sales / finance', 'Expense / reimbursement', 'Internal note'];
const audienceOem = { sephiroth: 'Partner A', earthstorm: 'Partner B' };

async function inspectUpload(file, context) {
  const failures = []; const warnings = []; const passes = []; const metadataFlags = [];
  const extension = (file.name.split('.').pop() || '').toLowerCase();
  const allowed = ['pdf','xlsx','xls','docx','doc','jpg','jpeg','png'];
  if (!file.size) failures.push('The file is empty.'); else passes.push(`File contains ${(file.size / 1024).toFixed(1)} KB of data.`);
  if (!allowed.includes(extension)) failures.push(`.${extension || 'unknown'} files are not supported.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ascii = new TextDecoder('latin1').decode(bytes);
  const starts = (...values) => values.every((value, index) => bytes[index] === value);
  const signatureOk = extension === 'pdf' ? ascii.startsWith('%PDF-')
    : extension === 'png' ? starts(0x89,0x50,0x4e,0x47)
      : ['jpg','jpeg'].includes(extension) ? starts(0xff,0xd8,0xff)
        : ['xlsx','docx'].includes(extension) ? starts(0x50,0x4b)
          : ['xls','doc'].includes(extension) ? starts(0xd0,0xcf,0x11,0xe0) : false;
  if (allowed.includes(extension) && !signatureOk) failures.push(`The file content does not match its .${extension} extension.`); else if (signatureOk) passes.push('File signature matches the extension.');
  let sheetNames = [];
  if (extension === 'xlsx' && signatureOk) {
    if (!ascii.includes('xl/workbook.xml') || !ascii.includes('[Content_Types].xml')) failures.push('The XLSX package is missing its workbook structure and may be corrupt or password-protected.');
    else {
      const sheetFiles = [...ascii.matchAll(/xl\/worksheets\/sheet(\d+)\.xml/g)].map(match => Number(match[1]));
      sheetNames = [...new Set(sheetFiles)].sort((a,b) => a-b).map(number => `Sheet ${number}`);
      passes.push(`Workbook package is readable; ${sheetNames.length || 1} worksheet structure${sheetNames.length === 1 ? '' : 's'} detected.`);
    }
  }
  if (extension === 'docx' && signatureOk && !ascii.includes('word/document.xml')) failures.push('The DOCX package is missing its main document and may be corrupt or password-protected.');
  const packageChecks = [
    [/\/(comments\d*\.xml|comments\.xml)/i, 'comments or review notes'],
    [/\/(persons\/|people\.xml)/i, 'person/author records'],
    [/\/(docProps\/|core\.xml|app\.xml)/i, 'document properties'],
    [/\/(externalLinks\/|externalLink\d*\.xml)/i, 'external workbook links'],
    [/\/(media\/|image\d+\.)/i, 'embedded images or media']
  ];
  if (['xlsx','docx'].includes(extension) && signatureOk) packageChecks.forEach(([pattern, label]) => { if (pattern.test(ascii)) metadataFlags.push(label); });
  if (metadataFlags.length) warnings.push(`Package contains ${metadataFlags.join(', ')}. Review or sanitise them before external sharing.`);
  const yearMatches = [...file.name.matchAll(/(?:19|20|29)\d{2}/g)].map(match => Number(match[0]));
  const suspiciousYears = yearMatches.filter(year => year > new Date().getFullYear() + 2 || year < 2000);
  if (suspiciousYears.length) warnings.push(`Filename contains unusual year ${suspiciousYears.join(', ')}; confirm this is not a date typo.`);
  if (extension === 'pdf' && context.audience !== 'goatfell') warnings.push('PDF metadata and hidden annotations require a full production scanner before external release.');
  const order = orders.find(item => item.id === context.orderId);
  if (!order) failures.push('Select a valid order.');
  if (context.recordOrderIds?.length && !context.recordOrderIds.includes(context.orderId)) failures.push(`The selected order does not match this source record (${context.recordOrderIds.join(', ')}). Create a separate order document instead.`);
  if (privateDocumentTypes.includes(context.documentType) && context.audience !== 'goatfell') failures.push(`${context.documentType} is Goatfell-private and cannot be shared with an external organisation.`);
  if (order && audienceOem[context.audience] && order.oem !== audienceOem[context.audience]) failures.push(`This ${order.oem} order cannot be shared with ${audienceOem[context.audience]}.`);
  if (order && audienceOem[context.owner] && order.oem !== audienceOem[context.owner]) failures.push(`The selected owner does not match the order's OEM (${order.oem}).`);
  if (context.audience === 'freight' && !/shipping|freight|delivery/i.test(context.documentType)) failures.push('Freight access is limited to shipping and delivery documents.');
  if (!failures.length && context.audience !== 'goatfell') warnings.push('External sharing remains staged until a Goatfell user confirms the audience after preview.');
  const checksumBytes = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const checksum = [...checksumBytes].slice(0, 8).map(value => value.toString(16).padStart(2, '0')).join('');
  return { ok: failures.length === 0, failures, warnings, passes, sheetNames, metadataFlags, checksum, extension, size: file.size };
}

function showUploadReview(pending) {
  const result = pending.result;
  const rows = [['File', pending.file.name], ['Order', pending.orderId], ['Document type', pending.documentType], ['Owner', pending.owner], ['Intended audience', pending.audienceLabel], ['Checksum', result.checksum], ['Preview', result.sheetNames.length ? result.sheetNames.join(', ') : 'Metadata and signature preview']];
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">UPLOAD SAFETY ASSISTANT</span><h2>${result.ok ? 'Preflight passed' : 'Upload quarantined'}</h2><p>No file is shared automatically</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="safety-status ${result.ok ? 'safe' : 'blocked'}"><strong>${result.ok ? 'Ready for Goatfell confirmation' : 'Sharing blocked'}</strong><span>${result.ok ? 'Review the file context and intended audience below.' : 'Correct the problems before creating a document version.'}</span></div><div class="preview-sheet">${rows.map((row,index) => `<div class="${index === 0 ? 'header' : ''}"><span>${escapeHTML(row[0])}</span><span>${escapeHTML(row[1])}</span></div>`).join('')}</div><div class="section-label">Validation report</div><div class="validation-list">${result.failures.map(message => `<div class="validation-item blocked">× ${escapeHTML(message)}</div>`).join('')}${result.warnings.map(message => `<div class="validation-item warning">! ${escapeHTML(message)}</div>`).join('')}${result.passes.map(message => `<div class="validation-item passed">✓ ${escapeHTML(message)}</div>`).join('')}</div><div class="head-actions source-actions"><button class="btn secondary" data-action="discard-upload">Cancel upload</button>${result.ok ? '<button class="btn primary" data-action="confirm-upload">Confirm and stage version</button>' : '<button class="btn primary" data-action="retry-upload">Choose another file</button>'}</div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

async function confirmPendingUpload() {
  const pending = state.pendingUpload; if (!pending || !pending.result.ok) return;
  const documentRecord = sourceDocuments.find(document => document.id === pending.documentId); if (!documentRecord) return;
  await storeSourceFile(pending.documentId, pending.file);
  const wasAttached = documentRecord.attached; if (wasAttached) documentRecord.version += 1;
  documentRecord.attached = true; documentRecord.name = pending.file.name; documentRecord.updated = nowLabel(); documentRecord.status = 'review'; documentRecord.audience = pending.audience;
  documentRecord.lastInspection = { checksum: pending.result.checksum, extension: pending.result.extension, size: pending.result.size, sheetNames: pending.result.sheetNames, metadataFlags: pending.result.metadataFlags, warnings: pending.result.warnings, audience: pending.audience, checkedAt: new Date().toISOString() };
  const versionRecord = { version: documentRecord.version, fileName: pending.file.name, at: nowLabel(), actor: actorName(), reason: `${pending.reason} · Safety check ${pending.result.checksum} · audience ${pending.audienceLabel}` };
  if (wasAttached) documentRecord.versions.push(versionRecord); else documentRecord.versions[documentRecord.versions.length - 1] = versionRecord;
  const events = JSON.parse(localStorage.getItem('goatfell-upload-audit') || '[]'); events.push({ at: new Date().toISOString(), documentId: pending.documentId, orderId: pending.orderId, audience: pending.audience, checksum: pending.result.checksum, outcome: 'staged-for-review' }); localStorage.setItem('goatfell-upload-audit', JSON.stringify(events));
  state.pendingUpload = null; persistSourceDocuments(); renderAll(); openSourceDocument(documentRecord.id); showToast('Version staged safely', 'The file passed preflight and remains under review; it was not automatically shared.');
}

const demoSourcePreviews = {
  'DOC-REQ-2607': [['Item', 'Customer requirement'], ['Mounting legs', '4 removable legs + X-frame'], ['CEE charging', 'Male connector on camper'], ['Cab-to-camper gap', '< 20 mm'], ['Projector', 'English interface']],
  'DOC-QUOTE-2607': [['Quoted item', 'OEM response'], ['Mounting legs', '4 legs'], ['CEE charging', 'Not stated'], ['Cab-to-camper gap', '< 20 (unit omitted)'], ['Projector', 'English interface']],
  'DOC-MEASURE-2607': [['Measurement', 'Recorded value'], ['Pickup', 'Toyota Hilux · 2026'], ['Bed length', 'Customer measurement pending import'], ['Bed width', 'Customer measurement pending import'], ['Cab-to-bed reference', 'Verify against uploaded form']],
  'DOC-CE-INV': [['Certificate field', 'Recorded value'], ['Component', 'Inverter / charger'], ['Reference', 'SEP-INV-26-04'], ['Status', 'Verified'], ['OEM', 'Partner A']],
  'DOC-CE-HOB': [['Certificate field', 'Recorded value'], ['Component', 'Induction hob'], ['Reference', 'SEP-HOB-25-11'], ['Status', 'Review due'], ['OEM', 'Partner A']],
  'DOC-CE-CO2-REQ': [['Requirement field', 'Recorded value'], ['Component', 'CO₂ detector'], ['Required evidence', 'Test report / declaration'], ['Requirement source', 'LUX technical protocol'], ['Certificate status', 'Missing from OEM']]
};

function previewSourceDocument(id) {
  const documentRecord = sourceDocuments.find(document => document.id === id); if (!documentRecord) return;
  if (!canAccessSourceDocument(documentRecord)) return showToast('Access denied', 'This source file is outside the active organisation and assigned orders.');
  const rows = demoSourcePreviews[id] || [['Record', 'Value'], ['Document', documentRecord.name], ['Type', documentRecord.kind], ['Owner', documentRecord.owner], ['Status', documentRecord.status]];
  const inspection = documentRecord.lastInspection;
  const inspectionRows = inspection ? [['Validation-backed preview', `Checked ${new Date(inspection.checkedAt).toLocaleString()}`], ['Checksum', inspection.checksum], ['Detected type', `.${inspection.extension} · ${(inspection.size / 1024).toFixed(1)} KB`], ['Workbook structure', inspection.sheetNames?.join(', ') || 'Not applicable'], ['Metadata/privacy flags', inspection.metadataFlags?.join(', ') || 'None detected'], ['Intended audience', inspection.audience]] : [];
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">${inspection ? 'VALIDATION-BACKED PREVIEW' : 'DEMO CONTENT PREVIEW'} · v${documentRecord.version}</span><h2>${escapeHTML(documentRecord.name)}</h2><p>Values traced to this source record</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="source-notice">${inspection ? 'This summary comes from the staged original and its safety inspection. Office files are downloaded for full visual review; this prototype does not pretend to render them.' : 'This structured demonstration is not the original file. Attach the source to create a validation-backed preview.'}</div>${inspectionRows.length ? `<div class="preview-sheet">${inspectionRows.map((row, index) => `<div class="${index === 0 ? 'header' : ''}"><span>${escapeHTML(row[0])}</span><span>${escapeHTML(row[1])}</span></div>`).join('')}</div><div class="section-label">Extracted / recorded values</div>` : ''}<div class="preview-sheet">${rows.map((row, index) => `<div class="${index === 0 ? 'header' : ''}"><span>${escapeHTML(row[0])}</span><span>${escapeHTML(row[1])}</span></div>`).join('')}</div><div class="section-label">File actions</div><div class="head-actions"><button class="btn secondary" data-source-doc="${escapeHTML(id)}">Back to source record</button>${documentRecord.attached ? `<button class="btn secondary" data-action="open-source" data-doc-target="${escapeHTML(id)}">Open / download original</button>` : ''}<button class="btn primary" data-action="upload-source" data-doc-target="${escapeHTML(id)}">${documentRecord.attached ? 'Upload revised version' : 'Attach original file'}</button></div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

const specs = JSON.parse(localStorage.getItem('goatfell-specs') || 'null') || [
  { id: 'MOUNT.LEGS', item: 'Mounting legs', zh: '支撑腿', request: '4 removable legs + X-frame', oem: '4 legs', unit: 'pcs', status: 'changed', source: 'Customer spec', owner: 'Adam' },
  { id: 'ELEC.CEE', item: 'CEE charging connector', zh: 'CEE充电接口', request: 'Male connector on camper', oem: 'Not stated', unit: '1 pc', status: 'missing', source: 'Technical protocol', owner: 'Justin' },
  { id: 'DIM.BEDGAP', item: 'Cab-to-camper gap', zh: '驾驶室与房箱间隙', request: '< 20 mm', oem: '< 20', unit: 'Missing', status: 'changed', source: 'Measurement form', owner: 'Adam' },
  { id: 'MEDIA.PROJECTOR', item: 'Projector language', zh: '投影仪语言', request: 'English interface', oem: 'English interface', unit: '—', status: 'match', source: 'Customer spec', owner: '—' },
  { id: 'WATER.TANK', item: 'Fresh water tank', zh: '净水箱', request: '70 litres', oem: '70 litres', unit: 'L', status: 'match', source: 'Customer spec', owner: '—' },
  { id: 'ELEC.SOLAR', item: 'Solar panels', zh: '太阳能板', request: '400 W total', oem: '2 × 200 W', unit: 'W', status: 'match', source: 'OEM quote', owner: '—' },
  { id: 'EXT.STEP', item: 'Rear access step', zh: '后部登车踏步', request: 'TBC after drawing', oem: 'Excluded', unit: '1 pc', status: 'missing', source: 'Customer spec', owner: 'Justin' }
];

const specSegmentDefaults = {
  'MOUNT.LEGS': 'Vehicle fitment', 'DIM.BEDGAP': 'Vehicle fitment',
  'ELEC.CEE': 'Core & safety', 'WATER.TANK': 'Core & safety',
  'MEDIA.PROJECTOR': 'Customer-selected', 'ELEC.SOLAR': 'Customer-selected', 'EXT.STEP': 'Optional equipment'
};
const demoSpecTranslations = {
  'MOUNT.LEGS': { request: '4条可拆卸支撑腿及X形支架', oem: '4条支撑腿' },
  'ELEC.CEE': { request: '房箱上安装CEE公头充电接口', oem: '报价中未说明' },
  'DIM.BEDGAP': { request: '驾驶室与房箱间隙小于20毫米', oem: '小于20（单位缺失）' },
  'MEDIA.PROJECTOR': { request: '英文操作界面', oem: '英文操作界面' },
  'WATER.TANK': { request: '70升净水箱', oem: '70升' },
  'ELEC.SOLAR': { request: '太阳能板总功率400瓦', oem: '2块×200瓦' },
  'EXT.STEP': { request: '图纸确认后待定', oem: '不包含' }
};
specs.forEach(spec => {
  if (!spec.orderId) spec.orderId = 'GF-2607-01';
  if (!spec.segment) spec.segment = specSegmentDefaults[spec.id] || 'Customer-selected';
  if (!spec.locations) spec.locations = {};
  if (!spec.translations) spec.translations = { zh: demoSpecTranslations[spec.id] || { request: '', oem: '' } };
});
localStorage.setItem('goatfell-specs', JSON.stringify(specs));

function specsForOrder(orderId) {
  return specs.filter(spec => spec.orderId === orderId);
}

const specSegments = ['Core & safety', 'Vehicle fitment', 'Customer-selected', 'Optional equipment'];

function sourceLocationLabel(spec, documentRecord) {
  const pointer = spec.locations?.[documentRecord.id];
  if (pointer?.sheet || pointer?.cell || pointer?.page) return pointer.page ? `Page ${pointer.page}${pointer.section ? ` · ${pointer.section}` : ''}` : `${pointer.sheet || 'Sheet n/a'} · ${pointer.cell || 'row/column n/a'}`;
  return documentRecord.attached ? 'Sheet/page and row/column pending extraction' : 'Upload original to locate sheet, row and column';
}

function specLanguageValue(spec, field) {
  if (state.specContentLanguage === 'zh') return spec.translations?.zh?.[field] || `【待翻译】${spec[field]}`;
  return spec[field];
}

function specSourceTrace(spec) {
  const documents = documentsForSpec(spec.id).filter(document => document.orderIds.includes(spec.orderId));
  if (!documents.length) return '<div class="empty-state compact"><strong>No source linked</strong>Link a requirement or quotation source before approval.</div>';
  return `<div class="source-trace-list">${documents.map(document => `<div class="source-trace-row"><span><b>${escapeHTML(document.kind)}</b><small>${escapeHTML(sourceLocationLabel(spec, document))}</small></span><span class="head-actions">${document.attached ? `<button class="btn secondary mini" data-action="open-source" data-doc-target="${escapeHTML(document.id)}">Open original</button>` : `<button class="btn secondary mini" data-action="upload-source" data-doc-target="${escapeHTML(document.id)}">Upload original</button>`}<button class="btn secondary mini" data-source-doc="${escapeHTML(document.id)}">Details</button></span></div>`).join('')}</div>`;
}

function groupedSpecRows(orderSpecs) {
  return specSegments.map(segment => {
    const items = orderSpecs.filter(spec => spec.segment === segment);
    if (!items.length) return '';
    return `<tr class="spec-section"><td colspan="9"><strong>${escapeHTML(segment)}</strong><small>${segment === 'Core & safety' ? 'Normally required across builds' : segment === 'Vehicle fitment' ? 'Depends on pickup dimensions and interface' : segment === 'Customer-selected' ? 'Chosen or tailored per customer order' : 'May be included or excluded by quotation'}</small></td></tr>${items.map(s => `<tr class="variance-row ${s.status}" data-spec="${escapeHTML(s.id)}"><td><strong>${escapeHTML(s.id)}</strong></td><td><strong>${escapeHTML(state.specContentLanguage === 'zh' ? s.zh : s.item)}</strong><small>${escapeHTML(state.specContentLanguage === 'zh' ? s.item : s.zh)}</small></td><td>${escapeHTML(s.segment)}</td><td>${escapeHTML(specLanguageValue(s, 'request'))}</td><td class="${!['match','accepted'].includes(s.status) ? 'cell-diff' : ''}">${escapeHTML(specLanguageValue(s, 'oem'))}</td><td class="${s.unit === 'Missing' ? 'cell-diff' : ''}">${escapeHTML(s.unit)}</td><td><div class="source-pills">${sourcePills(documentsForSpec(s.id).filter(document => document.orderIds.includes(s.orderId)))}</div></td><td>${specStatusBadge(s)}</td><td>${escapeHTML(s.owner)}</td></tr>`).join('')}`;
  }).join('');
}

const specChanges = JSON.parse(localStorage.getItem('goatfell-spec-changes') || 'null') || [
  { id: 1, specId: 'MOUNT.LEGS', actor: 'Adam · Goatfell', at: '01 Oct 2026, 16:42', action: 'Customer requirement revised', reason: 'Four legs and an X-frame are required for safe handling.', before: '4 removable legs', after: '4 removable legs + X-frame' },
  { id: 2, specId: 'DIM.BEDGAP', actor: 'System comparison', at: '01 Oct 2026, 16:44', action: 'Missing unit detected', reason: 'OEM value omitted the measurement unit.', before: '< 20 mm', after: '< 20 · unit confirmation required' },
  { id: 3, specId: 'ELEC.CEE', actor: 'System comparison', at: '01 Oct 2026, 16:44', action: 'Quote omission detected', reason: 'Requirement appears in the technical protocol but not in the OEM quote.', before: 'Male connector on camper', after: 'Not stated' }
];

function persistSpecs() {
  localStorage.setItem('goatfell-specs', JSON.stringify(specs));
  localStorage.setItem('goatfell-spec-changes', JSON.stringify(specChanges));
  localStorage.setItem('goatfell-tasks', JSON.stringify(state.tasks));
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'\"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;' })[char]);
}

function actorName() {
  return ({ goatfell: 'Adam · Goatfell', sephiroth: 'Partner A OEM', earthstorm: 'Partner B OEM', freight: 'Freight Partner' })[state.role];
}

function nowLabel() {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai' }).format(new Date());
}

function recordSpecChange(specId, action, reason, before, after) {
  specChanges.unshift({ id: Date.now(), specId, actor: actorName(), at: nowLabel(), action, reason, before, after });
}

function ensureAttentionTask(spec) {
  if (spec.status !== 'missing' && !/\bTBC\b/i.test(spec.request)) return;
  if (state.tasks.some(task => task.specId === spec.id && !task.done)) return;
  state.tasks.unshift({ id: Date.now(), specId: spec.id, title: `${spec.status === 'missing' ? 'Resolve missing quote item' : 'Confirm TBC requirement'}: ${spec.item}`, order: spec.orderId, due: 'Action required', owner: 'Goatfell · Justin & Adam', done: false });
}

const i18n = {
  en: {
    'nav.overview': 'Overview', 'nav.orders': 'Orders', 'nav.specs': 'Specs & Quotes', 'nav.production': 'Production',
    'nav.logistics': 'Logistics', 'nav.compliance': 'CE & Compliance', 'nav.repairs': 'Repairs & Warranty',
    'secure.title': 'Private workspace', 'secure.body': 'Organisation-isolated access', 'role.admin': 'Administrator',
    workspace: 'Workspace', search: 'Search orders, units, tasks…', cancel: 'Cancel'
  },
  zh: {
    'nav.overview': '总览', 'nav.orders': '订单', 'nav.specs': '规格与报价', 'nav.production': '生产进度',
    'nav.logistics': '运输物流', 'nav.compliance': 'CE与合规', 'nav.repairs': '维修与质保',
    'secure.title': '私有工作区', 'secure.body': '企业隔离访问权限', 'role.admin': '管理员',
    workspace: '工作区', search: '搜索订单、产品、任务…', cancel: '取消'
  }
};

const viewNames = {
  en: { overview: 'Overview', orders: 'Orders', specs: 'Specs & Quotes', production: 'Production', logistics: 'Logistics', compliance: 'CE & Compliance', repairs: 'Repairs & Warranty' },
  zh: { overview: '总览', orders: '订单', specs: '规格与报价', production: '生产进度', logistics: '运输物流', compliance: 'CE与合规', repairs: '维修与质保' }
};

function visibleOrders() {
  let list = orders.filter(order => !order.archivedAt && canAccessOrder(order));
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(o => Object.values(o).join(' ').toLowerCase().includes(q));
  }
  return list;
}

function orderDisplayReference(order) {
  if (state.role === 'goatfell') return `${order.unit} · ${order.customer}`;
  return `${order.unit} · ${vehicleLabel(order.vehicle)}`;
}

const badge = (label, kind = 'gray') => `<span class="badge ${kind}">${label}</span>`;
const money = value => value ? `£${value.toLocaleString('en-GB')}` : '—';
const documentStatusBadge = document => !document.attached ? badge('UPLOAD REQUIRED', 'red') : document.status === 'verified' ? badge('VERIFIED', 'green') : document.status === 'review' ? badge('REVIEW', 'amber') : badge('MISSING', 'red');
const documentDisplayName = document => document.attached ? document.name : 'Original file not uploaded';

const specStatusBadge = spec => spec.status === 'match' ? badge('MATCH', 'green')
  : spec.status === 'accepted' ? badge('ACCEPTED DEVIATION', 'blue')
    : spec.status === 'deferred' ? badge('DEFERRED', 'gray')
      : spec.status === 'missing' ? badge('MISSING', 'red') : badge('DIFFERENT', 'amber');

function sourcePills(documents, limit = 2) {
  if (!documents.length) return '<span class="source-empty">No governing file</span>';
  const visible = documents.slice(0, limit).map(document => `<button class="source-pill ${document.attached ? '' : 'missing'}" data-source-doc="${escapeHTML(document.id)}" title="${escapeHTML(document.attached ? document.name : 'Upload original file')}"><span>${escapeHTML(document.kind)}</span><b>${document.attached ? `v${document.version}` : 'UPLOAD'}</b></button>`).join('');
  return `${visible}${documents.length > limit ? `<span class="source-more">+${documents.length - limit}</span>` : ''}`;
}

function sourceCards(documents) {
  if (!documents.length) return '<div class="empty-state"><strong>No source file linked</strong>Add a governing document before approval.</div>';
  return `<div class="source-card-list">${documents.map(document => `<button class="source-card ${document.attached ? '' : 'missing'}" data-source-doc="${escapeHTML(document.id)}"><span class="file-icon">${document.attached ? (/\.pdf$/i.test(document.name) ? 'PDF' : /\.xlsx?$/i.test(document.name) ? 'XLS' : 'DOC') : '+'}</span><span><b>${escapeHTML(document.kind)}</b><small>${escapeHTML(documentDisplayName(document))}${document.attached ? ` · v${document.version}` : ' · click to upload'}</small></span>${documentStatusBadge(document)}<span class="source-chevron">›</span></button>`).join('')}</div>`;
}
const statusBadge = order => {
  if (order.status === 'complete') return badge('ON TRACK', 'green');
  if (order.status === 'attention') return badge('ACTION NEEDED', 'red');
  return badge('IN PROGRESS', 'blue');
};

function pageHead(kicker, title, subtitle, actions = '') {
  return `<div class="page-head"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${subtitle}</p></div><div class="head-actions">${actions}</div></div>`;
}

function projectRows(limit = 99) {
  const list = visibleOrders().slice(0, limit);
  if (!list.length) return `<div class="empty-state"><strong>No matching orders</strong>Try another search or role.</div>`;
  return list.map(o => `
    <div class="project-row" data-order="${o.id}">
      <div class="project-name"><span class="model-chip oem-${oemKey(o.oem)}">${o.model.includes('INDIE') ? 'INDIE' : o.model.includes('Legacy') ? 'RPR' : 'LUX'}</span><span><b>${o.id} · ${o.model}</b><small>${orderDisplayReference(o)}</small></span></div>
      <div><span class="label">OEM</span><span class="value">${o.oem}</span></div>
      <div><span class="label">Stage</span><span class="value">${o.stage}</span></div>
      <div><span class="label">Progress · ${o.progress}%</span><span class="progress"><i style="width:${o.progress}%"></i></span></div>
      <div>${statusBadge(o)}</div><span>›</span>
    </div>`).join('');
}

function taskList(orderId = '') {
  let allowed = state.tasks.filter(task => !orderId || task.order === orderId);
  allowed = allowed.filter(task => canAccessOrder(orders.find(order => order.id === task.order)));
  if (state.role !== 'goatfell') allowed = allowed.filter(t => t.owner.toLowerCase().includes(state.role.replace('earthstorm', 'earth storm')) || (state.role === 'freight' && t.owner.includes('Mackenzie')));
  return allowed.length ? allowed.map(t => `<div class="task"><button class="check ${t.done ? 'done' : ''}" data-task="${t.id}">${t.done ? '✓' : ''}</button><span><b>${t.title}</b><small>${t.order} · ${t.owner}</small></span><span class="due">${t.due}</span></div>`).join('') : `<div class="empty-state"><strong>No assigned tasks</strong>Nothing needs your input.</div>`;
}

function renderOverview() {
  const visible = visibleOrders();
  const active = visible.filter(o => o.stage !== 'UK warehouse' && !o.model.includes('Legacy')).length;
  const stages = [...new Set(visible.filter(order => order.stage !== 'UK warehouse').map(order => order.stage))].slice(0, 4).join(' · ') || 'No active stages';
  const attention = visible.filter(order => order.status === 'attention').length;
  const visibleIds = new Set(visible.map(order => order.id));
  const waitingMilestones = orderMilestones.filter(milestone => visibleIds.has(milestone.orderId) && milestone.status === 'waiting');
  const nextMilestone = orderMilestones.filter(milestone => visibleIds.has(milestone.orderId) && milestone.status !== 'complete' && milestone.due).sort((a, b) => a.due.localeCompare(b.due))[0] || null;
  const roleAlerts = state.role === 'goatfell'
    ? [['!', 'Quote item omitted', 'CEE connector is present in the specification but absent from Partner A’s quote.'], ['!', 'CE evidence missing', 'Two components need documents before production release.'], ['↗', 'Forecast moved by 4 days', 'Partner B supplied a reason; Goatfell approval is pending.']]
    : state.role === 'sephiroth'
      ? [['!', 'Quote item omitted', 'CEE connector needs a response for GF-2607-01.'], ['!', 'CE evidence missing', 'LUX component evidence is required before release.']]
      : state.role === 'earthstorm'
        ? [['↗', 'Forecast change pending', 'A reason and revised Partner B delivery forecast are awaiting review.'], ['!', 'CE evidence missing', 'INDIE component evidence is required.']]
        : [['!', 'Shipment file requested', 'Upload only the documents requested for the assigned Partner B shipment.']];
  document.querySelector('#overviewView').innerHTML = `
    ${pageHead('01 · OPERATIONS', state.role === 'goatfell' ? 'Manufacturing overview' : 'Your collaboration workspace', state.role === 'goatfell' ? 'One view from customer requirement to UK delivery.' : 'Only records requiring your organisation’s involvement are visible.', state.role === 'goatfell' ? `<button class="btn secondary" data-action="export">Export report</button><button class="btn primary" data-action="new-order">+ New order</button>` : '')}
    ${state.role !== 'goatfell' ? `<div class="privacy-banner">◉ Showing only work assigned to ${document.querySelector('#roleSwitcher').selectedOptions[0].text}. Other partner orders and Goatfell-private information are hidden.</div>` : ''}
    <div class="stats-grid">
      <article class="stat-card highlight"><small>Active orders</small><strong>${active}</strong><span class="delta">${escapeHTML(stages)}</span></article>
      <article class="stat-card"><small>Need attention</small><strong>${attention}</strong><span class="delta">Within this access boundary</span></article>
      <article class="stat-card"><small>Waiting on owner</small><strong>${waitingMilestones.length}</strong><span class="delta">Every item has an accountable party</span></article>
      <article class="stat-card"><small>Next milestone</small><strong style="font-size:18px">${nextMilestone ? escapeHTML(nextMilestone.due) : '—'}</strong><span class="delta">${nextMilestone ? `${escapeHTML(nextMilestone.name)} · ${escapeHTML(nextMilestone.owner)}` : 'No assigned milestone'}</span></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h2>Live projects</h2><p>Order, unit, OEM and current gate</p></div><button class="link-button" data-view-jump="orders">VIEW ALL →</button></div><div class="project-list">${projectRows(5)}</div></section>
      <div class="stack">
        <section class="panel"><div class="panel-head"><div><h2>Your tasks</h2><p>Approvals and missing information</p></div><button class="link-button" data-action="new-task">+ ADD</button></div><div class="panel-body task-list">${taskList()}</div></section>
        <section class="panel"><div class="panel-head"><div><h2>Attention radar</h2><p>Automatically surfaced risks</p></div></div><div class="panel-body alert-list">
          ${roleAlerts.map(alert => `<div class="alert-card"><span class="alert-symbol">${alert[0]}</span><span><b>${escapeHTML(alert[1])}</b><small>${escapeHTML(alert[2])}</small></span></div>`).join('')}
        </div></section>
      </div>
    </div>`;
}

function renderOrders() {
  const filters = state.role === 'goatfell' ? ['all', 'Partner A', 'Partner B', 'Legacy Partner'] : ['all'];
  const list = visibleOrders().filter(o => state.orderFilter === 'all' || o.oem === state.orderFilter);
  const oems = [...new Set(list.map(order => order.oem))];
  const portfolioCards = oems.map(oem => { const records = list.filter(order => order.oem === oem); return `<button class="oem-portfolio-card oem-${oemKey(oem)}" data-order-filter="${escapeHTML(oem)}"><span class="oem-dot"></span><span><b>${escapeHTML(oem)}</b><small>${records.length} order${records.length === 1 ? '' : 's'} · ${records.filter(order => order.status === 'attention').length} need attention</small></span><strong>${Math.round(records.reduce((sum, order) => sum + order.progress, 0) / records.length)}%</strong></button>`; }).join('');
  const groupedRows = oems.map(oem => `<tr class="oem-group oem-${oemKey(oem)}"><td colspan="7"><span class="oem-dot"></span><strong>${escapeHTML(oem)}</strong><small>${list.filter(order => order.oem === oem).length} concurrent order${list.filter(order => order.oem === oem).length === 1 ? '' : 's'}</small></td></tr>${list.filter(order => order.oem === oem).map(o => `<tr data-order="${o.id}"><td><strong>${o.id}</strong><small>${orderDisplayReference(o)}</small></td><td><strong>${o.model}</strong><small><span class="oem-inline oem-${oemKey(o.oem)}"><i></i>${o.oem}</span></small></td><td>${vehicleLabel(o.vehicle)}</td><td>${o.stage}<small>${o.progress}% complete</small></td><td><div class="source-pills">${sourcePills(documentsForOrder(o.id), 1)}</div></td><td>${o.next}<small>${o.date || 'Date n/a'}</small></td><td>${statusBadge(o)}</td></tr>`).join('')}`).join('');
  document.querySelector('#ordersView').innerHTML = `
    ${pageHead('02 · ORDER CONTROL', 'Orders and camper units', 'Commercial, manufacturing and delivery records linked without mixing their identifiers.', state.role === 'goatfell' ? `<button class="btn secondary" data-action="view-archive">Archived (${orders.filter(order => order.archivedAt).length})</button><button class="btn secondary" data-action="export">Export CSV</button><button class="btn primary" data-action="new-order">+ New order</button>` : '')}
    <div class="oem-portfolio">${portfolioCards}</div>
    <div class="toolbar"><div class="filters">${filters.map(f => `<button class="filter-btn ${state.orderFilter === f ? 'active' : ''}" data-order-filter="${f}">${f === 'all' ? (state.role === 'goatfell' ? 'All orders' : 'Assigned orders') : f}</button>`).join('')}</div><span class="eyebrow">${list.length} RECORDS</span></div>
    <section class="panel table-wrap"><table><thead><tr><th>Order / Unit</th><th>Model & partner</th><th>Pickup</th><th>Current stage</th><th>Source of truth</th><th>Next action</th><th>Status</th></tr></thead><tbody>
    ${groupedRows || '<tr><td colspan="7"><div class="empty-state"><strong>No matching orders</strong>Try another OEM or search.</div></td></tr>'}
    </tbody></table></section>`;
}

function renderSpecs() {
  if (state.role === 'freight') {
    document.querySelector('#specsView').innerHTML = restrictedView('03 · CONTROLLED SPECIFICATION', 'Specifications & quotes', 'No specification comparison is assigned to the active organisation in this demonstration.');
    return;
  }
  const comparisonOrders = visibleOrders().filter(order => specsForOrder(order.id).length);
  if (!comparisonOrders.length) { document.querySelector('#specsView').innerHTML = restrictedView('03 · CONTROLLED SPECIFICATION', 'Specifications & quotes', 'No imported specification comparison is assigned to the active organisation.'); return; }
  const comparisonOrder = comparisonOrders.find(order => order.id === state.specOrderId) || comparisonOrders[0];
  state.specOrderId = comparisonOrder.id; localStorage.setItem('goatfell-spec-order', state.specOrderId);
  const orderSpecs = comparisonOrder ? specsForOrder(comparisonOrder.id) : [];
  const missingCount = orderSpecs.filter(s => s.status === 'missing').length;
  const changedCount = orderSpecs.filter(s => s.status === 'changed').length;
  const tbcCount = orderSpecs.filter(s => /\bTBC\b/i.test(s.request)).length;
  const mappedCount = orderSpecs.filter(s => s.oem && !/not stated/i.test(s.oem)).length;
  document.querySelector('#specsView').innerHTML = `
    ${pageHead('03 · CONTROLLED SPECIFICATION', 'Specification ↔ quote comparison', 'Every requirement has an ID, quantity, unit, source and accountable owner.', `<button class="btn secondary" data-action="history">View change history</button>${state.role === 'goatfell' ? '<button class="btn primary" data-action="add-spec">+ Add requirement</button>' : ''}`)}
    <div class="toolbar"><div class="filters">${comparisonOrders.map(order => `<button class="filter-btn ${order.id === comparisonOrder.id ? 'active' : ''}" data-spec-order="${order.id}"><span class="oem-dot oem-${oemKey(order.oem)}"></span>${order.id} · ${order.model}</button>`).join('')}</div><div class="filters"><span class="eyebrow">PREVIEW LANGUAGE</span><button class="filter-btn ${state.specContentLanguage === 'en' ? 'active' : ''}" data-spec-language="en">English</button><button class="filter-btn ${state.specContentLanguage === 'zh' ? 'active' : ''}" data-spec-language="zh">简体中文</button></div></div>
    <div class="source-notice">Bilingual preview uses approved translation-memory fields. Missing translations are marked for review; production automation must retain the original text, translated text, terminology version and approver.</div>
    <div class="stats-grid">
      <article class="stat-card"><small>Requirements mapped</small><strong>${mappedCount} / ${orderSpecs.length}</strong><span class="delta">${orderSpecs.length ? Math.round(mappedCount / orderSpecs.length * 100) : 0}% quote coverage</span></article>
      <article class="stat-card"><small>Missing from quote</small><strong>${missingCount}</strong><span class="delta">Blocks quote approval</span></article>
      <article class="stat-card"><small>Value differences</small><strong>${changedCount}</strong><span class="delta">Human confirmation required</span></article>
      <article class="stat-card"><small>Unresolved TBC</small><strong>${tbcCount}</strong><span class="delta">Tracked as Goatfell tasks</span></article>
    </div>
    <section class="panel"><div class="panel-head"><div><h2>${comparisonOrder.id} · ${comparisonOrder.model}</h2><p>Customer requirements compared with ${comparisonOrder.oem} quote · grouped by stable core vs order-variable scope</p></div>${badge('REVIEWING', 'amber')}</div><div class="table-wrap"><table><thead><tr><th>Spec ID</th><th>Requirement / 规格</th><th>Segment</th><th>Customer requirement</th><th>Partner quote response</th><th>Unit</th><th>Source files</th><th>Result</th><th>Owner</th></tr></thead><tbody>
      ${groupedSpecRows(orderSpecs)}
    </tbody></table></div></section>`;
}

const productionBuilds = [
  { orderId: 'GF-2606-04', drawingRevision: 3, deposit: '40% · payment evidence attached', completionForecast: '28 Oct 2026', evidenceIds: ['DOC-PROD-ELEC', 'DOC-DRAWING-2606'] }
];

const shipments = [
  { orderIds: ['GF-2605-08', 'GF-2605-03'], id: 'SHP-2605-08', partner: 'Freight Partner', route: 'Partner B → Dumfries', booking: 'FSM-UK-261104', eta: '07 Dec 2026' }
];

const repairCases = [
  { orderId: 'GF-RPR-019', oem: 'Legacy Partner', caseId: 'RPR-026-19', raised: '26 Sep', issue: 'Replacement water pump', source: 'DOC-DELIVERY-FEEDBACK', scope: 'Single unit', owner: 'Legacy Partner', next: 'Confirm parts ETA', status: ['OEM RESPONSE','amber'] },
  { orderId: 'GF-2606-02', oem: 'Partner A', caseId: 'RPR-026-18', raised: '22 Sep', issue: 'Mounting leg instability', source: 'DOC-INSPECT-LUX', scope: 'All LUX builds', owner: 'Partner A', next: 'Approve X-frame protocol', status: ['CORRECTIVE ACTION','red'] },
  { orderId: 'GF-2605-03', oem: 'Partner B', caseId: 'RPR-026-15', raised: '12 Sep', issue: 'Incorrect MaxxFan orientation', source: 'DOC-INDIE-FEEDBACK', scope: 'INDIE model', owner: 'Partner B', next: 'Inspection rule created', status: ['RESOLVED','green'] }
];

const paymentPlans = [
  { orderId: 'GF-2607-01', deposit: 'Awaiting approved contract', next: 'Deposit ratio to be confirmed with Partner A' },
  { orderId: 'GF-2606-04', deposit: '40% · evidence approved', next: 'Balance after final inspection' },
  { orderId: 'GF-2605-08', deposit: 'Paid · Partner B contract terms', next: 'Final payment before factory release' }
];

const expenseRecords = [
  { orderId: 'GF-2606-02', title: 'Factory inspection travel', owner: 'Adam', amount: 0, status: 'pending' },
  { orderId: 'GF-RPR-019', title: 'Replacement CO₂ detector', owner: 'Justin', amount: 0, status: 'pending' },
  { orderId: 'GF-2605-03', title: 'UK warehouse handling', owner: 'Adam', amount: 0, status: 'approved' }
];

const orderMilestones = JSON.parse(localStorage.getItem('goatfell-order-milestones') || 'null') || [
  { id: 'MS-2607-Q', orderId: 'GF-2607-01', name: 'Resolve quote variances', owner: 'Partner A', due: '2026-10-04', status: 'waiting', waitingOn: 'OEM response' },
  { id: 'MS-2606-D', orderId: 'GF-2606-04', name: 'Approve fitment drawing v3', owner: 'Adam', due: '2026-10-02', status: 'waiting', waitingOn: 'Goatfell approval' },
  { id: 'MS-2606-E', orderId: 'GF-2606-02', name: 'Upload completion evidence', owner: 'Partner A', due: '2026-10-08', status: 'planned', waitingOn: 'OEM evidence' },
  { id: 'MS-2605-P', orderId: 'GF-2605-08', name: 'Confirm factory pickup', owner: 'Freight Partner', due: '2026-10-05', status: 'waiting', waitingOn: 'Freight confirmation' },
  { id: 'MS-2605-W', orderId: 'GF-2605-03', name: 'Complete customer PDI', owner: 'Justin', due: '2026-10-07', status: 'planned', waitingOn: 'Goatfell' },
  { id: 'MS-RPR-P', orderId: 'GF-RPR-019', name: 'Confirm replacement part ETA', owner: 'Legacy Partner', due: '2026-10-11', status: 'waiting', waitingOn: 'OEM response' }
];

function persistMilestones() { localStorage.setItem('goatfell-order-milestones', JSON.stringify(orderMilestones)); }
function milestonesForOrder(orderId) { return orderMilestones.filter(milestone => milestone.orderId === orderId); }
function milestoneState(milestone) {
  if (milestone.status === 'complete') return ['COMPLETE', 'green'];
  if (milestone.due && milestone.due < '2026-10-03') return ['OVERDUE', 'red'];
  return milestone.status === 'waiting' ? ['WAITING', 'amber'] : ['PLANNED', 'blue'];
}

function milestoneList(orderId) {
  const records = milestonesForOrder(orderId);
  if (!records.length) return '<div class="empty-state compact"><strong>No milestones recorded</strong>Add an owner and due date for the next gate.</div>';
  return `<div class="milestone-list">${records.map(milestone => `<button class="milestone-row" data-action="update-milestone" data-milestone-target="${escapeHTML(milestone.id)}"><span><b>${escapeHTML(milestone.name)}</b><small>${escapeHTML(milestone.waitingOn)} · owner ${escapeHTML(milestone.owner)}</small></span><span><small>${escapeHTML(milestone.due || 'Date n/a')}</small>${badge(...milestoneState(milestone))}</span></button>`).join('')}</div>`;
}

function renderProduction() {
  if (state.role === 'earthstorm' || state.role === 'freight') {
    document.querySelector('#productionView').innerHTML = restrictedView('04 · BUILD CONTROL', 'Production and approvals', 'No production build is assigned to the active organisation in this demonstration.');
    return;
  }
  const build = productionBuilds.find(record => canAccessOrder(orders.find(order => order.id === record.orderId)));
  const buildOrder = build && orders.find(order => order.id === build.orderId);
  if (!buildOrder) { document.querySelector('#productionView').innerHTML = restrictedView('04 · BUILD CONTROL', 'Production and approvals', 'No production build is assigned to the active organisation.'); return; }
  const steps = [
    ['Quote approved', 'Commercial scope locked', '18 Sep', 'complete'], ['Contract executed', 'Signed version GF-C-2606-04', '21 Sep', 'complete'],
    ['Deposit paid', '40% · payment evidence attached', '22 Sep', 'complete'], ['Drawing approval', 'Revision 3 awaiting Goatfell', 'Due 02 Oct', 'current'],
    ['Production authorised', 'Blocked until drawing approval', 'Forecast 03 Oct', ''], ['OEM completion evidence', 'Photos, video and as-built record', 'Forecast 24 Oct', ''],
    ['Final inspection', 'Factory checklist and defect gate', 'Forecast 27 Oct', ''], ['Release & collection', 'Final payment then pickup', 'Forecast 30 Oct', '']
  ];
  document.querySelector('#productionView').innerHTML = `
    ${pageHead('04 · BUILD CONTROL', 'Production and approvals', 'No production gate advances without the required approval and evidence.', `<button class="btn secondary" data-action="date-change">Request date change</button><button class="btn primary" data-action="upload-evidence">Upload evidence</button>`)}
    <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><h2>${buildOrder.id} · ${buildOrder.model}</h2><p>${buildOrder.oem} · ${buildOrder.vehicle} · unit ${buildOrder.unit}</p></div>${badge('DRAWING APPROVAL', 'amber')}</div><div class="panel-body workflow">${steps.map((s,i) => `<div class="workflow-step ${s[3]}"><span class="step-dot">${s[3] === 'complete' ? '✓' : i+1}</span><span class="step-copy"><b>${s[0]}</b><small>${s[1]}</small></span><span class="step-date">${s[2]}</span></div>`).join('')}</div></section>
    <div class="stack"><section class="panel"><div class="panel-head"><div><h2>Date change request</h2><p>Baseline dates remain preserved</p></div>${badge('PENDING', 'amber')}</div><div class="panel-body"><span class="label">PROPOSED BY SEPHIROTH</span><h3 style="margin:7px 0;font-size:13px">Production completion</h3><p style="font-size:10px;color:var(--muted);line-height:1.6">24 Oct → 28 Oct 2026<br>Reason: revised mounting bracket requires another machining cycle.</p><div class="head-actions"><button class="btn secondary" data-action="reject-date">Reject</button><button class="btn primary" data-action="approve-date">Approve change</button></div></div></section>
    <section class="panel"><div class="panel-head"><div><h2>Evidence required</h2><p>Before production can be accepted complete</p></div></div><div class="panel-body"><div class="task-list"><div class="task"><span class="check"></span><span><b>Exterior 360° video</b><small>OEM · mandatory</small></span>${badge('MISSING','red')}</div><div class="task"><span class="check done">✓</span><span><b>Electrical function test</b><small>Uploaded 30 Sep</small></span>${badge('VERIFIED','green')}</div><div class="task"><span class="check"></span><span><b>As-built dimensions</b><small>OEM · mandatory</small></span>${badge('DUE','amber')}</div></div><div class="section-label">Traceable evidence</div>${sourceCards(sourceDocuments.filter(document => build.evidenceIds.includes(document.id) && document.orderIds.includes(build.orderId)))}</div></section></div></div>`;
}

function renderLogistics() {
  if (state.role === 'sephiroth') {
    document.querySelector('#logisticsView').innerHTML = restrictedView('05 · SHIPMENT VISIBILITY', 'Factory to UK warehouse', 'No shipment is assigned to the active organisation in this demonstration.');
    return;
  }
  const shipment = shipments.find(record => record.orderIds.some(orderId => canAccessOrder(orders.find(order => order.id === orderId))));
  if (!shipment) { document.querySelector('#logisticsView').innerHTML = restrictedView('05 · SHIPMENT VISIBILITY', 'Factory to UK warehouse', 'No shipment is assigned to the active organisation.'); return; }
  const points = [['Factory ready','28 Oct','complete'],['Pickup','30 Oct','complete'],['Vessel departs','04 Nov','active'],['UK port','07 Dec',''],['Customs cleared','10 Dec',''],['Warehouse','11 Dec','']];
  document.querySelector('#logisticsView').innerHTML = `
    ${pageHead('05 · SHIPMENT VISIBILITY', 'Factory to UK warehouse', 'Goatfell owns the schedule; freight partners propose dates and upload evidence.', `<button class="btn secondary" data-action="request-file">Request document</button><button class="btn primary" data-action="update-milestone">Update milestone</button>`)}
    <section class="panel"><div class="panel-head"><div><h2>${shipment.id} · ${shipment.route}</h2><p>${shipment.partner} · ${shipment.orderIds.map(escapeHTML).join(', ')} · consolidated sea freight</p></div>${badge('IN TRANSIT', 'blue')}</div><div class="panel-body"><div class="logistics-track">${points.map(p => `<div class="log-point ${p[2]}"><i></i><b>${p[0]}</b><small>${p[1]}</small></div>`).join('')}</div><div class="detail-grid"><div class="detail-box"><span>Factory collection</span><b>Chengdu · agent confirmed</b></div><div class="detail-box"><span>Booking reference</span><b>${shipment.booking}</b></div><div class="detail-box"><span>Latest ETA</span><b>${shipment.eta} · no change</b></div><div class="detail-box"><span>Documents</span><b>5 received · 1 requested</b></div></div></div></section>
    <div style="height:18px"></div><section class="panel"><div class="panel-head"><div><h2>Logistics document room</h2><p>Files visible only to assigned shipment parties</p></div></div><div class="table-wrap"><table><thead><tr><th>Document</th><th>Requested from</th><th>Owner</th><th>Due</th><th>Version</th><th>Status</th></tr></thead><tbody><tr><td><strong>Commercial invoice</strong><small>PDF · 248 KB</small></td><td>Goatfell</td><td>Adam</td><td>Completed</td><td>v2</td><td>${badge('APPROVED','green')}</td></tr><tr><td><strong>Packing declaration</strong><small>Required for export file</small></td><td>Partner B</td><td>OEM logistics</td><td>03 Nov</td><td>—</td><td>${badge('REQUESTED','amber')}</td></tr><tr><td><strong>Collection photographs</strong><small>8 images</small></td><td>Local agent</td><td>Freight Partner</td><td>Completed</td><td>v1</td><td>${badge('RECEIVED','blue')}</td></tr></tbody></table></div></section>`;
}

function visibleCertificates() {
  let list = state.certificates;
  if (state.role === 'sephiroth') list = list.filter(c => c.oem === 'Partner A');
  if (state.role === 'earthstorm') list = list.filter(c => c.oem === 'Partner B');
  if (state.role === 'freight') return [];
  if (state.ceFilter !== 'all') list = list.filter(c => c.oem === state.ceFilter);
  return list;
}

function renderCompliance() {
  const list = visibleCertificates();
  const certificateFilters = state.role === 'goatfell' ? ['all','Partner A','Partner B','Legacy Partner'] : ['all'];
  const missing = list.filter(c => c.status === 'missing' || c.status === 'expired').length;
  const verified = list.filter(c => c.status === 'verified').length;
  const statusMap = { verified: ['VERIFIED','green'], review: ['REVIEW DUE','amber'], missing: ['MISSING','red'], expired: ['EXPIRED','red'] };
  document.querySelector('#complianceView').innerHTML = `
    ${pageHead('06 · TECHNICAL FILE', 'CE certificates by OEM', 'Documents stay separate and sortable while remaining linked to the exact component, model and order.', `<button class="btn secondary" data-action="export-register">Export register</button><button class="btn primary" data-action="add-certificate">+ Add certificate</button>`)}
    <div class="ce-summary">
      <article class="oem-card"><small>COMPLIANCE REGISTER</small><h2>${state.ceFilter === 'all' ? 'All manufacturing partners' : state.ceFilter}</h2><div class="oem-metrics"><span><strong>${list.length}</strong><span>RECORDS</span></span><span><strong>${verified}</strong><span>VERIFIED</span></span><span><strong>${missing}</strong><span>NEED ATTENTION</span></span></div></article>
      <article class="metric-card"><span>Document coverage</span><div class="coverage"><span class="ring" style="--p:${list.length ? Math.round(verified/list.length*100) : 0}"><b>${list.length ? Math.round(verified/list.length*100) : 0}%</b></span><small>Verified files<br>in current view</small></div></article>
      <article class="metric-card danger"><span>Missing / expired</span><strong>${missing}</strong><small>Blocks relevant approval gates</small></article>
      <article class="metric-card"><span>Review within 45 days</span><strong>${list.filter(c => c.status === 'review').length}</strong><small>Owners will be reminded</small></article>
    </div>
    <div class="toolbar"><div class="filters">${certificateFilters.map(f => `<button class="filter-btn ${state.ceFilter === f ? 'active' : ''}" data-ce-filter="${f}">${f === 'all' ? (state.role === 'goatfell' ? 'All OEMs' : 'My certificates') : f}</button>`).join('')}</div><span class="eyebrow">${state.role === 'goatfell' ? 'LUX · SEPHIROTH / INDIE · EARTH STORM' : 'ASSIGNED ORGANISATION ONLY'}</span></div>
    <section class="panel table-wrap"><table><thead><tr><th>OEM / Model</th><th>Component</th><th>Required document</th><th>Original source</th><th>Certificate ref.</th><th>Review / expiry</th><th>Status</th><th>Action</th></tr></thead><tbody>
    ${list.length ? list.map(c => { const source = sourceDocuments.find(document => document.id === c.sourceId); return `<tr data-cert="${c.id}"><td><strong>${c.oem}</strong><small>${c.model}</small></td><td>${c.component}</td><td>${c.document}</td><td><div class="source-pills">${sourcePills(source ? [source] : [], 1)}</div></td><td>${c.ref}</td><td>${c.review}</td><td>${badge(...statusMap[c.status])}</td><td><button class="link-button" data-source-doc="${escapeHTML(c.sourceId || '')}">${c.status === 'missing' ? 'TRACE REQUIREMENT' : 'OPEN SOURCE'} →</button></td></tr>`; }).join('') : `<tr><td colspan="8"><div class="empty-state"><strong>No compliance access</strong>Freight partners cannot view technical certificates.</div></td></tr>`}
    </tbody></table></section>`;
}

function renderRepairs() {
  if (state.role === 'freight') {
    document.querySelector('#repairsView').innerHTML = restrictedView('07 · CLOSED LOOP QUALITY', 'Repairs and warranty', 'Repair and warranty records are not shared with the freight role.');
    return;
  }
  const repairRows = repairCases.map(record => ({ ...record, order: orders.find(order => order.id === record.orderId) })).filter(record => record.order && canAccessOrder(record.order));
  document.querySelector('#repairsView').innerHTML = `
    ${pageHead('07 · CLOSED LOOP QUALITY', 'Repairs, warranty and corrective action', 'Unit-level faults can become future inspection rules or model-wide protocol changes.', `<button class="btn secondary" data-action="export">Supplier report</button><button class="btn primary" data-action="new-repair">+ New case</button>`)}
    <div class="stats-grid"><article class="stat-card"><small>Visible cases</small><strong>${repairRows.length}</strong><span class="delta">Within this access boundary</span></article><article class="stat-card"><small>Awaiting response</small><strong>${repairRows.filter(row => row.next.includes('Confirm') || row.next.includes('Approve')).length}</strong><span class="delta">Assigned organisation only</span></article><article class="stat-card"><small>Protocol candidates</small><strong>${repairRows.filter(row => row.scope !== 'Single unit').length}</strong><span class="delta">Recurring-issue prevention</span></article><article class="stat-card"><small>Average close time</small><strong>12d</strong><span class="delta">Current demonstration</span></article></div>
    <section class="panel table-wrap"><table><thead><tr><th>Case</th><th>Order / unit</th><th>Issue</th><th>Original source</th><th>Scope</th><th>Responsible</th><th>Next action</th><th>Status</th></tr></thead><tbody>${repairRows.map(row => `<tr data-order="${row.orderId}"><td><strong>${row.caseId}</strong><small>Raised ${row.raised}</small></td><td><strong>${row.orderId}</strong><small>${row.order.unit}</small></td><td>${row.issue}</td><td>${sourcePills(sourceDocuments.filter(document => document.id === row.source && document.orderIds.includes(row.orderId) && canAccessSourceDocument(document)))}</td><td>${row.scope}</td><td>${row.owner}</td><td>${row.next}</td><td>${badge(...row.status)}</td></tr>`).join('')}</tbody></table></section>`;
}

function renderAll() {
  renderOverview(); renderOrders(); renderSpecs(); renderProduction(); renderLogistics(); renderCompliance(); renderRepairs();
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelector(`#${state.currentView}View`).classList.add('active');
  updatePresentationDisplay();
  bindDynamicEvents();
}

function startPresentation(partner) {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  if (user.boundary !== 'goatfell' || !['sephiroth','earthstorm','freight'].includes(partner)) return showToast('Presentation unavailable', 'Only a Goatfell user can start a partner-scoped presentation.');
  state.presentationPartner = partner; state.role = partner; state.orderFilter = 'all'; state.ceFilter = 'all';
  sessionStorage.setItem('goatfell-presentation-partner', partner); document.querySelector('#roleSwitcher').value = partner;
  renderAll(); applyLanguage(); updateProfileDisplay(); showToast('Presentation mode started', 'Private Goatfell data, administration and other partners are hidden.');
}

function endPresentation() {
  state.presentationPartner = ''; state.role = 'goatfell'; state.orderFilter = 'all'; state.ceFilter = 'all';
  sessionStorage.removeItem('goatfell-presentation-partner'); document.querySelector('#roleSwitcher').value = 'goatfell';
  renderAll(); applyLanguage(); updateProfileDisplay(); showToast('Presentation mode ended', 'The full Goatfell workspace is restored.');
}

function updatePresentationDisplay() {
  const active = Boolean(state.presentationPartner); const labels = { sephiroth: 'Goatfell + Partner A only', earthstorm: 'Goatfell + Partner B only', freight: 'Goatfell + Freight Partner only' };
  document.body.classList.toggle('presentation-mode', active);
  document.querySelector('#presentationBanner').hidden = !active;
  document.querySelector('#presentationScope').textContent = active ? `${labels[state.presentationPartner]} · private data and other partners hidden` : '';
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  document.querySelector('#presentationButton').hidden = active || user.boundary !== 'goatfell';
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (i18n[state.language][key]) el.textContent = i18n[state.language][key]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = i18n[state.language][el.dataset.i18nPlaceholder]);
  document.querySelector('#languageToggle').textContent = state.language === 'en' ? '中文' : 'EN';
  document.querySelector('#viewTitle').textContent = viewNames[state.language][state.currentView];
}

function switchView(view) {
  state.currentView = view;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelector(`#${view}View`).classList.add('active');
  document.querySelector('#viewTitle').textContent = viewNames[state.language][view];
  document.querySelector('#sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function orderConsistencyChecks(order) {
  const documents = documentsForOrder(order.id);
  const checks = [];
  if (!/\b(?:19|20)\d{2}\b/.test(order.vehicle || '')) checks.push('Pickup model year is n/a; confirm before drawing approval.');
  const requiredKinds = order.model.includes('Legacy') ? ['Repair'] : ['contract'];
  if (order.progress < 45) requiredKinds.push('specification', 'quotation', 'measurement');
  requiredKinds.forEach(kind => {
    const record = documents.find(document => new RegExp(kind, 'i').test(`${document.kind} ${document.name}`));
    if (!record) checks.push(`No ${kind} source record is linked to this order.`);
    else if (!record.attached) checks.push(`${record.kind}: original file has not been uploaded.`);
  });
  const unrelatedTasks = state.tasks.filter(task => task.order === order.id && task.specId && !specsForOrder(order.id).some(spec => spec.id === task.specId));
  if (unrelatedTasks.length) checks.push(`${unrelatedTasks.length} task${unrelatedTasks.length === 1 ? '' : 's'} point to specification items outside this order.`);
  return checks;
}

const requiredOrderFiles = [
  { key: 'specification', label: 'Customer specification', pattern: /customer specification/i, stage: 'Quote' },
  { key: 'measurement', label: 'Pickup measurement file', pattern: /measurement/i, stage: 'Design' },
  { key: 'quotation', label: 'OEM quotation', pattern: /quotation/i, stage: 'Quote' },
  { key: 'contract', label: 'Signed procurement contract', pattern: /contract/i, stage: 'Contract' },
  { key: 'drawing', label: 'Approved fitment drawing', pattern: /drawing/i, stage: 'Design' },
  { key: 'production', label: 'Production completion evidence', pattern: /production evidence/i, stage: 'Build' },
  { key: 'inspection', label: 'Inspection / release record', pattern: /inspection/i, stage: 'Inspect' },
  { key: 'delivery', label: 'Shipping / delivery file', pattern: /shipping|delivery|packing/i, stage: 'Deliver' }
];

function orderFileChecklist(order) {
  if (order.model.includes('Legacy')) return sourceCards(documentsForOrder(order.id));
  const documents = documentsForOrder(order.id);
  const firstIncomplete = requiredOrderFiles.find(requirement => !documents.find(document => requirement.pattern.test(`${document.kind} ${document.name}`))?.attached)?.key;
  return `<div class="order-file-checklist">${requiredOrderFiles.map(requirement => {
    const documentRecord = documents.find(document => requirement.pattern.test(`${document.kind} ${document.name}`));
    const ready = Boolean(documentRecord?.attached);
    const status = ready ? badge(documentRecord.status === 'verified' ? 'READY / PASSED' : 'FILE AVAILABLE', documentRecord.status === 'verified' ? 'green' : 'blue') : badge(documentRecord ? 'UPLOAD REQUIRED' : 'NOT LINKED', 'red');
    return `<div class="file-check-row ${firstIncomplete === requirement.key ? 'current' : ''}"><span><b>${escapeHTML(requirement.label)}</b><small>${escapeHTML(requirement.stage)} gate${firstIncomplete === requirement.key ? ' · current missing file' : ''}</small></span><span class="head-actions">${status}${documentRecord ? `<button class="link-button" data-source-doc="${escapeHTML(documentRecord.id)}">${ready ? 'OPEN' : 'UPLOAD'}</button>` : `<button class="link-button" data-create-doc="${escapeHTML(order.id)}" data-doc-kind="${escapeHTML(requirement.label)}">ADD FILE</button>`}</span></div>`;
  }).join('')}</div>`;
}

function orderTabContent(order, tab) {
  const orderDocuments = documentsForOrder(order.id);
  const measurementDocuments = orderDocuments.filter(document => /measurement|drawing/i.test(`${document.kind} ${document.name}`));
  const varianceItems = specsForOrder(order.id).filter(spec => spec.status !== 'match').slice(0, 4);
  const orderRepairs = repairCases.filter(record => record.orderId === order.id);
  const shipment = shipments.find(record => record.orderIds.includes(order.id));
  const paymentPlan = paymentPlans.find(record => record.orderId === order.id);
  const consistencyChecks = orderConsistencyChecks(order);
  const views = {
    summary: `<div class="detail-grid"><div class="detail-box"><span>Manufacturing partner</span><b><span class="oem-inline oem-${oemKey(order.oem)}"><i></i>${order.oem}</span></b></div><div class="detail-box"><span>Pickup</span><b>${vehicleLabel(order.vehicle)}</b></div><div class="detail-box stage-focus"><span>Current stage</span><b>${order.stage} · ${order.progress}%</b></div><div class="detail-box"><span>Next gate</span><b>${order.next}</b></div></div><div class="order-gates"><span class="complete">Quote</span><span class="${order.progress > 35 ? 'complete' : 'current'}">Contract</span><span class="${order.progress > 50 ? 'complete' : 'current'}">Design</span><span class="${order.progress > 65 ? 'complete' : ''}">Build</span><span class="${order.progress > 80 ? 'complete' : ''}">Inspect</span><span>Deliver</span></div><div class="section-label">Required files by order stage</div>${orderFileChecklist(order)}<div class="section-label">Milestones, owners and waiting time</div>${milestoneList(order.id)}<div class="section-label">Consistency and missing links</div>${consistencyChecks.length ? `<div class="validation-list">${consistencyChecks.map(message => `<div class="validation-item warning">! ${escapeHTML(message)}</div>`).join('')}</div>` : '<div class="validation-item passed">✓ Order links and required source records are consistent.</div>'}<div class="section-label">Next action</div><div class="alert-card"><span class="alert-symbol">!</span><span><b>${order.next}</b><small>Due ${order.date || 'n/a'} · accountable workflow gate</small></span></div>` ,
    specs: `<div class="section-label">Specification and quote status</div>${varianceItems.length ? `<div class="alert-list">${varianceItems.map(spec => `<button class="alert-card trace-card" data-spec="${escapeHTML(spec.id)}"><span class="alert-symbol">${spec.status === 'missing' ? '!' : '≠'}</span><span><b>${escapeHTML(spec.item)}</b><small>${escapeHTML(spec.request)} ↔ ${escapeHTML(spec.oem)}</small></span></button>`).join('')}</div>` : '<div class="empty-state"><strong>No comparison imported for this order</strong>Attach the customer specification and OEM quote to begin mapping.</div>'}<div class="section-label">Source files</div>${sourceCards(orderDocuments.filter(document => /specification|quotation/i.test(document.kind)))}`,
    design: `<div class="section-label">Pickup measurements and design</div>${sourceCards(measurementDocuments)}<div class="source-notice">The order-specific measurement record is the reference for fitment drawings. Historical vehicle values may be suggested but never overwrite the customer's measured values.</div>`,
    payments: `<div class="detail-grid"><div class="detail-box"><span>Manufacturing deposit</span><b>${paymentPlan ? paymentPlan.deposit : 'Not recorded'}</b></div><div class="detail-box"><span>Next payment gate</span><b>${paymentPlan ? paymentPlan.next : 'Add payment plan'}</b></div></div><div class="section-label">Contract sources</div>${sourceCards(orderDocuments.filter(document => /contract/i.test(document.kind)))}`,
    production: `<div class="section-label">Production controls</div><div class="task-list">${taskList(order.id)}</div>`,
    inspection: `<div class="detail-grid"><div class="detail-box"><span>Factory inspection</span><b>${order.progress > 70 ? 'Scheduled' : 'Not yet due'}</b></div><div class="detail-box"><span>Release gate</span><b>Evidence and defects required</b></div></div><div class="source-notice">Inspection failures can become a unit repair, model-wide corrective action or future protocol rule.</div>`,
    delivery: `<div class="detail-grid"><div class="detail-box"><span>Latest milestone</span><b>${order.stage}</b></div><div class="detail-box"><span>Forecast</span><b>${order.date}</b></div><div class="detail-box"><span>Shipment</span><b>${shipment ? `${shipment.id} · ${shipment.partner}` : 'Not yet assigned'}</b></div></div><div class="section-label">Logistics source files</div>${sourceCards(orderDocuments.filter(document => /contract|packing|shipping|delivery/i.test(document.kind)))}`,
    warranty: `<div class="detail-grid"><div class="detail-box"><span>Open cases</span><b>${orderRepairs.length ? `${orderRepairs.length} linked case${orderRepairs.length === 1 ? '' : 's'}` : 'None'}</b></div><div class="detail-box"><span>Warranty history</span><b>Linked to unit ${order.unit}</b></div></div>${orderRepairs.map(record => `<div class="alert-card"><span class="alert-symbol">!</span><span><b>${record.caseId} · ${record.issue}</b><small>${record.next}</small></span></div>`).join('')}`,
    files: `<div class="section-label">Complete source of truth</div>${sourceCards(orderDocuments)}`,
    customer: state.role === 'goatfell' ? `<div class="privacy-banner">◉ Goatfell-private customer information</div><div class="detail-grid"><div class="detail-box"><span>Customer</span><b>${order.customer}</b></div><div class="detail-box"><span>Region</span><b>United Kingdom · region TBC</b></div><div class="detail-box"><span>Engagement</span><b>Active owner</b></div><div class="detail-box"><span>Communication</span><b>Last contact 30 Sep</b></div></div>` : '<div class="empty-state"><strong>Restricted</strong>Customer identity is not shared with OEM or freight users.</div>'
  };
  return views[tab] || views.summary;
}

function openOrder(id, tab = 'summary') {
  const order = orders.find(item => item.id === id); if (!order) return;
  if (!canAccessOrder(order)) return showToast('Access denied', 'This order is not assigned to the active organisation.');
  const tabs = [['summary','Summary'],['specs','Specs & quote'],['design','Measurements & design'],['payments','Contract & deposit'],['production','Production'],['inspection','Inspection'],['delivery','Delivery'],['warranty','Warranty'],['files','Files']];
  if (state.role === 'goatfell') tabs.push(['customer','Customer']);
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">ORDER WORKSPACE · ${order.id}</span><h2>${order.model}</h2><p>${orderDisplayReference(order)}</p></div><div class="head-actions">${state.role === 'goatfell' && !order.archivedAt ? `<button class="btn secondary danger-link" data-action="delete-order" data-order-target="${escapeHTML(order.id)}">Archive order</button>` : ''}<button class="icon-btn" data-close-drawer>×</button></div></div>${statusBadge(order)}<div class="order-tabs">${tabs.map(item => `<button class="${tab === item[0] ? 'active' : ''}" data-order-tab="${item[0]}" data-order-id="${order.id}">${item[1]}</button>`).join('')}</div><div class="order-tab-content">${orderTabContent(order, tab)}</div>`;
  document.querySelector('#drawer').classList.add('order-drawer', 'open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function openArchive() {
  if (state.role !== 'goatfell') return showToast('Access denied', 'Only Goatfell administrators can view archived orders.');
  const archived = orders.filter(order => order.archivedAt);
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">RECOVERABLE ARCHIVE</span><h2>Archived orders</h2><p>Hidden from active work and every external account</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="source-notice">Archiving preserves linked specifications, files, tasks, payments and audit history. Restore the order to return it to active views.</div><div class="archive-list">${archived.length ? archived.map(order => `<div class="archive-row"><span><b>${escapeHTML(order.id)} · ${escapeHTML(order.model)}</b><small>${escapeHTML(order.archivedAt)} · ${escapeHTML(order.archivedReason || 'No reason recorded')}</small></span><button class="btn secondary" data-restore-order="${escapeHTML(order.id)}">Restore</button></div>`).join('') : '<div class="empty-state"><strong>No archived orders</strong>Active order records have not been deleted.</div>'}</div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function downloadBilingualReview(specIds, title) {
  const selected = specs.filter(spec => specIds.includes(spec.id) && canAccessOrder(orders.find(order => order.id === spec.orderId)));
  if (!selected.length) return showToast('No bilingual review available', 'This file has no mapped specification rows yet.');
  const lines = [`${title} — English / 简体中文 review`, `Generated ${nowLabel()}`, ''];
  selected.forEach(spec => {
    lines.push(`${spec.id} · ${spec.item} / ${spec.zh}`);
    lines.push(`EN requirement: ${spec.request}`);
    lines.push(`中文要求: ${spec.translations?.zh?.request || '待翻译'}`);
    lines.push(`EN partner response: ${spec.oem}`);
    lines.push(`中文回复: ${spec.translations?.zh?.oem || '待翻译'}`);
    lines.push(`Unit: ${spec.unit} · Result: ${specStatusBadge(spec).replace(/<[^>]+>/g, '')}`, '');
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${title.replace(/[^A-Za-z0-9._-]+/g, '-')}-bilingual-review.txt`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  showToast('Bilingual review downloaded', 'English and Simplified Chinese values are included for offline checking.');
}

function openSpec(id) {
  if (state.role === 'freight') return showToast('Access denied', 'Specifications are not shared with freight accounts.');
  const spec = specs.find(item => item.id === id); if (!spec) return;
  const order = orders.find(item => item.id === spec.orderId); if (!canAccessOrder(order)) return showToast('Access denied', 'This requirement is outside the active organisation.');
  const history = specChanges.filter(change => change.specId === id);
  const status = specStatusBadge(spec);
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">${escapeHTML(spec.id)}</span><h2>${escapeHTML(spec.item)}</h2><p>${escapeHTML(spec.zh)} · ${escapeHTML(spec.orderId)}</p></div><button class="icon-btn" data-close-drawer>×</button></div>
    ${status}<div class="filters spec-language-switch"><button class="filter-btn ${state.specContentLanguage === 'en' ? 'active' : ''}" data-spec-drawer-language="en" data-spec-id="${escapeHTML(spec.id)}">English</button><button class="filter-btn ${state.specContentLanguage === 'zh' ? 'active' : ''}" data-spec-drawer-language="zh" data-spec-id="${escapeHTML(spec.id)}">简体中文</button></div><div class="comparison-grid"><div class="comparison-card required"><span>CUSTOMER / APPROVED REQUIREMENT</span><strong>${escapeHTML(specLanguageValue(spec, 'request'))}</strong><small>${escapeHTML(spec.source)} · original retained</small></div><div class="comparison-card ${!['match','accepted'].includes(spec.status) ? 'conflict' : ''}"><span>OEM QUOTE RESPONSE</span><strong>${escapeHTML(specLanguageValue(spec, 'oem'))}</strong><small>Unit: ${escapeHTML(spec.unit)}</small></div></div>
    ${spec.resolution ? `<div class="source-notice"><strong>Decision: ${escapeHTML(spec.resolution.decision)}</strong><br>${escapeHTML(spec.resolution.reason)} · owner ${escapeHTML(spec.resolution.owner)} · due ${escapeHTML(spec.resolution.due || 'n/a')}</div>` : ''}
    <div class="detail-grid"><div class="detail-box"><span>Segment</span><b>${escapeHTML(spec.segment)}</b></div><div class="detail-box"><span>Responsible</span><b>${escapeHTML(spec.owner)}</b></div><div class="detail-box"><span>Revision events</span><b>${history.length}</b></div><div class="detail-box"><span>Source pointer</span><b>${documentsForSpec(spec.id).some(document => document.attached) ? 'Extraction pending / recorded below' : 'Original upload required'}</b></div></div>
    <div class="section-label">Trace to original file and exact location</div>${specSourceTrace(spec)}
    <div class="section-label">Tracked discussion & revisions</div><div class="activity">${history.length ? history.map(change => `<div class="activity-item"><span class="activity-dot">${change.action.includes('Comment') ? '“' : '≠'}</span><span><b>${escapeHTML(change.action)}</b><small>${escapeHTML(change.actor)} · ${escapeHTML(change.at)}</small><span class="change-reason">${escapeHTML(change.reason)}</span>${change.before || change.after ? `<span class="change-values"><del>${escapeHTML(change.before || '—')}</del><ins>${escapeHTML(change.after || '—')}</ins></span>` : ''}</span></div>`).join('') : '<div class="empty-state"><strong>No revisions yet</strong>This is the first controlled version.</div>'}</div>
    <div class="section-label">Actions</div><div class="head-actions"><button class="btn secondary" data-action="download-spec-review" data-spec-target="${escapeHTML(spec.id)}">Download EN / 中文 review</button><button class="btn secondary" data-action="add-comment" data-spec-target="${escapeHTML(spec.id)}">Add comment</button><button class="btn secondary" data-action="edit-spec" data-spec-target="${escapeHTML(spec.id)}">Edit values</button><button class="btn primary" data-action="resolve-spec" data-spec-target="${escapeHTML(spec.id)}">Resolve difference</button></div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function openSpecHistory() {
  if (state.role === 'freight') return showToast('Access denied', 'Specification history is not shared with freight accounts.');
  const accessibleSpecIds = new Set(specs.filter(spec => canAccessOrder(orders.find(order => order.id === spec.orderId))).map(spec => spec.id));
  const visibleChanges = specChanges.filter(change => accessibleSpecIds.has(change.specId));
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">AUDIT TRAIL</span><h2>Specification history</h2><p>${visibleChanges.length} accessible events · newest first</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="activity history-list">${visibleChanges.map(change => `<div class="activity-item"><span class="activity-dot">≠</span><span><b>${escapeHTML(change.specId)} · ${escapeHTML(change.action)}</b><small>${escapeHTML(change.actor)} · ${escapeHTML(change.at)}</small><span class="change-reason">${escapeHTML(change.reason)}</span>${change.before || change.after ? `<span class="change-values"><del>${escapeHTML(change.before || '—')}</del><ins>${escapeHTML(change.after || '—')}</ins></span>` : ''}</span></div>`).join('')}</div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function openSourceDocument(id) {
  const documentRecord = sourceDocuments.find(document => document.id === id); if (!documentRecord) return;
  if (!canAccessSourceDocument(documentRecord)) return showToast('Access denied', 'This source file is outside the active organisation and assigned orders.');
  const linkedSpecs = specs.filter(spec => documentRecord.orderIds.includes(spec.orderId) && (documentRecord.specIds === 'all' || documentRecord.specIds.includes(spec.id)));
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">${escapeHTML(documentRecord.id)}</span><h2>${escapeHTML(documentRecord.kind)}</h2><p>${documentRecord.attached ? 'Governing source record' : 'Required document placeholder'}</p></div><button class="icon-btn" data-close-drawer>×</button></div>
    ${documentStatusBadge(documentRecord)}<div class="document-hero ${documentRecord.attached ? '' : 'missing'}"><span class="file-icon large">${documentRecord.attached ? (/\.pdf$/i.test(documentRecord.name) ? 'PDF' : /\.xlsx?$/i.test(documentRecord.name) ? 'XLS' : 'DOC') : '+'}</span><span><strong>${escapeHTML(documentDisplayName(documentRecord))}</strong><small>${documentRecord.attached ? `Version ${documentRecord.version} · ${escapeHTML(documentRecord.owner)} · updated ${escapeHTML(documentRecord.updated)}` : `${escapeHTML(documentRecord.kind)} is required · expected owner ${escapeHTML(documentRecord.owner)}`}</small></span></div>
    <div class="detail-grid"><div class="detail-box"><span>Linked orders</span><b>${documentRecord.orderIds.map(escapeHTML).join(', ') || 'Library document'}</b></div><div class="detail-box"><span>Local file</span><b>${documentRecord.attached ? 'Attached and available' : 'Reference only — attach file'}</b></div></div>
    <div class="source-notice">${documentRecord.attached ? 'This is the source used to verify extracted values. Open the original for adjustment, then upload a revision with a reason.' : 'No original bytes are stored. The expected filename is deliberately hidden here so this record cannot be mistaken for an available file.'}</div>
    <div class="head-actions source-actions">${linkedSpecs.length ? `<button class="btn secondary" data-action="download-doc-review" data-doc-target="${escapeHTML(id)}">Download EN / 中文 review</button>` : ''}${documentRecord.attached ? `<button class="btn secondary" data-action="preview-source" data-doc-target="${escapeHTML(id)}">Preview content</button><button class="btn secondary" data-action="open-source" data-doc-target="${escapeHTML(id)}">Open / download original</button>${state.role === 'goatfell' ? `<button class="btn secondary danger-link" data-action="delete-source" data-doc-target="${escapeHTML(id)}">Remove file</button>` : ''}` : ''}<button class="btn primary" data-action="upload-source" data-doc-target="${escapeHTML(id)}">${documentRecord.attached ? 'Upload revised version' : 'Upload required original'}</button></div>
    <div class="section-label">Version history</div>${documentRecord.attached ? `<div class="activity">${documentRecord.versions.slice().reverse().map(version => `<div class="activity-item"><span class="activity-dot">v${version.version}</span><span><b>${escapeHTML(version.fileName)}</b><small>${escapeHTML(version.actor)} · ${escapeHTML(version.at)}</small><span class="change-reason">${escapeHTML(version.reason)}</span></span></div>`).join('')}</div>` : '<div class="empty-state compact"><strong>No uploaded versions</strong>The reference record describes what is required; it does not claim the file exists.</div>'}`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

async function openAttachedSource(id) {
  const documentRecord = sourceDocuments.find(document => document.id === id); if (!documentRecord) return;
  if (!canAccessSourceDocument(documentRecord)) return showToast('Access denied', 'This source file is outside the active organisation and assigned orders.');
  if (!documentRecord.attached) { openDialog('upload-source', id); return; }
  const file = await getSourceFile(id);
  if (!file) { documentRecord.attached = false; persistSourceDocuments(); openSourceDocument(id); showToast('File needs reattaching', 'The metadata exists but the local browser file is unavailable.'); return; }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a'); link.href = url; link.rel = 'noopener';
  if (/pdf|image/i.test(file.type)) { link.target = '_blank'; } else { link.download = file.name || documentRecord.name; }
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  showToast('Source file opened', 'After making changes, upload it as a revised version to preserve the audit trail.');
}

function openPrivateWorkspace() {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  if (state.role !== 'goatfell' || user.boundary !== 'goatfell') {
    document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">RESTRICTED AREA</span><h2>Goatfell Private Workspace</h2><p>Commercial and customer-sensitive records</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="empty-state"><strong>This area is not assigned to your account</strong>Goatfell keeps customer identity and private commercial records in a separate workspace.</div>`;
  } else {
    const committed = orders.reduce((total, order) => total + order.cost, 0); const sales = orders.reduce((total, order) => total + order.value, 0);
    const pendingExpenses = expenseRecords.filter(expense => expense.status !== 'approved');
    document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">GOATFELL ONLY</span><h2>Private Workspace</h2><p>Finance, customers and internal management</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="privacy-banner">◉ Protected from OEM and freight accounts</div><div class="detail-grid"><div class="detail-box"><span>Committed procurement</span><b>${money(committed)}</b></div><div class="detail-box"><span>Recorded sales value</span><b>${money(sales)}</b></div><div class="detail-box"><span>Forecast gross margin</span><b>${money(sales - committed)}</b></div><div class="detail-box"><span>Reimbursements pending</span><b>${pendingExpenses.length} · ${money(pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0))}</b></div></div><div class="section-label">Order-linked finance</div><div class="finance-list">${orders.filter(order => order.value).map(order => `<button class="finance-row" data-order="${order.id}"><span><b>${order.id} · ${order.model}</b><small>${order.customer} · ${order.unit}</small></span><span><b>${money(order.cost)}</b><small>cost · margin ${money(order.value - order.cost)}</small></span><span>›</span></button>`).join('')}</div><div class="section-label">Expenses and reimbursements</div><div class="task-list">${expenseRecords.map(expense => { const order = orders.find(item => item.id === expense.orderId); return `<div class="task"><span class="check ${expense.status === 'approved' ? 'done' : ''}">${expense.status === 'approved' ? '✓' : ''}</span><span><b>${escapeHTML(expense.title)}</b><small>${escapeHTML(expense.orderId)} · ${escapeHTML(order?.unit || 'Unit n/a')} · ${escapeHTML(expense.owner)}</small></span><span class="money">${money(expense.amount)}</span></div>`; }).join('')}</div>`;
  }
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function updateProfileDisplay() {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  const previewing = user.boundary !== state.role;
  const switcher = document.querySelector('#roleSwitcher');
  switcher.disabled = user.boundary !== 'goatfell' || Boolean(state.presentationPartner);
  switcher.querySelectorAll('option').forEach(option => { option.hidden = user.boundary !== 'goatfell' && option.value !== user.boundary; });
  document.querySelector('#profileAvatar').textContent = user.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  document.querySelector('#profileName').textContent = state.presentationPartner ? 'Partner presentation' : previewing ? `Preview · ${document.querySelector('#roleSwitcher').selectedOptions[0].text}` : `${user.name} · ${user.organisation}`;
  document.querySelector('#profileRole').textContent = state.presentationPartner ? 'Goatfell-controlled scope' : previewing ? 'Permission preview' : user.boundary === 'goatfell' ? user.role : 'Assigned workspace';
  document.querySelector('#settingsAccessButton').hidden = user.boundary !== 'goatfell' || state.role !== 'goatfell' || Boolean(state.presentationPartner);
}

function openMyProfile() {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">MY PROFILE</span><h2>${escapeHTML(user.name)}</h2><p>${escapeHTML(user.organisation)}</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="active-user-card"><span class="avatar">${user.name.slice(0,2).toUpperCase()}</span><span><b>${escapeHTML(user.name)}</b><small>${escapeHTML(user.email)}</small></span>${badge(user.status.toUpperCase(), user.status === 'active' ? 'green' : 'amber')}</div><div class="detail-grid"><div class="detail-box"><span>Workspace</span><b>${escapeHTML(user.organisation)}</b></div><div class="detail-box"><span>Assigned orders</span><b>${user.orders[0] === 'all' ? 'All Goatfell orders' : user.orders.length}</b></div></div><div class="source-notice">Account permissions are managed separately in Settings → Access management by an authorised Goatfell administrator.</div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function openAccessCenter() {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  const canAdminister = user.boundary === 'goatfell' && state.role === 'goatfell';
  const administration = canAdminister
    ? `<div class="section-label">People and access boundaries</div><div class="user-list">${state.users.map(item => `<div class="user-row ${item.id === user.id ? 'active' : ''}"><span class="avatar">${item.name.slice(0,2).toUpperCase()}</span><button class="user-identity" data-switch-user="${item.id}"><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.email)} · ${escapeHTML(item.organisation)}</small><small>${item.orders[0] === 'all' ? 'All Goatfell orders' : `${item.orders.length} assigned: ${item.orders.join(', ')}`}</small></button><span class="user-actions">${badge(item.status.toUpperCase(), item.status === 'active' ? 'green' : 'amber')}<button class="link-button" data-action="edit-user" data-user-target="${item.id}">EDIT</button>${item.id !== user.id ? `<button class="link-button danger-link" data-action="delete-user" data-user-target="${item.id}">REMOVE</button>` : ''}</span></div>`).join('')}</div><div class="section-label">Access actions</div><div class="head-actions"><button class="btn primary" data-action="invite-user">+ Invite user</button></div>`
    : `<div class="section-label">Your access</div><div class="detail-grid"><div class="detail-box"><span>Organisation</span><b>${escapeHTML(user.organisation)}</b></div><div class="detail-box"><span>Assigned orders</span><b>${user.orders.length}</b></div></div><div class="privacy-banner">◉ Other users, organisations and invitation controls are hidden from collaborator accounts.</div><div class="head-actions"><button class="btn secondary" data-switch-user="USR-ADAM">Demo only · return to Adam</button></div>`;
  document.querySelector('#drawer').innerHTML = `<div class="drawer-head"><div><span class="eyebrow">SETTINGS</span><h2>${canAdminister ? 'Access management' : 'My access'}</h2><p>${canAdminister ? 'Invite verified email addresses and restrict organisation/order access' : 'Your assigned workspace boundary'}</p></div><button class="icon-btn" data-close-drawer>×</button></div><div class="active-user-card"><span class="avatar">${user.name.slice(0,2).toUpperCase()}</span><span><b>${escapeHTML(user.name)}</b><small>${escapeHTML(user.email)}</small></span>${badge('CURRENT', 'green')}</div>${administration}<div class="source-notice">This demo persists profile changes locally. Production invitations, email verification, MFA and permissions will be enforced by the backend.</div>`;
  document.querySelector('#drawer').classList.add('open'); document.querySelector('#drawerBackdrop').classList.add('open'); bindDynamicEvents();
}

function switchActiveUser(userId) {
  const user = state.users.find(item => item.id === userId); if (!user) return;
  state.currentUserId = userId; state.role = user.boundary; state.orderFilter = 'all'; state.ceFilter = 'all';
  localStorage.setItem('goatfell-current-user', userId); localStorage.setItem('goatfell-role', state.role);
  document.querySelector('#roleSwitcher').value = state.role; renderAll(); applyLanguage(); updateProfileDisplay(); openAccessCenter(); showToast('Active profile changed', `${user.name} now sees the ${user.organisation} access boundary.`);
}

function closeDrawer() { document.querySelector('#drawer').classList.remove('open', 'order-drawer'); document.querySelector('#drawerBackdrop').classList.remove('open'); }

function showToast(title, message) {
  document.querySelector('#toastTitle').textContent = title; document.querySelector('#toastMessage').textContent = message;
  const t = document.querySelector('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3200);
}

function uploadDocumentType(documentRecord) {
  const kind = documentRecord?.kind || '';
  if (/customer specification/i.test(kind)) return 'Customer specification';
  if (/measurement/i.test(kind)) return 'Pickup measurement';
  if (/quotation/i.test(kind)) return 'OEM quotation';
  if (/contract/i.test(kind)) return 'OEM contract';
  if (/drawing/i.test(kind)) return 'Drawing / design';
  if (/production/i.test(kind)) return 'Production evidence';
  if (/inspection/i.test(kind)) return 'Inspection';
  if (/shipping|delivery/i.test(kind)) return 'Shipping / delivery';
  if (/CE|certificate|compliance/i.test(kind)) return 'CE certificate';
  return 'Internal note';
}

function uploadOwner(documentRecord) {
  return ({ 'Partner A': 'sephiroth', 'Partner B': 'earthstorm', 'Freight Partner': 'freight' })[documentRecord?.owner] || 'goatfell';
}

function organisationBoundary(organisation) {
  return ({ 'Goatfell UK': 'goatfell', 'Partner A': 'sephiroth', 'Partner B': 'earthstorm', 'Freight Partner': 'freight' })[organisation];
}

function validateAccessAssignment(organisation, orderIds) {
  if (!orderIds.length) return ['Assign at least one order.'];
  const boundary = organisationBoundary(organisation);
  const concerns = [];
  orderIds.forEach(orderId => {
    if (orderId === 'all') { if (boundary !== 'goatfell') concerns.push('External organisations cannot receive all-order access.'); return; }
    const order = orders.find(item => item.id === orderId);
    if (!order) { concerns.push(`${orderId} is not a recognised order.`); return; }
    if (boundary === 'sephiroth' && order.oem !== 'Partner A') concerns.push(`Blocked: a Partner A account cannot access ${orderId}, owned by ${order.oem}.`);
    if (boundary === 'earthstorm' && order.oem !== 'Partner B') concerns.push(`Blocked: an Partner B account cannot access ${orderId}, owned by ${order.oem}.`);
    if (boundary === 'freight' && !['Freight','UK warehouse'].includes(order.stage)) concerns.push(`Blocked: freight access to ${orderId} is not operationally required at stage ${order.stage}.`);
  });
  return concerns;
}

function orderAccessPicker(selectedOrders = []) {
  const selected = new Set(selectedOrders.includes('all') ? orders.filter(order => !order.archivedAt).map(order => order.id) : selectedOrders);
  const groups = [...new Set(orders.filter(order => !order.archivedAt).map(order => order.oem))];
  return `<div class="access-order-picker">${groups.map(oem => `<fieldset class="access-order-group oem-${oemKey(oem)}"><legend><span class="oem-dot"></span>${escapeHTML(oem)}</legend>${orders.filter(order => !order.archivedAt && order.oem === oem).map(order => `<label><input type="checkbox" name="assignedOrders" value="${escapeHTML(order.id)}" ${selected.has(order.id) ? 'checked' : ''}><span><b>${escapeHTML(order.id)} · ${escapeHTML(order.model)}</b><small>${escapeHTML(order.unit)} · ${escapeHTML(vehicleLabel(order.vehicle))} · ${escapeHTML(order.stage)}</small></span></label>`).join('')}</fieldset>`).join('')}</div>`;
}

function openDialog(type, target = '') {
  const dialog = document.querySelector('#appDialog'); const title = document.querySelector('#dialogTitle'); const eyebrow = document.querySelector('#dialogEyebrow'); const body = document.querySelector('#dialogBody'); const submit = document.querySelector('#dialogSubmit');
  const spec = specs.find(item => item.id === target);
  const targetOrder = orders.find(item => item.id === target);
  const targetDocument = sourceDocuments.find(item => item.id === target);
  const targetMilestone = orderMilestones.find(item => item.id === target);
  const primarySpecDocument = spec && documentsForSpec(spec.id).find(document => document.orderIds.includes(spec.orderId));
  const primarySpecPointer = primarySpecDocument ? spec?.locations?.[primarySpecDocument.id] || {} : {};
  const managedUser = state.users.find(item => item.id === target);
  const configs = {
    'new-order': ['NEW ORDER', 'Create a manufacturing order', `<div id="orderWarning"></div><div class="form-grid"><div class="field"><label>Product model</label><select name="model" required><option>LUX Compact</option><option>LUX Extended</option><option>LUX Max-Length</option><option>INDIE Triangle</option><option>INDIE Double-side</option></select></div><div class="field"><label>OEM</label><select name="oem"><option>Partner A</option><option>Partner B</option></select></div><div class="field"><label>Customer reference</label><input name="customer" placeholder="Customer or internal reference" required></div><div class="field"><label>Pickup make and model</label><input name="vehicle" placeholder="e.g. Toyota Hilux"></div><div class="field"><label>Pickup model year</label><input name="vehicleYear" inputmode="numeric" pattern="(?:19|20)\d{2}" placeholder="Leave blank to record n/a"></div><div class="field full"><label>First required action</label><textarea name="note" placeholder="Describe the next action or missing information"></textarea></div></div>`, 'Create order'],
    'add-certificate': ['COMPLIANCE RECORD', 'Add CE / technical certificate', `<div class="form-grid"><div class="field"><label>OEM</label><select name="oem"><option>Partner A</option><option>Partner B</option><option>Legacy Partner</option></select></div><div class="field"><label>Model</label><select name="model"><option>LUX</option><option>INDIE</option><option>Legacy</option></select></div><div class="field"><label>Component</label><input name="component" required placeholder="e.g. Inverter / charger"></div><div class="field"><label>Document type</label><input name="document" required placeholder="e.g. Declaration of Conformity"></div><div class="field"><label>Certificate reference</label><input name="ref" placeholder="Certificate or test report number"></div><div class="field"><label>Next review / expiry</label><input name="review" type="date"></div><div class="field full"><label>File</label><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png"></div></div>`, 'Save certificate'],
    'date-change': ['CONTROLLED DATE CHANGE', 'Request forecast date change', `<div class="form-grid"><div class="field"><label>Milestone</label><select><option>Production complete</option><option>Final inspection</option><option>Factory collection</option><option>UK port arrival</option></select></div><div class="field"><label>Proposed date</label><input type="date" required></div><div class="field full"><label>Reason for change</label><textarea required placeholder="A reason is mandatory and the original baseline date will be preserved."></textarea></div></div>`, 'Submit request'],
    'new-task': ['TASK', 'Create a tracked task', `<div class="form-grid"><div class="field full"><label>Task</label><input name="task" required placeholder="What needs to be completed?"></div><div class="field"><label>Responsible organisation</label><select><option>Goatfell</option><option>Partner A</option><option>Partner B</option><option>Freight Partner</option></select></div><div class="field"><label>Due date</label><input type="date"></div><div class="field full"><label>Order / unit</label><input value="GF-2607-01"></div></div>`, 'Create task'],
    'add-spec': ['CONTROLLED SPECIFICATION', 'Add a requirement', `<div class="form-grid"><div class="field"><label>Order</label><select name="orderId" required>${visibleOrders().map(order => `<option value="${order.id}">${order.id} · ${order.model}</option>`).join('')}</select></div><div class="field"><label>Segment</label><select name="segment">${specSegments.map(segment => `<option>${segment}</option>`).join('')}</select></div><div class="field"><label>Stable specification ID</label><input name="id" required pattern="[A-Za-z0-9._-]+" placeholder="e.g. ELEC.CHARGER"></div><div class="field"><label>Responsible person</label><select name="owner"><option>Adam</option><option>Justin</option><option>Adam & Justin</option><option>OEM</option></select></div><div class="field"><label>English name</label><input name="item" required></div><div class="field"><label>Chinese name / 中文</label><input name="zh" required></div><div class="field full"><label>Customer / approved requirement</label><textarea name="request" required></textarea></div><div class="field"><label>OEM quote response</label><input name="oem" placeholder="Leave blank if omitted"></div><div class="field"><label>Quantity and unit</label><input name="unit" required placeholder="e.g. 4 pcs, mm, W"></div><div class="field full"><label>Source</label><select name="source"><option>Customer spec</option><option>Technical protocol</option><option>OEM quote</option><option>Contract</option><option>Drawing</option></select></div><div class="field full"><label>Reason for adding this requirement</label><textarea name="reason" required></textarea></div></div>`, 'Add requirement'],
    'edit-spec': ['TRACKED REVISION', `Edit ${escapeHTML(target)}`, spec ? `<div class="form-grid"><div class="field full"><label>Requirement</label><textarea name="request" required>${escapeHTML(spec.request)}</textarea></div><div class="field full"><label>OEM quote response</label><textarea name="oem" required>${escapeHTML(spec.oem)}</textarea></div><div class="field full"><label>简体中文 · Requirement preview</label><textarea name="zhRequest">${escapeHTML(spec.translations?.zh?.request || '')}</textarea></div><div class="field full"><label>简体中文 · OEM response preview</label><textarea name="zhOem">${escapeHTML(spec.translations?.zh?.oem || '')}</textarea></div><div class="field"><label>Quantity / unit</label><input name="unit" required value="${escapeHTML(spec.unit)}"></div><div class="field"><label>Comparison result</label><select name="status"><option value="match" ${spec.status === 'match' ? 'selected' : ''}>Match</option><option value="changed" ${spec.status === 'changed' ? 'selected' : ''}>Different — review required</option><option value="missing" ${spec.status === 'missing' ? 'selected' : ''}>Missing from quote</option><option value="accepted" ${spec.status === 'accepted' ? 'selected' : ''}>Accepted deviation</option><option value="deferred" ${spec.status === 'deferred' ? 'selected' : ''}>Deferred / TBC</option></select></div><div class="field"><label>Segment</label><select name="segment">${specSegments.map(segment => `<option ${spec.segment === segment ? 'selected' : ''}>${segment}</option>`).join('')}</select></div><div class="field"><label>Responsible person</label><select name="owner"><option ${spec.owner === 'Adam' ? 'selected' : ''}>Adam</option><option ${spec.owner === 'Justin' ? 'selected' : ''}>Justin</option><option ${spec.owner === 'Adam & Justin' ? 'selected' : ''}>Adam & Justin</option><option ${spec.owner === 'OEM' ? 'selected' : ''}>OEM</option></select></div><div class="field"><label>Source</label><select name="source"><option ${spec.source === 'Customer spec' ? 'selected' : ''}>Customer spec</option><option ${spec.source === 'Technical protocol' ? 'selected' : ''}>Technical protocol</option><option ${spec.source === 'OEM quote' ? 'selected' : ''}>OEM quote</option><option ${spec.source === 'Contract' ? 'selected' : ''}>Contract</option><option ${spec.source === 'Drawing' ? 'selected' : ''}>Drawing</option></select></div><div class="field"><label>Source sheet / PDF page</label><input name="sourceSheet" value="${escapeHTML(primarySpecPointer.sheet || (primarySpecPointer.page ? `Page ${primarySpecPointer.page}` : ''))}" placeholder="e.g. Options or Page 3"></div><div class="field"><label>Row, column or cell range</label><input name="sourceCell" value="${escapeHTML(primarySpecPointer.cell || '')}" placeholder="e.g. row 18, columns B–D"></div><div class="field full"><label>Reason for change — required</label><textarea name="reason" required placeholder="Explain why this value is changing. The previous value will remain in history."></textarea></div></div>` : '', 'Save revision'],
    'add-comment': ['TRACKED DISCUSSION', `Comment on ${escapeHTML(target)}`, `<div class="form-grid"><div class="field full"><label>Visible to</label><select name="audience"><option>Goatfell and Partner A</option><option>Goatfell only</option></select></div><div class="field full"><label>Comment</label><textarea name="comment" required placeholder="Ask a question or explain the reason for the difference."></textarea></div></div>`, 'Post comment'],
    'upload-source': ['QUARANTINED UPLOAD', sourceDocuments.find(document => document.id === target)?.attached ? 'Check a revised version' : 'Check and attach source file', `<div class="source-notice">The file stays private and temporary until it passes validation and a Goatfell user confirms the audience.</div><div class="form-grid"><div class="field full"><label>Document record</label><input value="${escapeHTML(sourceDocuments.find(document => document.id === target)?.name || target)}" disabled></div><div class="field"><label>Order</label><select name="orderId" required>${orders.map(order => `<option value="${order.id}" ${sourceDocuments.find(document => document.id === target)?.orderIds.includes(order.id) ? 'selected' : ''}>${order.id} · ${order.model} · ${order.oem}</option>`).join('')}</select></div><div class="field"><label>Document type</label><select name="documentType" required>${['Customer specification','Pickup measurement','OEM quotation','OEM contract','Drawing / design','Production evidence','Inspection','Shipping / delivery','CE certificate','Customer contract','Customer identity','Sales / finance','Expense / reimbursement','Internal note'].map(kind => `<option ${uploadDocumentType(sourceDocuments.find(document => document.id === target)) === kind ? 'selected' : ''}>${kind}</option>`).join('')}</select></div><div class="field"><label>Owner organisation</label><select name="owner" required>${[['goatfell','Goatfell UK'],['sephiroth','Partner A'],['earthstorm','Partner B'],['freight','Freight Partner']].map(([value,label]) => `<option value="${value}" ${uploadOwner(sourceDocuments.find(document => document.id === target)) === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div><div class="field"><label>Intended audience</label><select name="audience" required><option value="goatfell">Goatfell only</option><option value="sephiroth">Goatfell + Partner A</option><option value="earthstorm">Goatfell + Partner B</option><option value="freight">Goatfell + freight partner</option></select></div><div class="field full"><label>Select file</label><input name="sourceFile" type="file" required accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png"></div><div class="field full"><label>Reason / version note</label><textarea name="reason" required placeholder="Explain what changed or confirm that this is the current governing file."></textarea></div></div>`, 'Run safety check'],
    'presentation-mode': ['SAFE PRESENTATION', 'Choose one partner', `<div class="source-notice">This temporary session hides every other partner, all customer identity, finance, internal comments and user administration.</div><div class="form-grid"><div class="field full"><label>Meeting scope</label><select name="partner" required><option value="sephiroth">Goatfell + Partner A</option><option value="earthstorm">Goatfell + Partner B</option><option value="freight">Goatfell + Freight Partner</option></select></div></div>`, 'Start presentation'],
    'invite-user': ['ACCESS INVITATION', 'Invite a user', `<div class="source-notice">Any normal email address, including QQ, can be invited. Select visible order cards; cross-OEM access is blocked.</div><div id="accessWarning"></div><div class="form-grid"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email address</label><input name="email" type="email" required placeholder="Company, QQ or other verified email"></div><div class="field"><label>Organisation</label><select name="organisation"><option>Goatfell UK</option><option>Partner A</option><option>Partner B</option><option>Freight Partner</option></select></div><div class="field"><label>Role</label><select name="role"><option>OEM collaborator</option><option>Project manager</option><option>Inspector</option><option>Freight collaborator</option><option>Finance viewer</option></select></div><div class="field full"><label>Orders this person can see</label>${orderAccessPicker([])}</div><div class="field full"><label>Access note</label><textarea name="reason" required placeholder="Why does this user need access?"></textarea></div></div>`, 'Check and create invitation'],
    'edit-user': ['ACCESS REVIEW', `Edit ${escapeHTML(managedUser?.name || 'user')}`, managedUser ? `<div class="source-notice">Changing organisation or visibility is checked against every selected order. Cross-partner access is blocked even for administrators.</div><div id="accessWarning"></div><div class="form-grid"><div class="field"><label>Name</label><input name="name" required value="${escapeHTML(managedUser.name)}"></div><div class="field"><label>Email address</label><input name="email" type="email" required value="${escapeHTML(managedUser.email)}"></div><div class="field"><label>Organisation</label><select name="organisation">${['Goatfell UK','Partner A','Partner B','Freight Partner'].map(value => `<option ${managedUser.organisation === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="field"><label>Internal permission category</label><select name="role">${['Administrator','OEM collaborator','Project manager','Inspector','Freight collaborator','Finance viewer'].map(value => `<option ${managedUser.role === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="field full"><label>Orders this person can see</label>${orderAccessPicker(managedUser.orders)}</div><div class="field"><label>Status</label><select name="status"><option value="active" ${managedUser.status === 'active' ? 'selected' : ''}>Active</option><option value="invited" ${managedUser.status === 'invited' ? 'selected' : ''}>Invited</option><option value="suspended" ${managedUser.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div><div class="field full"><label>Reason (required only when access changes)</label><textarea name="reason" placeholder="A display-name-only correction does not require a reason."></textarea></div></div>` : '', 'Check and save access'],
    'resolve-spec': ['DIFFERENCE DECISION', `Resolve ${escapeHTML(spec?.id || target)}`, spec ? `<div class="source-notice">The original requirement and OEM response remain unchanged. This decision records the accepted outcome, owner and deadline.</div><div class="form-grid"><div class="field"><label>Decision</label><select name="decision"><option value="request-revision">Request OEM revision</option><option value="accept-deviation">Accept OEM deviation</option><option value="confirm-match">Confirm values match</option><option value="defer">Defer / TBC</option></select></div><div class="field"><label>Responsible</label><select name="owner"><option>Partner A</option><option>Partner B</option><option>Adam</option><option>Justin</option><option>Adam & Justin</option></select></div><div class="field"><label>Due date</label><input name="due" type="date"></div><div class="field full"><label>Decision reason</label><textarea name="reason" required placeholder="Explain why this is accepted, returned or deferred."></textarea></div></div>` : '', 'Record decision'],
    'delete-order': ['ARCHIVE ORDER', `Archive ${escapeHTML(targetOrder?.id || target)}`, targetOrder ? `<div class="safety-status warning"><strong>Recoverable archive</strong><span>The order is hidden from active work and all partner accounts. ${documentsForOrder(targetOrder.id).length} files, ${specsForOrder(targetOrder.id).length} requirements and ${state.tasks.filter(task => task.order === targetOrder.id).length} tasks remain linked and can be restored.</span></div><div class="field"><label>Reason for archiving</label><textarea name="reason" required></textarea></div>` : '', 'Archive order'],
    'delete-source': ['REMOVE FILE BYTES', `Remove ${escapeHTML(targetDocument?.kind || 'file')}`, targetDocument ? `<div class="safety-status warning"><strong>The audit record remains</strong><span>The local file bytes will be deleted. The required-document placeholder and version history stay visible so a missing file cannot be mistaken for an available one.</span></div><div class="field"><label>Reason for removal</label><textarea name="reason" required></textarea></div>` : '', 'Remove file'],
    'update-milestone': ['MILESTONE CONTROL', `Update ${escapeHTML(targetMilestone?.name || 'milestone')}`, targetMilestone ? `<div class="form-grid"><div class="field"><label>Owner</label><select name="owner">${['Adam','Justin','Partner A','Partner B','Freight Partner','Legacy Partner'].map(value => `<option ${targetMilestone.owner === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input name="due" type="date" required value="${escapeHTML(targetMilestone.due)}"></div><div class="field"><label>Status</label><select name="status">${[['waiting','Waiting'],['planned','Planned'],['complete','Complete']].map(([value,label]) => `<option value="${value}" ${targetMilestone.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div><div class="field full"><label>What are we waiting for?</label><input name="waitingOn" required value="${escapeHTML(targetMilestone.waitingOn)}"></div><div class="field full"><label>Reason for change</label><textarea name="reason" required></textarea></div></div>` : '', 'Save milestone'],
    'delete-user': ['REMOVE ACCESS', `Remove ${escapeHTML(managedUser?.name || 'user')}`, managedUser ? `<div class="safety-status blocked"><strong>This removes the local prototype account</strong><span>${escapeHTML(managedUser.email)} will no longer appear or be selectable. Production removal must also revoke server sessions and signed links.</span></div><div class="field"><label>Reason for removal</label><textarea name="reason" required></textarea></div>` : '', 'Remove user']
  };
  const cfg = configs[type] || ['TRACKED ACTION', 'Add an update', `<div class="form-grid"><div class="field full"><label>Comment or evidence note</label><textarea required placeholder="This update will be recorded in the audit trail."></textarea></div><div class="field full"><label>Attachment</label><input type="file"></div></div>`, 'Save update'];
  eyebrow.textContent = cfg[0]; title.innerHTML = cfg[1]; body.innerHTML = cfg[2]; submit.textContent = cfg[3]; submit.dataset.dialogType = type; submit.dataset.dialogTarget = target; dialog.showModal();
}

async function saveDialog(type, form) {
  const fd = new FormData(form);
  const target = document.querySelector('#dialogSubmit').dataset.dialogTarget;
  if (type === 'new-order') {
    const model = String(fd.get('model')); const oem = String(fd.get('oem'));
    if ((model.startsWith('LUX') && oem !== 'Partner A') || (model.startsWith('INDIE') && oem !== 'Partner B')) {
      document.querySelector('#orderWarning').innerHTML = '<div class="validation-item blocked">× LUX is manufactured by Partner A and INDIE by Partner B. Change the model or OEM.</div>'; return false;
    }
    const sequence = String(orders.length + 1).padStart(2, '0'); const id = `GF-DEMO-${sequence}`;
    const year = String(fd.get('vehicleYear') || '').trim(); const pickup = String(fd.get('vehicle') || '').trim();
    orders.unshift({ id, unit: 'Unit pending', model, oem, vehicle: `${pickup || 'Pickup not recorded'}${year ? ` · ${year}` : ''}`, customer: String(fd.get('customer')), stage: 'Intake', status: 'attention', progress: 5, value: 0, cost: 0, next: String(fd.get('note') || 'Upload customer specification and measurement form'), date: '' });
    persistOrders(); renderAll(); openOrder(id); showToast('Order created', `${id} is ready for source files; missing year displays as n/a.`);
  } else if (type === 'add-certificate') {
    const oem = fd.get('oem'); const model = fd.get('model');
    state.certificates.push({ id: Date.now(), oem, model, component: fd.get('component') || 'New component', document: fd.get('document') || 'Technical document', ref: fd.get('ref') || 'Pending', status: fd.get('ref') ? 'review' : 'missing', review: fd.get('review') || 'Review required' });
    localStorage.setItem('goatfell-certificates', JSON.stringify(state.certificates)); renderCompliance(); showToast('Certificate recorded', `${oem} compliance register has been updated.`);
  } else if (type === 'add-spec') {
    const id = String(fd.get('id')).toUpperCase();
    if (specs.some(item => item.id === id)) { showToast('ID already exists', 'Use a unique stable specification ID.'); return false; }
    const response = String(fd.get('oem') || '').trim();
    const spec = { id, orderId: String(fd.get('orderId')), segment: String(fd.get('segment')), locations: {}, item: fd.get('item'), zh: fd.get('zh'), request: fd.get('request'), oem: response || 'Not stated', unit: fd.get('unit'), status: response ? 'changed' : 'missing', source: fd.get('source'), owner: fd.get('owner'), translations: { zh: { request: '', oem: '' } } };
    specs.push(spec); recordSpecChange(id, 'Requirement added', fd.get('reason'), '—', `${spec.request} / OEM: ${spec.oem}`); ensureAttentionTask(spec); persistSpecs(); renderSpecs(); renderOverview(); showToast('Requirement added', `${id} is now tracked and compared.`);
  } else if (type === 'edit-spec') {
    const spec = specs.find(item => item.id === target); if (!spec) return false;
    const before = `Requirement: ${spec.request} · OEM: ${spec.oem} · Unit: ${spec.unit} · Result: ${spec.status}`;
    spec.request = fd.get('request'); spec.oem = fd.get('oem'); spec.unit = fd.get('unit'); spec.status = fd.get('status'); spec.segment = fd.get('segment'); spec.owner = fd.get('owner'); spec.source = fd.get('source');
    spec.translations = { ...(spec.translations || {}), zh: { request: String(fd.get('zhRequest') || ''), oem: String(fd.get('zhOem') || '') } };
    const pointerDocument = documentsForSpec(spec.id).find(document => document.orderIds.includes(spec.orderId));
    if (pointerDocument && (String(fd.get('sourceSheet') || '').trim() || String(fd.get('sourceCell') || '').trim())) spec.locations[pointerDocument.id] = { sheet: String(fd.get('sourceSheet') || '').trim() || 'Sheet n/a', cell: String(fd.get('sourceCell') || '').trim() || 'row/column n/a' };
    const after = `Requirement: ${spec.request} · OEM: ${spec.oem} · Unit: ${spec.unit} · Result: ${spec.status}`;
    recordSpecChange(spec.id, 'Controlled values revised', fd.get('reason'), before, after); ensureAttentionTask(spec); persistSpecs(); renderSpecs(); renderOverview(); openSpec(spec.id); showToast('Revision saved', 'The prior values and reason remain in the audit trail.');
  } else if (type === 'add-comment') {
    const spec = specs.find(item => item.id === target); if (!spec) return false;
    recordSpecChange(spec.id, `Comment · ${fd.get('audience')}`, fd.get('comment'), '', ''); persistSpecs(); renderSpecs(); openSpec(spec.id); showToast('Comment posted', 'The discussion is linked to this specification item.');
  } else if (type === 'resolve-spec') {
    const spec = specs.find(item => item.id === target); if (!spec) return false;
    const decision = String(fd.get('decision')); const labels = { 'request-revision': 'OEM revision requested', 'accept-deviation': 'OEM deviation accepted', 'confirm-match': 'Confirmed as match', defer: 'Deferred / TBC' };
    const before = spec.status; spec.status = decision === 'accept-deviation' ? 'accepted' : decision === 'confirm-match' ? 'match' : decision === 'defer' ? 'deferred' : (spec.status === 'missing' ? 'missing' : 'changed');
    spec.owner = String(fd.get('owner')); spec.resolution = { decision: labels[decision], owner: spec.owner, due: String(fd.get('due')), reason: String(fd.get('reason')), actor: actorName(), at: nowLabel() };
    if (decision === 'request-revision') state.tasks.unshift({ id: Date.now(), specId: spec.id, title: `Revise quote response: ${spec.item}`, order: spec.orderId, due: spec.resolution.due || 'Action required', owner: spec.owner, done: false });
    recordSpecChange(spec.id, labels[decision], spec.resolution.reason, before, spec.status); persistSpecs(); renderAll(); openSpec(spec.id); showToast('Difference decision recorded', `${spec.id} is now ${labels[decision].toLowerCase()}.`);
  } else if (type === 'upload-source') {
    const documentRecord = sourceDocuments.find(document => document.id === target); if (!documentRecord) return false;
    const file = fd.get('sourceFile'); if (!(file instanceof File) || !file.size) return false;
    const context = { orderId: String(fd.get('orderId')), documentType: String(fd.get('documentType')), owner: String(fd.get('owner')), audience: String(fd.get('audience')), recordOrderIds: documentRecord.orderIds };
    const result = await inspectUpload(file, context);
    const audienceLabels = { goatfell: 'Goatfell only', sephiroth: 'Goatfell + Partner A', earthstorm: 'Goatfell + Partner B', freight: 'Goatfell + freight partner' };
    state.pendingUpload = { documentId: target, file, reason: String(fd.get('reason')), ...context, audienceLabel: audienceLabels[context.audience], result };
    showUploadReview(state.pendingUpload);
  } else if (type === 'presentation-mode') {
    startPresentation(String(fd.get('partner')));
  } else if (type === 'delete-order') {
    const order = orders.find(item => item.id === target); if (!order || state.role !== 'goatfell') return false;
    order.archivedAt = nowLabel(); order.archivedReason = String(fd.get('reason')); order.archivedBy = actorName();
    recordDeletion('order-archive', order.id, order.archivedReason, { model: order.model, oem: order.oem }); persistOrders(); closeDrawer(); renderAll(); openArchive(); showToast('Order archived', `${order.id} is hidden from active and partner views, but can be restored.`);
  } else if (type === 'delete-source') {
    const documentRecord = sourceDocuments.find(item => item.id === target); if (!documentRecord || state.role !== 'goatfell') return false;
    await deleteSourceFile(documentRecord.id); recordDeletion('file-bytes', documentRecord.id, String(fd.get('reason')), { name: documentRecord.name, version: documentRecord.version });
    documentRecord.attached = false; documentRecord.status = 'missing'; documentRecord.deletedAt = nowLabel(); documentRecord.lastInspection = null; persistSourceDocuments(); renderAll(); openSourceDocument(documentRecord.id); showToast('File removed', 'The bytes were deleted; the requirement placeholder and audit history remain.');
  } else if (type === 'update-milestone') {
    const milestone = orderMilestones.find(item => item.id === target); if (!milestone) return false;
    const before = { ...milestone }; milestone.owner = String(fd.get('owner')); milestone.due = String(fd.get('due')); milestone.status = String(fd.get('status')); milestone.waitingOn = String(fd.get('waitingOn')); milestone.lastReason = String(fd.get('reason')); milestone.updatedAt = nowLabel();
    localStorage.setItem('goatfell-milestone-audit', JSON.stringify([{ id: Date.now(), target, actor: actorName(), at: nowLabel(), reason: milestone.lastReason, before, after: { ...milestone } }, ...JSON.parse(localStorage.getItem('goatfell-milestone-audit') || '[]')].slice(0, 100))); persistMilestones(); renderAll(); openOrder(milestone.orderId); showToast('Milestone updated', `${milestone.name} is assigned to ${milestone.owner}.`);
  } else if (type === 'invite-user' || type === 'edit-user') {
    const organisation = String(fd.get('organisation'));
    const orderIds = fd.getAll('assignedOrders').map(value => String(value));
    const concerns = validateAccessAssignment(organisation, orderIds);
    const managed = state.users.find(item => item.id === target);
    if (type === 'edit-user' && managed) {
      const accessChanged = managed.email !== String(fd.get('email')) || managed.organisation !== organisation || managed.role !== String(fd.get('role')) || managed.status !== String(fd.get('status')) || [...managed.orders].sort().join('|') !== [...orderIds].sort().join('|');
      if (accessChanged && !String(fd.get('reason') || '').trim()) concerns.push('Explain the reason because email, organisation, permission category, status or assigned-order access changed.');
    }
    if (type === 'edit-user' && managed?.id === state.currentUserId && organisation !== 'Goatfell UK') concerns.push('The current Goatfell administrator cannot move their own account into an external organisation.');
    if (concerns.length) {
      const warning = document.querySelector('#accessWarning'); if (warning) warning.innerHTML = `<div class="validation-list">${concerns.map(message => `<div class="validation-item blocked">× ${escapeHTML(message)}</div>`).join('')}</div>`;
      showToast('Access change blocked', concerns[0]); return false;
    }
    const values = { name: String(fd.get('name')), email: String(fd.get('email')), organisation, role: String(fd.get('role')), boundary: organisationBoundary(organisation), orders: orderIds, note: String(fd.get('reason')) };
    if (type === 'edit-user' && managed) Object.assign(managed, values, { status: String(fd.get('status')) });
    else state.users.push({ id: `USR-${Date.now()}`, ...values, status: 'invited' });
    localStorage.setItem('goatfell-users', JSON.stringify(state.users)); openAccessCenter(); showToast(type === 'edit-user' ? 'Access updated' : 'Invitation created', `${values.email} is restricted to ${orderIds.length} assigned order(s).`);
  } else if (type === 'delete-user') {
    const index = state.users.findIndex(item => item.id === target); if (index < 0 || target === state.currentUserId) return false;
    const [removed] = state.users.splice(index, 1); recordDeletion('user-access', removed.id, String(fd.get('reason')), removed); localStorage.setItem('goatfell-users', JSON.stringify(state.users)); openAccessCenter(); showToast('Access removed', `${removed.email} was removed and the action was retained in the audit log.`);
  } else { showToast('Change recorded', 'A timestamped activity entry has been added.'); }
  return true;
}

function bindDynamicEvents() {
  document.querySelectorAll('[data-order]').forEach(el => el.onclick = () => openOrder(el.dataset.order));
  document.querySelectorAll('[data-order-tab]').forEach(el => el.onclick = event => { event.stopPropagation(); openOrder(el.dataset.orderId, el.dataset.orderTab); });
  document.querySelectorAll('[data-spec]').forEach(el => el.onclick = () => openSpec(el.dataset.spec));
  document.querySelectorAll('[data-source-doc]').forEach(el => el.onclick = event => { event.stopPropagation(); openSourceDocument(el.dataset.sourceDoc); });
  document.querySelectorAll('[data-switch-user]').forEach(el => el.onclick = () => switchActiveUser(el.dataset.switchUser));
  document.querySelectorAll('[data-close-drawer]').forEach(el => el.onclick = closeDrawer);
  document.querySelectorAll('[data-view-jump]').forEach(el => el.onclick = () => switchView(el.dataset.viewJump));
  document.querySelectorAll('[data-order-filter]').forEach(el => el.onclick = () => { state.orderFilter = el.dataset.orderFilter; renderOrders(); bindDynamicEvents(); });
  document.querySelectorAll('[data-spec-order]').forEach(el => el.onclick = () => { state.specOrderId = el.dataset.specOrder; localStorage.setItem('goatfell-spec-order', state.specOrderId); renderSpecs(); bindDynamicEvents(); });
  document.querySelectorAll('[data-spec-language]').forEach(el => el.onclick = () => { state.specContentLanguage = el.dataset.specLanguage; localStorage.setItem('goatfell-spec-content-language', state.specContentLanguage); renderSpecs(); bindDynamicEvents(); });
  document.querySelectorAll('[data-spec-drawer-language]').forEach(el => el.onclick = () => { state.specContentLanguage = el.dataset.specDrawerLanguage; localStorage.setItem('goatfell-spec-content-language', state.specContentLanguage); openSpec(el.dataset.specId); });
  document.querySelectorAll('[data-create-doc]').forEach(el => el.onclick = () => {
    const order = orders.find(item => item.id === el.dataset.createDoc); if (!order) return;
    const kind = el.dataset.docKind; const id = `DOC-${order.id.replace(/[^A-Z0-9]/gi, '')}-${Date.now()}`;
    sourceDocuments.push({ id, name: '', kind, owner: /quotation|production|drawing/i.test(kind) ? order.oem : 'Goatfell', orderIds: [order.id], specIds: [], version: 0, status: 'missing', updated: 'Not uploaded', attached: false, versions: [] });
    persistSourceDocuments(); openDialog('upload-source', id);
  });
  document.querySelectorAll('[data-restore-order]').forEach(el => el.onclick = () => { const order = orders.find(item => item.id === el.dataset.restoreOrder); if (!order || state.role !== 'goatfell') return; delete order.archivedAt; delete order.archivedReason; delete order.archivedBy; persistOrders(); renderAll(); openArchive(); showToast('Order restored', `${order.id} is visible in active order views again.`); });
  document.querySelectorAll('[data-ce-filter]').forEach(el => el.onclick = () => { state.ceFilter = el.dataset.ceFilter; renderCompliance(); bindDynamicEvents(); });
  document.querySelectorAll('[data-task]').forEach(el => el.onclick = () => { const t = state.tasks.find(x => x.id === Number(el.dataset.task)); t.done = !t.done; localStorage.setItem('goatfell-tasks', JSON.stringify(state.tasks)); renderOverview(); bindDynamicEvents(); showToast(t.done ? 'Task completed' : 'Task reopened', t.title); });
  document.querySelectorAll('[data-action]').forEach(el => el.onclick = e => {
    e.stopPropagation(); const action = el.dataset.action;
    if (['new-order','add-certificate','date-change','new-task','upload-evidence','add-spec','edit-spec','add-comment','resolve-spec','upload-source','delete-source','delete-order','invite-user','edit-user','delete-user','new-repair','update-milestone','request-file'].includes(action)) return openDialog(action, el.dataset.specTarget || el.dataset.docTarget || el.dataset.userTarget || el.dataset.orderTarget || el.dataset.milestoneTarget || '');
    if (action === 'view-archive') return openArchive();
    if (action === 'download-spec-review') return downloadBilingualReview([el.dataset.specTarget], el.dataset.specTarget);
    if (action === 'download-doc-review') { const documentRecord = sourceDocuments.find(document => document.id === el.dataset.docTarget); if (!documentRecord) return; const ids = specs.filter(spec => documentRecord.orderIds.includes(spec.orderId) && (documentRecord.specIds === 'all' || documentRecord.specIds.includes(spec.id))).map(spec => spec.id); return downloadBilingualReview(ids, documentRecord.id); }
    if (action === 'open-source') return openAttachedSource(el.dataset.docTarget);
    if (action === 'preview-source') return previewSourceDocument(el.dataset.docTarget);
    if (action === 'confirm-upload') return confirmPendingUpload();
    if (action === 'discard-upload') { state.pendingUpload = null; closeDrawer(); return showToast('Upload cancelled', 'No file or document version was created.'); }
    if (action === 'retry-upload') { const documentId = state.pendingUpload?.documentId || ''; state.pendingUpload = null; closeDrawer(); return openDialog('upload-source', documentId); }
    if (action === 'history') return openSpecHistory();
    if (action === 'approve-date') return showToast('Date change approved', 'The baseline remains in history and dependent milestones were flagged.');
    if (action === 'reject-date') return showToast('Change returned', 'The OEM has been asked to provide a revised plan.');
    if (action === 'record-approval') return showToast('Approval recorded', 'The workflow gate and audit history have been updated.');
    showToast('Report prepared', 'This prototype records the action; production export will generate a controlled file.');
  });
}

document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => switchView(el.dataset.view)));
document.querySelector('#roleSwitcher').value = state.role;
document.querySelector('#roleSwitcher').addEventListener('change', e => {
  const user = state.users.find(item => item.id === state.currentUserId) || state.users[0];
  if (user.boundary !== 'goatfell') {
    state.role = user.boundary; e.target.value = user.boundary;
    return showToast('Access boundary locked', 'Collaborator profiles cannot elevate themselves or preview another organisation.');
  }
  state.role = e.target.value; state.orderFilter = 'all'; state.ceFilter = 'all'; localStorage.setItem('goatfell-role', state.role); renderAll(); applyLanguage(); updateProfileDisplay(); showToast('Permission preview changed', `Now showing the ${e.target.selectedOptions[0].text} boundary.`);
});
document.querySelector('#languageToggle').addEventListener('click', () => { state.language = state.language === 'en' ? 'zh' : 'en'; localStorage.setItem('goatfell-language', state.language); applyLanguage(); });
document.querySelector('#globalSearch').addEventListener('input', e => { state.search = e.target.value; renderOverview(); renderOrders(); bindDynamicEvents(); });
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
document.querySelector('#drawerBackdrop').addEventListener('click', closeDrawer);
document.querySelector('#profileButton').addEventListener('click', openMyProfile);
document.querySelector('#settingsAccessButton').addEventListener('click', openAccessCenter);
document.querySelector('#privateWorkspaceButton').addEventListener('click', openPrivateWorkspace);
document.querySelector('#presentationButton').addEventListener('click', () => openDialog('presentation-mode'));
document.querySelector('#exitPresentationButton').addEventListener('click', endPresentation);
document.querySelector('#notificationButton').addEventListener('click', () => { switchView('compliance'); showToast('5 items need attention', 'Compliance and approval items are shown first.'); });
document.querySelectorAll('[data-dialog-close]').forEach(button => button.addEventListener('click', () => document.querySelector('#appDialog').close()));
document.querySelector('#dialogForm').addEventListener('submit', async e => { const type = document.querySelector('#dialogSubmit').dataset.dialogType; e.preventDefault(); if (!e.currentTarget.reportValidity()) return; if (await saveDialog(type, e.currentTarget) !== false) document.querySelector('#appDialog').close(); });

renderAll(); applyLanguage(); updateProfileDisplay();
