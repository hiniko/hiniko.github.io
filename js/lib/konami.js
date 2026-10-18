export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export function matcher(seq) {
  const recent = [];
  return key => {
    recent.push(key); if (recent.length > seq.length) recent.shift();
    return recent.length === seq.length && recent.every((k, i) => k.toLowerCase() === seq[i].toLowerCase());
  };
}
