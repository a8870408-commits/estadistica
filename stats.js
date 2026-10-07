export function summarize(values) {
  if (!values.length || values.some(v => !Number.isFinite(v))) throw new Error('Escriu almenys un nombre vàlid.');
  const sorted = [...values].sort((a,b) => a-b);
  const counts = new Map();
  sorted.forEach(v => counts.set(v,(counts.get(v)||0)+1));
  const max = Math.max(...counts.values());
  return {mean: values.reduce((a,b)=>a+b,0)/values.length, median: sorted.length%2 ? sorted[(sorted.length-1)/2] : (sorted[sorted.length/2-1]+sorted[sorted.length/2])/2, modes: max===1 ? [] : [...counts].filter(([,n])=>n===max).map(([v])=>v), counts: [...counts], total: values.length};
}
