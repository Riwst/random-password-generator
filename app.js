import { generatePassword, passwordEntropyBits } from './generator.js';
import { STRINGS, SUPPORTED_LANGS, detectInitialLang } from './i18n.js';

const CANDIDATE_COUNT = 4;
const LANG_STORAGE_KEY = 'pwgen.lang';

const form = document.getElementById('options');
const candidatesEl = document.getElementById('candidates');
const entropyEl = document.getElementById('entropy');
const statusEl = document.getElementById('status');
const langSelect = document.getElementById('lang');

// Translation state. `currentLang` always points at a key in STRINGS.
let currentLang = readStoredLang();

function readStoredLang() {
  let stored = null;
  try {
    stored = localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    // Storage may be disabled (private mode); fall back to detection.
  }
  return detectInitialLang(navigator.language, stored);
}

function persistLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore; preference simply won't persist across reloads.
  }
}

function t(key) {
  return STRINGS[currentLang][key];
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18n;
    const value = STRINGS[currentLang][key];
    if (typeof value === 'string') el.textContent = value;
  }
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    // Format: "attrName:key" (e.g. "aria-label:candidatesAria")
    const [attr, key] = el.dataset.i18nAttr.split(':');
    const value = STRINGS[currentLang][key];
    if (attr && typeof value === 'string') el.setAttribute(attr, value);
  }

  // Copy buttons are built dynamically — update their text and aria-label.
  document.querySelectorAll('.candidates .copy').forEach((btn, i) => {
    btn.textContent = t('copy');
    btn.setAttribute('aria-label', STRINGS[currentLang].copyAria(i + 1));
  });
}

function readOpts() {
  const fd = new FormData(form);
  return {
    length: Number(fd.get('length')),
    lower: fd.has('lower'),
    upper: fd.has('upper'),
    digits: fd.has('digits'),
    symbols: fd.has('symbols'),
  };
}

function updateEntropy() {
  try {
    const opts = readOpts();
    entropyEl.textContent = passwordEntropyBits(opts.length, opts).toFixed(1);
  } catch {
    entropyEl.textContent = '—';
  }
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle('error', isError);
}

async function copyText(text) {
  if (!text || text === '—') return;
  try {
    await navigator.clipboard.writeText(text);
    setStatus(t('copied'));
  } catch {
    setStatus(t('clipboardError'), true);
  }
}

const outputs = [];
for (let i = 0; i < CANDIDATE_COUNT; i++) {
  const li = document.createElement('li');

  const output = document.createElement('output');
  output.className = 'password';
  output.textContent = '—';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'copy';
  copyBtn.addEventListener('click', () => copyText(output.textContent));

  li.append(output, copyBtn);
  candidatesEl.append(li);
  outputs.push(output);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const opts = readOpts();
    for (const out of outputs) {
      out.textContent = generatePassword(opts);
    }
    setStatus('');
  } catch (err) {
    setStatus(err.message, true);
  }
});

form.addEventListener('input', updateEntropy);

// Language switcher.
langSelect.value = SUPPORTED_LANGS.includes(currentLang) ? currentLang : SUPPORTED_LANGS[0];
langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  persistLang(currentLang);
  applyTranslations();
});

applyTranslations();
updateEntropy();

// ---- Live "outgoing requests" counter for the safety section ----
// PerformanceObserver is registered after `load`, so only resources fetched
// AFTER the initial bundle (i.e. anything triggered by user interaction)
// would increment the counter. The app is designed never to fetch anything
// after load, so the counter is expected to stay at 0 forever.
const netCounterEl = document.getElementById('net-counter');
let netCount = 0;

function renderNetCount() {
  if (netCounterEl) netCounterEl.textContent = String(netCount);
}

window.addEventListener('load', () => {
  if (typeof PerformanceObserver !== 'function') return;
  try {
    const observer = new PerformanceObserver((list) => {
      netCount += list.getEntries().length;
      renderNetCount();
    });
    observer.observe({ entryTypes: ['resource'] });
  } catch {
    // PerformanceObserver not supported here; counter just stays at 0.
  }
});
