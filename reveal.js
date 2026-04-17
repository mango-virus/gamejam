(() => {
  // Evaluated in the viewer's local timezone, so everyone on a shared timezone
  // sees the gate open at the same wallclock moment. No explicit TZ offset.
  const REVEAL_AT_DEFAULT = new Date(2026, 3, 17, 12, 0, 0).getTime(); // Fri Apr 17, 2026 @ 12:00 PM local
  const END_AT_DEFAULT   = new Date(2026, 4, 23, 23, 59, 0).getTime(); // Sat May 23, 2026 @ 11:59 PM local

  // Jam-end countdown in the featured real-jam card — independent of gate state.
  (function setupEndCountdown() {
    const container = document.getElementById('jam-end-countdown');
    if (!container) return;
    const cd = {
      days:    container.querySelector('[data-cd="days"]'),
      hours:   container.querySelector('[data-cd="hours"]'),
      minutes: container.querySelector('[data-cd="minutes"]'),
      seconds: container.querySelector('[data-cd="seconds"]'),
    };
    const labelEl = container.querySelector('.jam-cd-label');
    const targetEl = container.querySelector('.jam-cd-target');
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      const diff = END_AT_DEFAULT - Date.now();
      if (diff <= 0) {
        container.dataset.state = 'ended';
        if (labelEl) labelEl.textContent = 'Submissions closed';
        if (targetEl) targetEl.textContent = 'The jam is over — thanks for playing.';
        cd.days.textContent = '00';
        cd.hours.textContent = '00';
        cd.minutes.textContent = '00';
        cd.seconds.textContent = '00';
        return false;
      }
      cd.days.textContent    = pad(Math.floor(diff / 86400000));
      cd.hours.textContent   = pad(Math.floor((diff / 3600000) % 24));
      cd.minutes.textContent = pad(Math.floor((diff / 60000) % 60));
      cd.seconds.textContent = pad(Math.floor((diff / 1000) % 60));
      return true;
    }
    tick();
    const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000);
  })();

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
