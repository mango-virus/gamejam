(() => {
  const REVEAL_AT_DEFAULT = Date.parse('2026-04-17T12:00:00-04:00');
  const END_AT_DEFAULT = Date.parse('2026-05-23T23:59:00-04:00');

  // Theme + mechanic payload, base64-encoded so the reveal is not visible
  // in page source before the gate opens.
  const PAYLOAD_B64 =
    'eyJ0aGVtZSI6eyJuYW1lIjoiRG91YmxlIE1lYW5pbmcifSwibWVjaGFuaWMiOnsibmFtZSI6IkNob2ljZXMiLCJkZXNjIjoiU29tZSB1bml0IG9mIHRoZSBnYW1lIGhhcHBlbnMgYW5kIHRoZSBwbGF5ZXIgaXMgc2hvd24gJ2Nob2ljZXMnIHRoYXQgYWx0ZXIgdGhlIGdhbWUgc3RhdGUuIFRoZXNlIGNob2ljZXMgY2FuIGJlIGJ1ZmZzLCBkZWJ1ZmZzLCBvciBhbHRlcmF0aW9ucyDigJQgYnV0IHRoZXkgbXVzdCBpbXBhY3QgdGhlIGdhbWUgbG9vcCBhbmQgY2FuJ3QgYmUgcHVyZWx5IGNvc21ldGljLiBUaGV5IHNob3VsZCBwbGF5IGEgcGl2b3RhbCBwYXJ0IG9mIHRoZSBnYW1lLiJ9fQ==';

  function decodePayload(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
  }

  const params = new URLSearchParams(location.search);
  const preview = params.get('revealPreview');

  function resolveRevealAt() {
    if (preview === 'sealed') return Date.now() + 1000 * 60 * 60 * 48;
    if (preview === 'now') return Date.now() + 3500;
    if (preview === 'unlocked') return Date.now() - 1000;
    return REVEAL_AT_DEFAULT;
  }

  const revealAt = resolveRevealAt();

  const gate = document.querySelector('.reveal-gate');
  if (!gate) return;

  const sealedPanel = gate.querySelector('.reveal-sealed-panel');
  const unlockedPanel = gate.querySelector('.reveal-unlocked-panel');
  const cdDays = gate.querySelector('[data-cd="days"]');
  const cdHours = gate.querySelector('[data-cd="hours"]');
  const cdMinutes = gate.querySelector('[data-cd="minutes"]');
  const cdSeconds = gate.querySelector('[data-cd="seconds"]');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const diff = Math.max(0, revealAt - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
    return diff;
  }

  function populateUnlocked() {
    const data = decodePayload(PAYLOAD_B64);
    unlockedPanel.querySelector('[data-slot="theme-name"]').textContent = data.theme.name;
    unlockedPanel.querySelector('[data-slot="mech-name"]').textContent = data.mechanic.name;
    unlockedPanel.querySelector('[data-slot="mech-desc"]').textContent = data.mechanic.desc;
  }

  function showUnlockedImmediate() {
    populateUnlocked();
    sealedPanel.hidden = true;
    unlockedPanel.hidden = false;
    gate.dataset.state = 'unlocked';
  }

  function playReveal() {
    populateUnlocked();
    gate.dataset.state = 'closing';
    sealedPanel.hidden = true;
    unlockedPanel.hidden = false;
    unlockedPanel.style.opacity = '0';

    setTimeout(() => {
      gate.dataset.state = 'opening';
      unlockedPanel.style.opacity = '';
    }, 450);

    setTimeout(() => {
      gate.dataset.state = 'unlocked';
    }, 2100);

    if (typeof window.jamBurst === 'function') {
      setTimeout(() => window.jamBurst(), 550);
    }
  }

  if (Date.now() >= revealAt) {
    showUnlockedImmediate();
    return;
  }

  gate.dataset.state = 'sealed';
  updateCountdown();
  const timer = setInterval(() => {
    if (updateCountdown() <= 0) {
      clearInterval(timer);
      playReveal();
    }
  }, 1000);
})();
