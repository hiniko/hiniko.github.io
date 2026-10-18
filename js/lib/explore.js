export function pick(pool, n, rng = Math.random) {
  const left = pool.slice(), out = [], kinds = new Set();
  while (out.length < n && left.length) {
    const fresh = left.filter(x => !kinds.has(x.kind));
    const from = fresh.length ? fresh : left;
    const item = from[Math.min(from.length - 1, Math.floor(rng() * from.length))];
    out.push(item); kinds.add(item.kind); left.splice(left.indexOf(item), 1);
  }
  return out;
}
