// Statistical and property tests for generator.js.
// Run with: node --test tests/generator.test.js
//
// Requires Node >= 19 for globalThis.crypto.getRandomValues.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePassword,
  passwordEntropyBits,
  randomInt,
  CHAR_SETS,
  MIN_PASSWORD_LENGTH,
} from '../generator.js';

const ALL = CHAR_SETS.lower + CHAR_SETS.upper + CHAR_SETS.digits + CHAR_SETS.symbols;

test('rejects length below the minimum', () => {
  assert.throws(() => generatePassword({ length: MIN_PASSWORD_LENGTH - 1 }));
});

test('accepts length at the minimum', () => {
  const pw = generatePassword({ length: MIN_PASSWORD_LENGTH });
  assert.equal(pw.length, MIN_PASSWORD_LENGTH);
});

test('rejects non-integer length', () => {
  assert.throws(() => generatePassword({ length: 16.5 }));
  assert.throws(() => generatePassword({ length: '16' }));
});

test('rejects when all character classes are disabled', () => {
  assert.throws(() =>
    generatePassword({ length: 16, lower: false, upper: false, digits: false, symbols: false }),
  );
});

test('rejects when length is smaller than number of required classes', () => {
  // 4 classes enabled but length 3 (also below min, but error semantics must surface).
  assert.throws(() => generatePassword({ length: 3 }));
});

test('output is drawn only from the enabled pool', () => {
  const pool = CHAR_SETS.lower + CHAR_SETS.digits;
  const pw = generatePassword({
    length: 64,
    lower: true,
    upper: false,
    digits: true,
    symbols: false,
  });
  for (const ch of pw) assert.ok(pool.includes(ch), `unexpected char ${ch}`);
});

test('guarantees at least one char from every enabled class', () => {
  // Repeat many times: each class must appear in every password.
  for (let i = 0; i < 200; i++) {
    const pw = generatePassword({ length: 12 });
    assert.ok([...pw].some((c) => CHAR_SETS.lower.includes(c)), 'missing lower');
    assert.ok([...pw].some((c) => CHAR_SETS.upper.includes(c)), 'missing upper');
    assert.ok([...pw].some((c) => CHAR_SETS.digits.includes(c)), 'missing digits');
    assert.ok([...pw].some((c) => CHAR_SETS.symbols.includes(c)), 'missing symbols');
  }
});

test('passwords are not trivially repeated (no collisions in 5000 samples)', () => {
  const seen = new Set();
  for (let i = 0; i < 5000; i++) {
    const pw = generatePassword({ length: 16 });
    assert.ok(!seen.has(pw), `collision at iteration ${i}`);
    seen.add(pw);
  }
});

test('entropy estimate matches the pool size', () => {
  // 4 classes: 26+26+10+26 = 88 chars in symbols (count actual symbols)
  const poolSize = ALL.length;
  const expected = 16 * Math.log2(poolSize);
  const got = passwordEntropyBits(16, { lower: true, upper: true, digits: true, symbols: true });
  assert.ok(Math.abs(got - expected) < 1e-9);
});

test('entropy estimate is zero when no classes are enabled', () => {
  const got = passwordEntropyBits(16, { lower: false, upper: false, digits: false, symbols: false });
  assert.equal(got, 0);
});

test('randomInt rejects invalid bounds', () => {
  assert.throws(() => randomInt(0));
  assert.throws(() => randomInt(-1));
  assert.throws(() => randomInt(1.5));
  assert.throws(() => randomInt(2 ** 32 + 1));
});

test('randomInt has no modulo bias (chi-square on N=257)', () => {
  // 257 is prime and does not divide 2^32; naive `r % 257` would be biased.
  // Rejection sampling should produce a uniform distribution.
  const N = 257;
  const samples = 257 * 400; // ~100k samples, 400 expected per bucket
  const counts = new Uint32Array(N);
  for (let i = 0; i < samples; i++) counts[randomInt(N)]++;
  const expected = samples / N;
  let chi = 0;
  for (let i = 0; i < N; i++) {
    const d = counts[i] - expected;
    chi += (d * d) / expected;
  }
  // df=256, 99.9th percentile ~ 357. We pick a generous upper bound to avoid flake.
  // p<1e-6 cutoff is around ~400.
  assert.ok(chi < 400, `chi-square ${chi.toFixed(2)} suggests non-uniform distribution`);
});

test('character distribution across many passwords is roughly uniform', () => {
  // Use a single-class config so every draw comes straight from pickFrom(pool)
  // without the "at least one of each class" guarantee skewing position 0..3.
  const N = 26;
  const sampleCount = 26 * 500;
  const bucket = new Uint32Array(N);
  let n = 0;
  while (n < sampleCount) {
    const pw = generatePassword({
      length: 64,
      lower: true,
      upper: false,
      digits: false,
      symbols: false,
    });
    for (const ch of pw) {
      const idx = CHAR_SETS.lower.indexOf(ch);
      if (idx >= 0) {
        bucket[idx]++;
        n++;
        if (n >= sampleCount) break;
      }
    }
  }
  const expected = sampleCount / N;
  let chi = 0;
  for (let i = 0; i < N; i++) {
    const d = bucket[i] - expected;
    chi += (d * d) / expected;
  }
  // df=25, 99.99th percentile ~ 60. Use 80 as a very loose upper bound.
  assert.ok(chi < 80, `chi-square ${chi.toFixed(2)} suggests non-uniform char draws`);
});

test('long passwords still satisfy all invariants', () => {
  const pw = generatePassword({ length: 128 });
  assert.equal(pw.length, 128);
  for (const ch of pw) assert.ok(ALL.includes(ch));
});

test('per-class generation works with each single class', () => {
  for (const key of ['lower', 'upper', 'digits', 'symbols']) {
    const opts = { length: 16, lower: false, upper: false, digits: false, symbols: false };
    opts[key] = true;
    const pw = generatePassword(opts);
    const pool = CHAR_SETS[key];
    for (const ch of pw) assert.ok(pool.includes(ch), `unexpected ${ch} for class ${key}`);
  }
});
