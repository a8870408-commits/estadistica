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
    name:String(row[2]), summary:String(row[3]), answers:String(row[4]), notification:String(row[5]), assessment:assessClosed(String(row[4])), open:openItems(String(row[3]),String(row[4])), review:readReview(row[6]), feedback:String(row[7]||''), reviewedAt:row[8] instanceof Date?row[8].toISOString():String(row[8]||'')
  }))};
}

const ANSWER_KEY = {"Quina variable és qualitativa?":"El mitjà de transport per anar a l’institut","Les dades són 2, 4 i 6. Quina és la mitjana?":"4","Quina és la mediana de 7, 2, 4 i 3?":"3,5","Quina és la moda de 1, 2, 2, 3 i 5?":"2","En un institut de Vic, de 20 alumnes d’una mostra, 5 venen amb bicicleta. Quin percentatge representen?":"25 %","Quin és el rang de 2, 4, 7 i 10?":"8","Quina mostra és més adequada per estudiar tot l’institut?":"Alumnes de diferents cursos i grups","Un sector ocupa la meitat del cercle. Quin percentatge representa?":"50 %","Quin gràfic triaries per mostrar la temperatura a Girona durant una setmana?":"Un gràfic de línies","La freqüència absoluta d’un valor és…":"El nombre de vegades que apareix","Si cada valor apareix una sola vegada, què direm de la moda?":"No hi ha moda","Les dades són 1, 1, 2, 2 i 3. Quines modes tenen?":"1 i 2","Quina mesura acostuma a resistir millor un valor extrem?":"La mediana","En un gràfic de barres, un eix que comença a 9 pot…":"Exagerar les diferències entre 10 i 12","Quina és una conclusió prudent?":"A la nostra mostra, 12 de 20 prefereixen bàsquet","Quants alumnes venen a peu?":5,"Quin percentatge ve amb bicicleta?":30,"Quina és la mitjana?":3,"Quina és la mediana?":2.5,"Quina és la moda?":2,"Quants alumnes han respost?":20,"Quin percentatge prefereix bàsquet?":60,"Quina és la nova mitjana?":8,"Quina és la nova mediana?":3,"Quin és el nou rang?":26};
function readReview(raw){try{return JSON.parse(raw||'{}');}catch(e){return {};}}
function sections(body){return body.split('\n\n').map(block=>{const split=block.indexOf('\n');return {name:block.slice(0,split),text:block.slice(split+1)};});}
function assessClosed(body){const items=[];sections(body).forEach(section=>{try{const answers=JSON.parse(section.text);if(!Array.isArray(answers))return;answers.forEach(a=>{if(!a||typeof a.pregunta!=='string'||!Object.prototype.hasOwnProperty.call(ANSWER_KEY,a.pregunta))return;const expected=ANSWER_KEY[a.pregunta];const correct=typeof expected==='number'?String(a.resposta).trim()!==''&&Math.abs(Number(String(a.resposta).replace(',','.'))-expected)<0.001:String(a.resposta).trim()===expected;items.push({question:a.pregunta,answer:a.resposta,expected,correct});});}catch(e){}});const correct=items.filter(i=>i.correct).length;return {items,total:items.length,correct,wrong:items.length-correct,percent:items.length?Math.round(correct/items.length*100):null};}
function openItems(summary,body){const items=[{key:'summary',title:'Resum de l’alumne',text:summary}];sections(body).forEach(s=>{if(s.name==='Conclusió')items.push({key:'conclusion',title:'Conclusió del laboratori',text:s.text});if(s.name==='Projecte'){try{const data=JSON.parse(s.text);Object.keys(data).forEach((key,i)=>items.push({key:'project-'+i,title:key,text:String(data[key])}));}catch(e){}}});return items;}
function saveTeacherReview(id,review,feedback){
  if(typeof id!=='string'||!review||typeof review!=='object'||typeof feedback!=='string'||feedback.length>5000)throw Error('Revisió invàlida.');
  const lock=LockService.getDocumentLock();lock.waitLock(20000);
  try{const sheet=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lliuraments');const rows=sheet.getDataRange().getValues();const index=rows.findIndex((r,i)=>i>0&&String(r[0])===id);if(index<1)throw Error('No es troba el lliurament.');const valid={};openItems(String(rows[index][3]),String(rows[index][4])).forEach(item=>{const entry=review[item.key];if(!entry)return;if(!['pending','achieved','developing','revise'].includes(entry.level)||typeof entry.comment!=='string'||entry.comment.length>2000)throw Error('Valoració invàlida.');valid[item.key]={level:entry.level,comment:entry.comment};});sheet.getRange(1,7,1,3).setValues([['Revisió docent','Feedback docent','Data de revisió']]);sheet.getRange(index+1,7,1,3).setValues([[JSON.stringify(valid),/^[=+@\-\t\r]/.test(feedback)?"'"+feedback:feedback,new Date()]]);return 'Revisió desada. L’alumne pot consultar-la amb el seu identificador de lliurament.';}finally{lock.releaseLock();}
}
