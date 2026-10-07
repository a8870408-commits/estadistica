// Run setup once from the Google Apps Script editor with your XTEC account.
const TEACHER_EMAIL = 'a8870408@xtec.cat';
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const book = SpreadsheetApp.create('Dades.cat · Lliuraments');
    const sheet = book.getSheets()[0]; sheet.setName('Lliuraments');
    sheet.appendRow(['Identificador','Data de recepció','Nom','Resum de l’alumne','Respostes','Notificació']);
    sheet.setFrozenRows(1); props.setProperty('SHEET_ID',book.getId());
  }
  // Requests email authorization without sending a message.
  MailApp.getRemainingDailyQuota();
  console.log('Full del professorat: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID'));
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function receipt(title,message) { return HtmlService.createHtmlOutput('<!doctype html><html lang="ca"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dades.cat · Lliurament</title><body style="font:18px system-ui;background:#f4effc;color:#362450;padding:40px;max-width:700px;margin:auto"><h1>'+escapeHTML(title)+'</h1><p style="line-height:1.7;white-space:pre-wrap">'+escapeHTML(message)+'</p><p>Pots tancar aquesta pestanya i tornar a l’aplicació.</p></body></html>'); }
function literal(value) { const s=String(value); return /^[=+@\-\t\r]/.test(s)?"'"+s:s; }
function doGet(e) { if(e&&e.parameter&&e.parameter.feedback)return studentFeedback(e.parameter.feedback);return receipt('Servei de lliuraments','Per enviar el treball, utilitza el botó «Lliura les respostes» de Dades.cat.'); }
function doPost(e) {
  const lock = LockService.getScriptLock(); let locked=false;
  try {
    const raw=e && e.parameter && e.parameter.payload;
    if(!raw || raw.length>45000) throw Error('El treball és buit o massa llarg.');
    const data=JSON.parse(raw);
    if(!data || typeof data.name!=='string' || !data.name.trim() || data.name.length>100) throw Error('Cal indicar un nom vàlid.');
    if(typeof data.summary!=='string' || data.summary.trim().length<20 || data.summary.length>3000) throw Error('El resum ha de tenir entre 20 i 3.000 caràcters.');
    if(typeof data.id!=='string' || !/^[a-zA-Z0-9-]{20,80}$/.test(data.id)) throw Error('Identificador de lliurament invàlid.');
    if(!Array.isArray(data.responses) || !data.responses.length || data.responses.length>30) throw Error('Cal incloure respostes d’alguna activitat.');
    const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if(!id) throw Error('El professorat encara ha de configurar el servei.');
    locked=lock.tryLock(20000);if(!locked)throw Error('El servei està ocupat. Torna-ho a provar amb el mateix lliurament.');
    const sheet=SpreadsheetApp.openById(id).getSheetByName('Lliuraments');
    if(sheet.getLastRow()>1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(data.id).matchEntireCell(true).findNext()) return receipt('Lliurament ja registrat','Aquest treball ja està desat. No s’ha creat una còpia duplicada.');
    const date=new Date();const body=data.responses.map(r=>{
      if(!r || typeof r.section!=='string' || r.section.length>150)throw Error('Format de resposta invàlid.');
      return r.section+'\n'+(typeof r.answers==='string'?r.answers:JSON.stringify(r.answers,null,2));
    }).join('\n\n');
    sheet.appendRow([data.id,date,literal(data.name.trim()),literal(data.summary.trim()),literal(body),'Pendent']);
    const row=sheet.getLastRow();let emailed=false;
    try {
      MailApp.sendEmail({to:TEACHER_EMAIL,subject:'Dades.cat · Lliurament de '+data.name.trim(),body:'Nom: '+data.name.trim()+'\nRebut: '+Utilities.formatDate(date,'Europe/Madrid','dd/MM/yyyy HH:mm:ss')+'\nIdentificador: '+data.id+'\n\nResum de l’alumne:\n'+data.summary.trim()+'\n\nRespostes rebudes:\n'+body+'\n\nLes respostes provenen del navegador; els camps «correcta» no són qualificacions verificades pel servidor.\nFull del professorat: https://docs.google.com/spreadsheets/d/'+id});
      emailed=true;sheet.getRange(row,6).setValue('Enviada');
    } catch(err) {sheet.getRange(row,6).setValue('No enviada: consulta el full');}
    return receipt('Treball rebut i desat', 'Identificador: '+data.id+'. El lliurament queda registrat amb la data del servidor. '+(emailed?'S’ha tramès la notificació al professorat.':'La notificació per correu no ha funcionat, però el professorat pot consultar el treball al full.'));
  } catch(err) {return receipt('No s’ha confirmat el lliurament',err.message+' Revisa les dades i torna-ho a provar.');}
  finally {if(locked)lock.releaseLock();}
}

function studentFeedback(id){
  if(!/^[a-f0-9-]{36}$/i.test(id))return receipt('Identificador invàlid','Revisa l’identificador del teu lliurament.');
  const sheetId=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!sheetId)return receipt('Servei no configurat','El professorat ha de configurar el servei.');
  const rows=SpreadsheetApp.openById(sheetId).getSheetByName('Lliuraments').getDataRange().getValues();
  const row=rows.find((r,i)=>i>0&&String(r[0])===id);if(!row)return receipt('Lliurament no trobat','Comprova que la recepció del treball estigui confirmada.');
  if(!row[8])return receipt('Pendent de revisió','El treball està rebut. El professorat encara no ha publicat la revisió.');
  let review={};try{review=JSON.parse(row[6]||'{}');}catch(e){}
  const labels={pending:'Pendent de revisió',achieved:'Assolit',developing:'En procés',revise:'Cal revisar'};
  const text=Object.keys(review).map(key=>(key==='summary'?'Resum':key==='conclusion'?'Conclusió':'Apartat del projecte '+(Number(key.split('-')[1])+1))+': '+(labels[review[key].level]||'Pendent')+'\n'+review[key].comment).join('\n\n');
  return receipt('El retorn del teu treball', 'Feedback del professorat:\n'+String(row[7]||'Sense comentari global.')+'\n\n'+text);
}
