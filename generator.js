// Secure password generator.
// Pure ES module; works in modern browsers and Node.js (>=19) without polyfills.
// All randomness comes from a CSPRNG via globalThis.crypto.getRandomValues.

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?';
const MIN_LENGTH = 6;

export const CHAR_SETS = Object.freeze({
  lower: LOWER,
  upper: UPPER,
  digits: DIGITS,
  symbols: SYMBOLS,
});

function getCrypto() {
  const c = globalThis.crypto;
  if (!c || typeof c.getRandomValues !== 'function') {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  return c;
}

// Uniform random integer in [0, max) using rejection sampling.
// This avoids modulo bias when max does not divide 2^32 evenly.
export function randomInt(max) {
  if (!Number.isInteger(max) || max <= 0 || max > 0x100000000) {
    throw new RangeError('max must be a positive integer <= 2^32.');
  }
  const c = getCrypto();
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  // Loop bounded by probability; rejection probability < 0.5 per draw for any valid max.
  while (true) {
    c.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

// Fisher–Yates shuffle using unbiased random ints.
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function pickFrom(charset) {
  return charset[randomInt(charset.length)];
}

export function generatePassword(opts = {}) {
  const {
    length = MIN_LENGTH,
    lower = true,
    upper = true,
    digits = true,
    symbols = true,
  } = opts;

  if (!Number.isInteger(length) || length < MIN_LENGTH) {
    throw new RangeError(`length must be an integer >= ${MIN_LENGTH}.`);
  }

  const required = [];
  if (lower) required.push(LOWER);
  if (upper) required.push(UPPER);
  if (digits) required.push(DIGITS);
  if (symbols) required.push(SYMBOLS);

  if (required.length === 0) {
    throw new Error('At least one character class must be enabled.');
  }
  if (required.length > length) {
    throw new RangeError('length must be >= number of enabled character classes.');
  }

  const pool = required.join('');

  // Guarantee at least one character from each enabled class.
  const chars = required.map(pickFrom);
  while (chars.length < length) {
    chars.push(pickFrom(pool));
  }

  return shuffleInPlace(chars).join('');
}

// Shannon entropy estimate of the *pool*, not of a specific password.
// Useful for UI display: H = length * log2(|pool|).
export function passwordEntropyBits(length, opts = {}) {
  const {
    lower = true,
    upper = true,
    digits = true,
    symbols = true,
  } = opts;
  let poolSize = 0;
  if (lower) poolSize += LOWER.length;
  if (upper) poolSize += UPPER.length;
  if (digits) poolSize += DIGITS.length;
  if (symbols) poolSize += SYMBOLS.length;
  if (poolSize === 0) return 0;
  return length * Math.log2(poolSize);
}

export const MIN_PASSWORD_LENGTH = MIN_LENGTH;
