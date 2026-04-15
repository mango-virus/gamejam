async function loadGames() {
  const grid = document.getElementById('grid');
  try {
    const res = await fetch('games.json', { cache: 'no-store' });
    const data = await res.json();
    const games = (data.games || []).filter(g => g.id !== 'example');

    if (games.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted)">No games submitted yet. Be the first — read the <a href="SPEC.md">spec</a>.</p>';
      return;
    }

    grid.innerHTML = '';
    for (const g of games) {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = g.url;
      card.target = '_blank';
      card.rel = 'noopener';

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'thumb-wrap';

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      if (g.thumbnail) thumb.style.backgroundImage = `url("${g.thumbnail}")`;
      thumbWrap.appendChild(thumb);

      if (g.type) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = g.type.toUpperCase();
        thumbWrap.appendChild(badge);
      }

      if (g.multiplayer) {
        const mp = document.createElement('span');
        mp.className = 'badge badge-mp';
        mp.textContent = 'MULTIPLAYER';
        thumbWrap.appendChild(mp);
      }

      const body = document.createElement('div');
      body.className = 'body';
      body.innerHTML = `
        <h3>${escapeHtml(g.title)}</h3>
        <p class="author">by ${escapeHtml(g.author)}</p>
        <p class="desc">${escapeHtml(g.description || '')}</p>
        <div class="tags">${(g.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      `;

      card.appendChild(thumbWrap);
      card.appendChild(body);
      grid.appendChild(card);
    }
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--muted)">Could not load games.json: ${escapeHtml(err.message)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

loadGames();
