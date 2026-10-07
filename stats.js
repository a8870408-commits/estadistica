export function summarize(values) {
  if (!values.length || values.some(v => !Number.isFinite(v))) throw new Error('Escriu almenys un nombre vàlid.');
  const sorted = [...values].sort((a,b) => a-b);
  const counts = new Map();
  sorted.forEach(v => counts.set(v,(counts.get(v)||0)+1));
  const max = Math.max(...counts.values());
  return {mean: values.reduce((a,b)=>a+b,0)/values.length, median: sorted.length%2 ? sorted[(sorted.length-1)/2] : (sorted[sorted.length/2-1]+sorted[sorted.length/2])/2, modes: max===1 ? [] : [...counts].filter(([,n])=>n===max).map(([v])=>v), counts: [...counts], total: values.length};
}

export function parseData(raw, categorical = false) {
  const tokens = raw.trim() ? raw.trim().split(categorical ? /[;\n]/ : /[;\s]+/).map(s => s.trim()) : [];
  if (!tokens.length || tokens.some(s => !s)) throw new Error('Escriu almenys una dada i evita separadors buits.');
  if (tokens.length > 100) throw new Error('Fes servir un màxim de 100 dades.');
  if (categorical) {
    if (tokens.some(s => s.length > 60)) throw new Error('Cada categoria pot tenir fins a 60 caràcters.');
    return tokens.map(s => s.toLocaleLowerCase('ca'));
  }
  const values = tokens.map(s => /^[-+]?\d+(?:[.,]\d+)?$/.test(s) ? Number(s.replace(',', '.')) : NaN);
  if (values.some(v => !Number.isFinite(v) || Math.abs(v) > 1e12) || !Number.isFinite(values.reduce((a,b)=>a+b,0))) throw new Error('Revisa els nombres: separa’ls amb espais o punt i coma.');
  return values;
}
export function frequencies(values) {
  const counts = new Map();
  values.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts].map(([value, count]) => ({value, count, relative: count / values.length}));
}
export function toCSV(rows) {
  const quote = v => '"' + String(v).replaceAll('"', '""') + '"';
  return '\uFEFF' + [['Valor','Freqüència absoluta','Freqüència relativa','Percentatge'],...rows.map(r=>[r.value,r.count,r.relative,r.relative*100])].map(row=>row.map(quote).join(';')).join('\n');
}
