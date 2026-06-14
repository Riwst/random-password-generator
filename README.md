# Random Password Generator

A client-side random password generator built with vanilla JavaScript and the
Web Crypto API. It is designed as a small, auditable example for people who
want to build their own privacy-conscious password generator without a server,
tracking, runtime dependencies, or a build step.

The UI offers length presets of 6, 8, 12, 16, and 24; 12+ is recommended. Zero
dependencies, zero network calls, fully auditable as a single screen of
HTML/CSS/JS.

[Live app](https://ai.riat.jp/N052-4/) · [Security policy](SECURITY.md) · [Contributing](CONTRIBUTING.md)

## Design goals

1. **Cryptographic randomness.** Every byte comes from
   `crypto.getRandomValues()` (Web Crypto / Node `globalThis.crypto`).
2. **No modulo bias.** `randomInt(n)` uses rejection sampling.
3. **No data leaves the browser.** No analytics, no fonts from a CDN, no
   third-party scripts. A strict Content-Security-Policy header enforces this.
4. **Auditable.** ~150 lines of plain JS, no build step, no minification.
5. **Minimum 6 characters.** Shorter passwords are rejected at the API level.
   The UI exposes a fixed set of presets (6/8/12/16/24) and recommends 12+.
6. **At least one of each enabled class.** Lowercase / uppercase / digits /
   symbols can each be toggled; whichever are on are guaranteed to appear.

## For builders

This repository may be useful if you are looking for a simple reference
implementation of:

- a browser-only password generator,
- `crypto.getRandomValues()` / Web Crypto API usage,
- unbiased random integer generation with rejection sampling,
- no-dependency vanilla JavaScript,
- a strict Content Security Policy with `connect-src 'none'`,
- small tests for randomness invariants and i18n consistency.

## Usage

Open `index.html` in any modern browser, or serve the directory statically:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

There is no install step.

## Programmatic API

```js
import { generatePassword, passwordEntropyBits } from './generator.js';

generatePassword({ length: 20, symbols: false });
// => e.g. "A8kQ2vTb3RfHpL9wXyZc"

passwordEntropyBits(20, { symbols: false });
// => 119.08 (= 20 * log2(62))
```

## Tests

```sh
node --test tests/*.test.js
```

The suite covers:

| Property                       | Test                                            |
| ------------------------------ | ----------------------------------------------- |
| length floor                   | rejects `length < 6`                            |
| class inclusion guarantee      | every enabled class appears in 200 samples      |
| pool containment               | output uses only enabled characters             |
| collision resistance (smoke)   | 5 000 length-16 passwords are pairwise distinct |
| modulo bias                    | chi-square on `randomInt(257)` over 100 k draws |
| character distribution         | chi-square on 13 k single-class draws           |
| entropy formula                | matches `length * log2(pool)`                   |

## Threat model

This tool is appropriate for generating passwords on a device the user
trusts. It does **not** defend against:

- A compromised browser, OS, or hardware RNG.
- Malicious extensions that read the DOM.
- Shoulder-surfing or screen capture.

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure process.

## License

[MIT](LICENSE).
