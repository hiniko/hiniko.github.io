// live site first: repo homepage, else its GitHub Pages path on the custom domain (the user-site repo is this site, so it keeps the repo link)
const pageUrl = r => r.homepage || (r.has_pages && !r.name.endsWith('.github.io') ? `https://shermanrose.uk/${r.name}/` : null);

export function cardsFor(pinned, repos) {
  const byName = new Map((repos ?? []).map(r => [r.name.toLowerCase(), r]));
  return pinned.map(name => {
    const r = byName.get(name.toLowerCase());
    return r
      ? { name: r.name, url: pageUrl(r) ?? r.html_url, description: r.description ?? '', language: r.language ?? null, stars: r.stargazers_count ?? 0 }
      : { name, url: `https://github.com/hiniko/${name}`, description: '', language: null, stars: null };
  });
}

export const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
