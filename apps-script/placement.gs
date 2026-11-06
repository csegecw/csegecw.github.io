/**
 * ACE · GEC Wayanad — CSE placement data collection.
 *
 * SETUP
 * 1. Create a Google Sheet (e.g. "CSE Placement Data").
 * 2. Extensions → Apps Script. Delete the default code, paste this file, save.
 * 3. Run `setup` once from the editor (Run ▸ setup) and accept the permissions.
 *    It creates the header row and a Drive folder for resumes.
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as: Me      Who has access: Anyone
 *    Copy the Web app URL (ends in /exec) and paste it into src/content.js (placement.endpoint).
 * After editing this script later: Deploy → Manage deployments → Edit → New version.
 */

var SHEET_NAME = 'Placement';
var FOLDER_NAME = 'CSE Placement Resumes';
var HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Sem', 'Skills', 'Other skills', 'Achievements', 'Resume'];
var MAX_BYTES = 5 * 1024 * 1024;
var ALLOWED = /\.(pdf|docx?)$/i;

function setup() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  getFolder_();
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);

    var name = clean_(d.name, 120), email = clean_(d.email, 200), phone = clean_(d.phone, 20), sem = clean_(d.sem, 20);
    if (!name || !email || !phone || !sem) return json_({ ok: false, error: 'Missing required fields' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json_({ ok: false, error: 'Invalid email' });
    if (!d.resume || !d.resume.data) return json_({ ok: false, error: 'Resume missing' });

    var fileName = String(d.resume.name || 'resume.pdf').replace(/[^\w.\- ]/g, '_').slice(0, 100);
    if (!ALLOWED.test(fileName)) return json_({ ok: false, error: 'Invalid file type' });
    var bytes = Utilities.base64Decode(d.resume.data);
    if (bytes.length > MAX_BYTES) return json_({ ok: false, error: 'File too large' });

    var blob = Utilities.newBlob(bytes, d.resume.type || 'application/octet-stream', name + ' - ' + fileName);
    var file = getFolder_().createFile(blob);

    getSheet_().appendRow([
      new Date(), name, email, phone, sem,
      clean_(d.skills, 600), clean_(d.otherSkills, 200), clean_(d.achievements, 2000),
      file.getUrl()
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'ACE placement form' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function getFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* recreate below */ }
  }
  var folder = DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

// Trim, cap length, and neutralise spreadsheet formulas (=, +, -, @) typed by a user.
function clean_(v, max) {
  var s = String(v == null ? '' : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
