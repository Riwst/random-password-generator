# Contributing

Thanks for considering a contribution. The project deliberately stays small;
please read this before opening a PR.

## Scope

Changes that fit:

- Bug fixes to `generator.js` or the UI.
- Additional statistical tests in `tests/`.
- Documentation improvements.
- Accessibility and i18n improvements to `index.html` / `app.js`.

Changes that need discussion first (please open an issue):

- New character classes or non-Latin alphabets.
- New runtime dependencies (the bar is *very* high — see SECURITY.md).
- Server-side components, sync, history, or any feature that introduces
  network I/O.

## Development

```sh
# Tests — no install step
node --test tests/*.test.js

# Manual UI smoke test
python3 -m http.server 8000  # then open http://localhost:8000
```

## Pull request checklist

- [ ] `node --test tests/*.test.js` passes.
- [ ] No new runtime dependencies.
- [ ] No code that contacts the network at runtime.
- [ ] If you touched `generator.js`, you added or updated a test.
- [ ] Commits are signed off with the DCO (`git commit -s`) if your fork
      requires it.

## Reviews

Security-sensitive PRs (anything touching `generator.js`, the CSP, or CI)
require two approvals. Maintainers will request a second reviewer if needed.
