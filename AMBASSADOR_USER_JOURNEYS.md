# HAA ambassador automation — user journeys

Updated: 4 November 2026

**37 entries: 27 implemented checks and 10 explicitly skipped placeholders.** Implemented means written, not passed. Standalone live execution still requires the Mac browser installation and a saved login session. No full journey has been certified complete.

## How to run

```sh
npm install
npx playwright install chromium
npm run login
npm run ui
```

Use UI mode to select a journey or individual check. For a visible slow run of everything: `npm run demo -- --speed=1000`. For Journey 03 only: `npm run demo -- --grep "Journey 03"`. Results: `npm run report`.

## Run prerequisites and effects

- Use the dedicated beta ambassador account. One worker runs checks sequentially.
- J03-03 temporarily saves city and organization, then restores and verifies original values in a separate afterEach cleanup hook. Forced termination can prevent restoration. Saved role persistence is not covered.
- Copy-link checks replace the local clipboard.
- Referral URL visits may increase click counts. They do not prove patient attribution.
- Language test switches to Spanish, then restores English. Mobile test uses a separate browser context.
- No messages, patient cases, profile photos, or new accounts are submitted by this suite.
- Skipped placeholders remain visible with reasons; they are not implemented coverage.

## Journey 01 — Join as an ambassador

`tests/journey-01-signup.spec.js`

| Check | Implementation status |
|---|---|
| J01-BLOCKED Full new-account onboarding | Skipped — Not implemented: requires a fresh test phone, OTP access and account-creation agreement handling. Full checklist is in AMBASSADOR_USER_JOURNEYS.md. |

## Journey 02 — Ambassador dashboard

`tests/journey-02-dashboard.spec.js`

| Check | Implementation status |
|---|---|
| J02-01 Dashboard shows the ambassador name | Written; live result pending |
| J02-02 Story feature is marked Coming soon | Written; live result pending |
| J02-03 Edit profile opens the correct profile and link | Written; live result pending |
| J02-04 Profile returns to dashboard without editing | Written; live result pending |
| J02-05 Share HAA offers QR, link and personal message | Written; live result pending |
| J02-06 Sharing displays the correct personal link | Written; live result pending |
| J02-07 People opens the referral list | Written; live result pending |
| J02-08 People returns to the dashboard | Written; live result pending |

## Journey 03 — Update the ambassador profile

`tests/journey-03-profile.spec.js`

| Check | Implementation status |
|---|---|
| J03-01 Profile identity and fields | Written; live result pending |
| J03-02 Role and text fields accept unsaved edits | Written; live result pending |
| J03-03 Save city and organization, reopen, then restore | Written; live result pending |
| J03-04 Cancel discards unsaved edits | Written; live result pending |
| J03-05 Photo upload and persistence | Skipped — Blocked: no upload control observed; team confirmation needed. |
| J03-06 Copy link matches referral URL | Written; live result pending |

## Journey 04 — Share a personal referral link

`tests/journey-04-link.spec.js`

| Check | Implementation status |
|---|---|
| J04-01 Copy link contains the personal URL | Written; live result pending |
| J04-02 Close button dismisses dialog | Written; live result pending |
| J04-03 Escape dismisses dialog | Written; live result pending |
| J04-04 Personal link reaches patient flow in separate session | Written; live result pending |
| J04-05 Click count updates | Skipped — Blocked: team must define counting, deduplication and update window first. |

## Journey 05 — Share a QR code

`tests/journey-05-qr.spec.js`

| Check | Implementation status |
|---|---|
| J05-01 QR image renders | Written; live result pending |
| J05-02 QR image encodes the correct personal URL | Written; live result pending |
| J05-03 Download saved QR image | Skipped — Blocked: no Download control observed; only Share. Confirm expected product behavior. |
| J05-04 Physical phone scan | Skipped — Manual confirmation required with teammate phone. |
| J05-05 QR patient attribution | Skipped — Blocked: requires a submitted test patient and tracking confirmation. |

## Journey 06 — Share a personal introduction

`tests/journey-06-message.spec.js`

| Check | Implementation status |
|---|---|
| J06-01 Message contains own name and personal link | Written; live result pending |
| J06-02 Message can be edited before sharing | Written; live result pending |
| J06-03 Close dismisses without sending | Written; live result pending |
| J06-04 Return to dashboard without sending | Written; live result pending |
| J06-05 Teammate receives shared message and working link | Skipped — Manual confirmation required; no recipient designated. No messages are sent by this suite. |

## Journey 07 — Refer patients and track cases

`tests/journey-07-referral.spec.js`

| Check | Implementation status |
|---|---|
| J07-BLOCKED Link and QR patient attribution with status updates | Skipped — Not implemented: requires dedicated made-up patient accounts, OTP access, and admin confirmation/status updates. See full Markdown checklist. |

## Journey 08 — Switch dashboard language

`tests/journey-08-language.spec.js`

| Check | Implementation status |
|---|---|
| J08-01 Switch English to Spanish and back | Written; live result pending |

## Journey 09 — Session access

`tests/journey-09-session.spec.js`

| Check | Implementation status |
|---|---|
| J09-01 Signed-in dashboard survives refresh | Written; live result pending |
| J09-02 Fresh unauthenticated session cannot see own dashboard | Written; live result pending |
| J09-03 Logout and OTP login again | Skipped — Blocked: needs OTP-capable login fixture; logout may invalidate the shared session. |
| J09-04 Expired-session recovery | Skipped — Blocked: needs team-provided short-lived session or supported expiry fixture. |

## Journey 10 — Mobile dashboard navigation

`tests/journey-10-mobile.spec.js`

| Check | Implementation status |
|---|---|
| J10-01 Main controls work on mobile and page has no horizontal overflow | Written; live result pending |

## Remaining full-flow requirements

Journey 01 still needs language selection during onboarding, welcome/intro, names and optional surname, back navigation preservation, phone/email validation, Terms/Privacy opening, correct/incorrect/resend/change-number OTP checks, location entry/skip/geolocation, username availability, personal link, success and getting-started screens. Requires fresh test accounts and OTP access.

Journey 07 still needs a made-up patient submitted through the personal link, exactly one matched People record, correct name and accident type, search/no-results, contact/date verification, admin-confirmed status, status update propagation, and a second patient submitted through QR credited to the same ambassador. Requires dedicated test patients and admin support.

Additional planned checks: saved role persistence, QR saved-image sharing behavior, physical phone scan, actual teammate message receipt, logout/login and controlled expiry, full Spanish screen coverage, mobile profile/sharing screens, browser Back/Forward behavior, accessibility/keyboard navigation, and supported offline/retry handling.

## Execution evidence from this session

- Connected-browser inspection confirmed dashboard/profile/sharing/People navigation and displayed personal link.
- Unsaved organization edit was canceled; reopening showed the original value.
- Personal referral URL opened `/en?via=kiyoonewton&...`; the dashboard subsequently showed 1 click after previously showing 0. This is an observed change, not full attribution proof.
- Spanish dashboard showed translated controls and preserved the ambassador name; English was restored.
- A standalone unauthenticated test launch was attempted here but stopped because the Chromium executable is not installed. This is an environment blocker, not an app failure.
- Test discovery succeeds for all 37 entries; it does not establish pass/fail results.
