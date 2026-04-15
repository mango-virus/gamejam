const STATUS_CACHE_KEY = 'jam-status-cache-v1';
const STATUS_CACHE_TTL = 5 * 60 * 1000;

function getCachedStatus(repo) {
  try {
    const cache = JSON.parse(localStorage.getItem(STATUS_CACHE_KEY) || '{}');
    const entry = cache[repo];
    if (entry && Date.now() - entry.ts < STATUS_CACHE_TTL) return entry.data;
  } catch {}
  return null;
}

function setCachedStatus(repo, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(STATUS_CACHE_KEY) || '{}');
    cache[repo] = { ts: Date.now(), data };
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function clearStatusCache() {
  try { localStorage.removeItem(STATUS_CACHE_KEY); } catch {}
}

async function fetchStatus(repo, force = false) {
  if (!force) {
    const cached = getCachedStatus(repo);
    if (cached) return cached;
  }
  const [repoRes, runsRes] = await Promise.allSettled([
    fetch(`https://api.github.com/repos/${repo}`),
    fetch(`https://api.github.com/repos/${repo}/actions/workflows/pages.yml/runs?per_page=1`),
  ]);
  const repoInfo = repoRes.status === 'fulfilled' && repoRes.value.ok ? await repoRes.value.json() : null;
  const runs = runsRes.status === 'fulfilled' && runsRes.value.ok ? await runsRes.value.json() : null;
  const run = runs?.workflow_runs?.[0] || null;
  const data = {
    pushedAt: repoInfo?.pushed_at || null,
    deploy: run ? {
      status: run.status,
      conclusion: run.conclusion,
      htmlUrl: run.html_url,
    } : null,
  };
  setCachedStatus(repo, data);
  return data;
}

function relativeTime(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const DEPLOY_LABELS = {
  success: 'deployed',
  failure: 'deploy failed',
  cancelled: 'cancelled',
  in_progress: 'deploying…',
  queued: 'queued',
  waiting: 'waiting',
  skipped: 'skipped',
};

function renderStatus(container, data) {
  container.innerHTML = '';
  if (!data.pushedAt && !data.deploy) {
    container.innerHTML = '<span class="status-loading">status unavailable</span>';
    return;
  }
  if (data.pushedAt) {
    const c = document.createElement('span');
    c.className = 'status-commit';
    c.textContent = `updated ${relativeTime(data.pushedAt)}`;
    container.appendChild(c);
  }
  if (data.deploy) {
    const key = data.deploy.conclusion || data.deploy.status || 'unknown';
    const s = document.createElement('a');
    s.className = `status-deploy status-${key}`;
    if (data.deploy.htmlUrl) {
      s.href = data.deploy.htmlUrl;
      s.target = '_blank';
      s.rel = 'noopener';
    }
    s.textContent = DEPLOY_LABELS[key] || key;
    s.addEventListener('click', e => e.stopPropagation());
    container.appendChild(s);
  }
}

async function enhanceCardWithStatus(card, game, force = false) {
  if (!game.repo) return;
  const container = card.querySelector('.status');
  if (!container) return;
  container.innerHTML = '<span class="status-loading">loading status…</span>';
  try {
    const data = await fetchStatus(game.repo, force);
    renderStatus(container, data);
  } catch {
    container.innerHTML = '<span class="status-loading">status unavailable</span>';
  }
}

async function loadGames(force = false) {
  const grid = document.getElementById('grid');
  try {
    const res = await fetch('games.json', { cache: 'no-store' });
    const data = await res.json();
    const games = (data.games || []).filter(g => g.id !== 'example');

    if (games.length === 0) {
      grid.innerHTML = '<p class="empty">No games submitted yet. Be the first — read <a href="https://github.com/CallumHYoung/gamejam/blob/main/GETTING_STARTED.md">GETTING_STARTED.md</a>.</p>';
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

      if (g.status) {
        const sb = document.createElement('span');
        sb.className = `badge badge-status badge-status-${g.status}`;
        sb.textContent = g.status.toUpperCase();
        thumbWrap.appendChild(sb);
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
        <div class="status"></div>
      `;

      card.appendChild(thumbWrap);
      card.appendChild(body);
      grid.appendChild(card);

      enhanceCardWithStatus(card, g, force);
    }
  } catch (err) {
    grid.innerHTML = `<p class="empty">Could not load games.json: ${escapeHtml(err.message)}</p>`;
  }
}

function setupRefresh() {
  const btn = document.getElementById('refresh-status');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Refreshing…';
    clearStatusCache();
    await loadGames(true);
    btn.textContent = original;
    btn.disabled = false;
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

loadGames();
setupRefresh();
