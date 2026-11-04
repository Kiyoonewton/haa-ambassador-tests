# HAA manual verification and test audit

Audit: 4 November 2026. Automated failures are evidence to investigate, not automatic proof of an app defect. A test can fail because of the runner, expired login, changed selectors, browser permissions, loading, or application behavior.

## Findings actually reproduced in the signed-in beta

| Check | Finding | Classification |
|---|---|---|
| J04-02 | Share HAA → HAA link → Close left the dialog open. Escape dismissed it. | App behavior reproduced; confirm manually |
| J06-03 | Share HAA → Personal Message → Close left the dialog open. Escape dismissed it. | App behavior reproduced; confirm manually |
| J03-03 | Entered Orlando, FL 32801 and HAA QA Manual Check, saved, reopened, and both values persisted. Restored original values and verified. | Manual live pass; earlier automated failure is not reproduced as an app save defect |
| J03-06 | Copy link produced the expected https referral URL. | Manual browser check passed |
| J02 dashboard / People | Dashboard and profile/sharing/People navigation available; People showed a clear empty state. | Observed functioning; not a complete standalone suite run |

The open HTML report contained one old J03-03 run. It was not a current all-tests report. Unlisted checks have not been certified passed or failed during this audit.

## Test implementation issues corrected

- The original 30-second total timeout was too small for deliberately slowed multi-action demos. Total budget now scales with slowMo; individual action/navigation timeouts remain bounded.
- Photo recovery tried to write into an output directory that might not exist. It now creates the directory first.
- Photo persistence wrongly rejected all blob/data URLs. Some apps legitimately rebuild images as object URLs. The check now compares the image after reopening and in a fresh authenticated context.
- Original embedded/blob photos can now be backed up locally before upload.
- File-picker failure now reports a specific message instead of leaving a rejected event promise unhandled.
- Earlier profile loading and input synchronization fixes remain in place. Loading readiness uses observed request completion and a bounded quiet/stability window; without app test hooks this is a heuristic, not proof of backend correctness.

Close-button assertions remain strict. There is no Escape fallback inside the Close tests and no automatic retry that hides a defect.

## Manual check list

Start signed in on the ambassador dashboard, in English. For each automated failure below, record actual behavior, expected behavior, browser and date. Use a dedicated beta test account.

| IDs | Manual actions | Expected result |
|---|---|---|
| J02-01 / J02-02 | Open dashboard. Check your name and story feature. | Correct name; story clearly marked Coming soon. |
| J02-03 / J02-04 | Edit profile; inspect username/link; click Cancel. | Correct identity; return to dashboard. |
| J02-05 / J02-06 | Share HAA; open HAA link. | QR, link, message choices; own referral link. |
| J02-07 / J02-08 | People; Go to dashboard. | Referral list/search or empty state; correct dashboard return. |
| J03-01 | Open Profile; inspect city, organization, phone and email. | Saved values; phone/email read-only as current product expects. |
| J03-02 | Choose Community Leader; enter Orlando, FL 32801 and HAA QA Unsaved; Cancel. | Controls accept edits; Save enables; Cancel exits. |
| J03-03 | Record original city/org. Enter Orlando, FL 32801 and HAA QA Manual Check; Save; reopen. Then restore originals, Save and reopen again. | Both test values persist, then original values persist. If city is already Orlando, use Miami, FL 33101. |
| J03-04 | Record originals; edit both fields; Cancel; reopen. | Original saved values remain. |
| J03-05 | Record original photo. Click photo, select a distinct PNG/JPEG, Save if offered. Reopen and refresh Profile. Restore original photo. | File picker opens; replacement photo persists across reopening/refresh; restoration works. |
| J03-06 / J04-01 | Copy link from Profile and HAA link dialog; paste in a text editor. | Both copied URLs belong to the same ambassador. |
| J04-02 | Share HAA → HAA link → click Close (X). | Dialog disappears. If it stays open, record a defect; use Escape only afterward to recover. |
| J04-03 | Reopen HAA link; press Escape. | Dialog disappears. |
| J04-04 | Open referral link in an incognito window. Note via=username; click GET HELP NOW. | Public landing page retains referral context and opens patient intake. A visit is not proof of submitted-patient attribution. |
| J05-01 / J05-02 | Share HAA → QR code; scan with another phone. | QR renders and resolves to the ambassador's referral link/patient flow. If only the automated decoder fails, provide the QR screenshot for review. |
| J06-01 | Personal Message; read name and referral URL. | Correct ambassador name/link; case differences in username alone do not fail. |
| J06-02 | Edit personal message, without sending. | New text remains in the textbox. |
| J06-03 | Personal Message → click Close (X). | Dialog disappears. Record a defect if it stays open. |
| J06-04 | Open Personal Message; Escape; Go to dashboard. | Return without sending. |
| J08-01 | Menu → Language → Español. Check translated dashboard controls; switch back to English. | Spanish labels and correct identity; English restored. |
| J09-01 | Refresh signed-in dashboard. | Account stays signed in. |
| J09-02 | Open dashboard URL in incognito. | Personal dashboard is inaccessible. Current automated check expects a redirect; an intentional login overlay at the same URL requires team clarification. |
| J10-01 | Use a 390 × 844 mobile viewport; check controls, sideways scrolling and People → dashboard. | Controls usable; no unintended page overflow; navigation works. |

## Blocked / manual-only coverage

New-account signup and OTP, click-count timing rules, saved QR download behavior, physical phone scans, teammate message receipt, submitted patient attribution, logout/login and controlled expiry still need their documented prerequisites. Skipped checks have not passed.

## Run and share results

Close any old UI runner, pull current main, then run:

```sh
git pull
npm install
npm run demo -- --speed=700
npm run report
```

Every completed run writes **test-results/FAILURE_REVIEW.md** with the Git revision, all executed statuses and failed-check errors. Send that file plus the relevant failed screenshot/error-context or trace. Reports and authentication stay local and are ignored by git. An old report does not update until tests are rerun.

## Limits

No all-tests standalone authenticated run was performed by this audit. Live browser observations above are separate from local helper verification and test discovery. Photo pixels may change after server compression/cropping; if a visual comparison fails while the same photo clearly persists manually, review the screenshots before treating it as an app defect.
