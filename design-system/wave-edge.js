// Generates the wavy bottom edge used under the hero band (and any band that "ends" into the page).
// Usage: el.style.setProperty('--wave-edge', waveEdge())  or inline the returned string at build time.
export function waveEdge(points = 96){
  const pts = ['0 0', '100% 0'];
  for (let i = points; i >= 0; i--){
    const t = i / points;
    const y = 14 + 12*Math.sin(t*Math.PI*5) + 5*Math.sin(t*Math.PI*13);
    pts.push(`${(t*100).toFixed(2)}% calc(100% - ${y.toFixed(1)}px)`);
  }
  return `polygon(${pts.join(',')})`;
}
