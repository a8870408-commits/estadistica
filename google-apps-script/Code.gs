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
  return studentDashboard(row);
}
function studentDashboard(row){
  let review={};try{review=JSON.parse(row[6]||'{}');}catch(e){}
  const a=assessClosed(String(row[4]));const labels={pending:'Pendent',achieved:'Assolit',developing:'En procés',revise:'Cal revisar'};
  const feedback=row[8]?String(row[7]||'Sense comentari global.'):'El professorat encara no ha revisat el treball. Torna a consultar aquest espai més endavant.';
  const date=row[1] instanceof Date?Utilities.formatDate(row[1],'Europe/Madrid','dd/MM/yyyy HH:mm'):String(row[1]);
  const html=`<!doctype html><html lang="ca"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dades.cat · El meu espai</title><style>*{box-sizing:border-box}body{font:16px system-ui;background:#f6f2fc;color:#36254c;margin:0;padding:28px;max-width:950px;margin:auto}h1{font-size:32px}h2{font-size:21px}p{line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.panel,.metric{background:white;border:1px solid #e7def0;border-radius:18px;padding:22px;margin:18px 0}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{background:#ede4fa;margin:0}.metric strong{display:block;font-size:29px;margin-top:10px}.small{font-size:13px;color:#796588}.tag{background:#e5f3e9;color:#396b4b;padding:6px 10px;border-radius:9px;display:inline-block}.wrong{background:#fff0df;color:#8d5e26}button{font:inherit;background:#7651cc;color:white;border:0;border-radius:10px;padding:12px;cursor:pointer}@media(max-width:600px){body{padding:16px}.metrics{grid-template-columns:1fr}.metric strong{font-size:24px}}@media print{button{display:none}body{background:white}.panel{break-inside:avoid}}</style></head><body><p class="small">DADES.CAT · EL MEU ESPAI</p><h1>Hola, ${escapeHTML(row[2])}!</h1><p class="small">Treball rebut el ${escapeHTML(date)}. Conserva l’enllaç privat d’aquest espai.</p><div class="metrics"><div class="metric">Respostes corregides<strong>${a.total}</strong></div><div class="metric">Correctes<strong>${a.total?a.percent+' %':'—'}</strong></div><div class="metric">Per revisar<strong>${a.total?(100-a.percent)+' %':'—'}</strong></div><p class="small">Percentatges de les preguntes tancades rebudes i reconegudes. Les obertes les revisa el professorat.</p><section class="panel"><h2>El feedback del professorat</h2><span class="tag">${row[8]?'Revisat':'Pendent de revisió'}</span><p>${escapeHTML(feedback)}</p></section><section class="panel"><h2>El teu resum</h2><p>${escapeHTML(row[3])}</p></section><section class="panel"><h2>Les teves respostes, explicades</h2>${a.items.length?a.items.map(i=>`<article class="panel"><span class="tag ${i.correct?'':'wrong'}">${i.correct?'✓ Correcta':'↻ Revisa aquesta resposta'}</span><h3>${escapeHTML(i.question)}</h3><p>La teva resposta: ${escapeHTML(i.answer)}\nResposta esperada: ${escapeHTML(i.expected)}</p></article>`).join(''):'<p>Aquest lliurament no inclou preguntes tancades reconegudes.</p>'}</section><section class="panel"><h2>Revisió de les respostes obertes</h2>${openItems(String(row[3]),String(row[4])).map(item=>{const entry=review[item.key]||{};return `<article><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p><span class="tag">${escapeHTML(labels[entry.level]||'Pendent')}</span><p>${escapeHTML(entry.comment||'Encara no hi ha comentaris per a aquest apartat.')}</p></article>`;}).join('')}</section><button onclick="window.print()">Imprimeix o desa en PDF</button><p class="small">No comparteixis l’enllaç: qui tingui l’identificador pot consultar aquest treball. Aquest accés no verifica la identitat.</p></body></html>`;
  return HtmlService.createHtmlOutput(html);
}

const ANSWER_KEY = {"Quina variable és qualitativa?":"El mitjà de transport per anar a l’institut","Les dades són 2, 4 i 6. Quina és la mitjana?":"4","Quina és la mediana de 7, 2, 4 i 3?":"3,5","Quina és la moda de 1, 2, 2, 3 i 5?":"2","En un institut de Vic, de 20 alumnes d’una mostra, 5 venen amb bicicleta. Quin percentatge representen?":"25 %","Quin és el rang de 2, 4, 7 i 10?":"8","Quina mostra és més adequada per estudiar tot l’institut?":"Alumnes de diferents cursos i grups","Un sector ocupa la meitat del cercle. Quin percentatge representa?":"50 %","Quin gràfic triaries per mostrar la temperatura a Girona durant una setmana?":"Un gràfic de línies","La freqüència absoluta d’un valor és…":"El nombre de vegades que apareix","Si cada valor apareix una sola vegada, què direm de la moda?":"No hi ha moda","Les dades són 1, 1, 2, 2 i 3. Quines modes tenen?":"1 i 2","Quina mesura acostuma a resistir millor un valor extrem?":"La mediana","En un gràfic de barres, un eix que comença a 9 pot…":"Exagerar les diferències entre 10 i 12","Quina és una conclusió prudent?":"A la nostra mostra, 12 de 20 prefereixen bàsquet","Quants alumnes venen a peu?":5,"Quin percentatge ve amb bicicleta?":30,"Quina és la mitjana?":3,"Quina és la mediana?":2.5,"Quina és la moda?":2,"Quants alumnes han respost?":20,"Quin percentatge prefereix bàsquet?":60,"Quina és la nova mitjana?":8,"Quina és la nova mediana?":3,"Quin és el nou rang?":26};

function sections(body){return body.split('\n\n').map(block=>{const split=block.indexOf('\n');return {name:block.slice(0,split),text:block.slice(split+1)};});}
function assessClosed(body){const items=[];sections(body).forEach(section=>{try{const answers=JSON.parse(section.text);if(!Array.isArray(answers))return;answers.forEach(a=>{if(!a||typeof a.pregunta!=='string'||!Object.prototype.hasOwnProperty.call(ANSWER_KEY,a.pregunta))return;const expected=ANSWER_KEY[a.pregunta];const correct=typeof expected==='number'?String(a.resposta).trim()!==''&&Math.abs(Number(String(a.resposta).replace(',','.'))-expected)<0.001:String(a.resposta).trim()===expected;items.push({question:a.pregunta,answer:a.resposta,expected,correct});});}catch(e){}});const correct=items.filter(i=>i.correct).length;return {items,total:items.length,correct,wrong:items.length-correct,percent:items.length?Math.round(correct/items.length*100):null};}
function openItems(summary,body){const items=[{key:'summary',title:'Resum de l’alumne',text:summary}];sections(body).forEach(s=>{if(s.name==='Conclusió')items.push({key:'conclusion',title:'Conclusió del laboratori',text:s.text});if(s.name==='Projecte'){try{const data=JSON.parse(s.text);Object.keys(data).forEach((key,i)=>items.push({key:'project-'+i,title:key,text:String(data[key])}));}catch(e){}}});return items;}
