# HAA ambassador browser tests

Journey-based Playwright checks against the hosted beta app. Source-code access is not required.

## Start on your Mac

Extract this folder, open Terminal inside it, then:

```sh
npm install
npx playwright install chromium
npm run login
npm run ui
```

Sign in yourself in the login browser, reach the ambassador dashboard, then press Enter in Terminal. This browser needs its own login; ChatGPT's connected session is separate. Session data stays in `playwright/.auth/` and is excluded from the ZIP and git. Keep it private. Rerun login when the session expires.

## Demo controls

```sh
npm run demo -- --speed=1000
npm run demo -- --grep "Journey 03"
npm test
npm run report
```

UI mode offers journey/test selection, execution and results. `demo` uses a visible browser and configurable milliseconds between actions. `test` is headless. A custom combined browser dashboard with speed/headed controls is not included.

## Coverage

Read **AMBASSADOR_USER_JOURNEYS.md** for the complete journey list, prerequisites, blocked checks and validation evidence. Journey 02 is the original eight-check dashboard batch. Journey 03 covers profile; 04 link; 05 QR; 06 message; 08 language; 09 session; 10 mobile. Journeys 01 and 07 are blocked placeholders, not implemented full flows.

There are 37 entries: 27 implemented checks and 10 skipped placeholders. Live results remain pending your local run. Tests may expose app defects; none are presented as passed merely because code exists.

Default account name: Isaac; username: kiyoonewton. Use `HAA_NAME=Jane HAA_USERNAME=janetest npm run demo` for another account. The current locators target the English beta interface; Journey 08 specifically checks Spanish.

## Test effects

The profile save test temporarily changes city and organization and restores original values in a separate afterEach cleanup hook. Use a test account and avoid concurrent profile editing. If forcibly terminated, restore the profile manually. Role edits are canceled, not saved. Link visits can increase click counts. Clipboard checks replace clipboard contents. Language is restored to English. No patient submissions or outgoing messages occur.

Failure screenshots, videos and traces are retained locally; review them for account information before sharing reports. Do not share saved authentication files.

## Validation

All 37 entries are discovered successfully. A standalone launch here was blocked by a missing Chromium executable; authenticated execution also requires a local saved session. Connected-browser observations are separately recorded in the journey Markdown file. Run on the Mac before presenting pass/fail results.
