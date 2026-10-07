// Install this in the Apps Script project BOUND TO the private submissions Sheet.
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Dades.cat').addItem('Obre el dashboard', 'openDashboard').addToUi();
}
function openDashboard() {
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('Dashboard').setWidth(1150).setHeight(750), 'Dades.cat · Professorat');
}
function getTeacherData() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('Lliuraments');
  if (!sheet) throw new Error('No hi ha cap pestanya «Lliuraments» en aquest full.');
  const rows = sheet.getDataRange().getValues().slice(1).filter(row=>row[0]);
  return {updated: new Date().toISOString(), sheetUrl: book.getUrl(), rows: rows.map(row=>({
    id:String(row[0]), date:row[1] instanceof Date?row[1].toISOString():String(row[1]),
    name:String(row[2]), summary:String(row[3]), answers:String(row[4]), notification:String(row[5])
  }))};
}
