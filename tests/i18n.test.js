// Tests for i18n.js — language detection and string completeness.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, SUPPORTED_LANGS, DEFAULT_LANG, detectInitialLang } from '../i18n.js';

test('every supported language has the same keys', () => {
  const baseline = Object.keys(STRINGS[DEFAULT_LANG]).sort();
  for (const lang of SUPPORTED_LANGS) {
    const keys = Object.keys(STRINGS[lang]).sort();
    assert.deepEqual(keys, baseline, `lang "${lang}" key set differs from "${DEFAULT_LANG}"`);
  }
});

test('every value is a string or string-returning function', () => {
  // Empty strings are permitted: some keys (e.g. unit suffixes) are
  // intentionally empty in some languages. The key-parity test above
  // already guarantees no key was accidentally omitted.
  for (const lang of SUPPORTED_LANGS) {
    for (const [key, value] of Object.entries(STRINGS[lang])) {
      if (typeof value === 'string') continue;
      if (typeof value === 'function') {
        assert.equal(typeof value(1), 'string', `${lang}.${key}(1) must return a string`);
        continue;
      }
      assert.fail(`${lang}.${key} must be string or function, got ${typeof value}`);
    }
  }
});

test('at least 90% of strings are non-empty per language', () => {
  // Guards against a translator pasting placeholder empty strings wholesale.
  for (const lang of SUPPORTED_LANGS) {
    const values = Object.values(STRINGS[lang]).filter((v) => typeof v === 'string');
    const nonEmpty = values.filter((v) => v.length > 0).length;
    assert.ok(nonEmpty / values.length >= 0.9, `${lang} has too many empty strings`);
  }
});

test('stored preference wins when supported', () => {
  assert.equal(detectInitialLang('en-US', 'ja'), 'ja');
  assert.equal(detectInitialLang('ja-JP', 'en'), 'en');
});

test('stored preference is ignored when unsupported', () => {
  assert.equal(detectInitialLang('ja-JP', 'fr'), 'ja');
  assert.equal(detectInitialLang('en-US', 'zz'), 'en');
});

test('falls back to navigator language when no stored preference', () => {
  assert.equal(detectInitialLang('ja-JP', null), 'ja');
  assert.equal(detectInitialLang('en-US', undefined), 'en');
  assert.equal(detectInitialLang('en', ''), 'en');
});

test('falls back to default when nothing matches', () => {
  assert.equal(detectInitialLang('fr-FR', null), DEFAULT_LANG);
  assert.equal(detectInitialLang('', null), DEFAULT_LANG);
  assert.equal(detectInitialLang(undefined, null), DEFAULT_LANG);
});
