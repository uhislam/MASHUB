# Product Requirements Document (PRD)
**Project:** Usrah Attendance Health Dashboard
**Organization Context:** MAS chapter
**Primary Goal:** Give a quiet, visual, zero-training way to see usrah attendance health over time.

---

## 1. Purpose and Vision
- Diagnose tarbiyah health via attendance patterns (consistency, decay, neglect).
- Keep the experience dignified: minimal UI, no growth-hacker vibes, no corporate feel.
- Stay extremely simple to deploy and operate (Google Sheets only, no auth, no backend servers).

## 2. Goals and Non-Goals
- Goals: fast comprehension (10 seconds to spot weak usrahs and non-reporting groups), sub-60 second weekly submission, no training needed for viewers or leaders.
- Non-goals: accounts/auth, notifications, gamification, scoring individuals, mobile apps, heavy charts, exports (CSV optional future), AI features.

## 3. Users and Roles
- Chapter Admin: defines usrahs, member roster, submission codes; maintains the Google Sheet; views full dashboard.
- Usrah Leader: submits weekly attendance for their usrah via code; can resubmit to overwrite the week.
- Viewer: anyone with dashboard link; read-only, no interactions required.

## 4. Assumptions
- All data lives in one Google Sheet owned by the chapter admin.
- Reporting cadence is weekly; week runs Monday-Sunday (configurable via sheet if needed).
- Submission codes are unguessable strings shared out-of-band.
- Traffic is low (tens of usrahs, hundreds of members, ~24 weeks visible).

## 5. Success Criteria
- Viewer can identify weak usrahs, attendance decay, and non-reporting usrahs within 10 seconds of page load.
- Usrah leaders can submit weekly attendance without guidance; average submission time under 60 seconds.
- Admins never need to explain the dashboard UI.
- The UI feels serious and institutional (Harvard.edu level restraint).

## 6. Core Principles
- No authentication: simplicity over security; submission gated only by code.
- Minimal UI: whitespace, restrained typography, no shadows/gradients; text-first.
- Visual-first: the grid of squares is the product; avoid decorative widgets.
- Low-friction reporting: few clicks, bulk actions, instant feedback.
- Google Sheets as source of truth: no extra storage; read for dashboard, write for submissions.

## 7. Experience and IA
- Pages:
  - `/` Dashboard (default view).
  - `/submit` Attendance submission by code.
  - (Optional) `/health` simple JSON health endpoint for uptime checks.
- Layout and styling:
  - White background; near-black text; one accent color max (used for present state and links).
  - Typography: small, sober; hierarchy via spacing and weight, not color.
  - No animations; hover hints allowed; no cards with shadows.
  - Responsive: on mobile, grid scrolls horizontally with sticky member names; aggregate metrics stack vertically.

## 8. Functional Requirements
### 8.1 Dashboard Aggregate Metrics (top section, plain text)
- Overall attendance rate: present / (present + absent) over visible weeks.
- Active members: count of members marked active in People sheet.
- Number of usrahs: count of usrah records.
- Reporting completeness: submitted weeks / expected weeks for all usrahs (visible window).
- Members with 0 attendance in last 4 weeks.
- Members with 3-week attendance streak or longer.

### 8.2 Attendance Grid (primary component)
- Rows: individuals, grouped by usrah; member name left-aligned.
- Columns: weeks; default window last 12-16 weeks (configurable, e.g., 16).
- Cell states: Present = filled dark square; Absent = empty outline; Excused (optional) = light fill or dot; Not reported = very light outline.
- Interactions: hover tooltip shows member, week label (YYYY-WW), and status. No clicks needed to consume the view.
- Empty states: if no data, show "No attendance submitted yet" and still render column headers for weeks.
- Accessibility: each cell has text alternative (aria-label with name, week, status).

### 8.3 Usrah Summary Row (beneath each usrah group)
- Shows average attendance percent for visible weeks, reporting completeness for that usrah, and a simple trend indicator.
- Trend rules: compute attendance percent over last 4 vs prior 4 visible weeks; improving if +5pp, flat if within +-5pp, declining if -5pp or worse. Display as text symbols: "+" improving, "=" flat, "-" declining.

### 8.4 Attendance Submission Interface (`/submit`)
- Access: single page; entry via usrah code field.
- On valid code: show usrah name, member list (active only), current week preselected.
- Inputs: per-member toggle (present/absent) plus optional "excused" toggle; default blank (no assumption of presence).
- Bulk actions: "Mark all present", "Clear all".
- Validation: code must match; submit disabled until at least one status set or bulk action used; handle invalid code with simple inline error.
- Submission rules: one submission per usrah per week; new submission overwrites prior for that week; record timestamp and code.
- Confirmation: show lightweight success toast/text; offer "Edit this week" button to adjust and resubmit.
- Error states: show failure message if sheet write fails; retry option.

### 8.5 Admin Configuration (via Google Sheets)
- Admin maintains sheets and codes; app must read latest data on each page load (no caching longer than 5 minutes if caching is used).
- Expected weeks derive from Weeks sheet; if a week is missing, treat as not reported and surface in completeness.
- Roster changes: new member appears next load; deactivated members (active = FALSE) are hidden from submission and grayed/hidden on dashboard.

## 9. Data Model (Google Sheets)
- Sheet `People`: person_id (string), name (string), usrah_id (string), active (TRUE/FALSE).
- Sheet `Usrah`: usrah_id (string), usrah_name (string), submission_code (string, unique).
- Sheet `Weeks`: week_id (YYYY-WW), start_date (date), end_date (date). Rows define expected reporting periods.
- Sheet `Attendance`: person_id (ref), week_id (ref), status (present/absent/excused), reported_by (usrah_id), reported_at (timestamp).
- (Optional) Sheet `Settings`: key/value pairs for accent color, default weeks window, week start day.

## 10. Data Flows
- Dashboard load: read People, Usrah, Weeks, Attendance; compute metrics in browser; default window last N weeks based on Weeks ordering.
- Submission: given code, map to usrah_id; build member list; on submit, upsert rows in Attendance for that usrah and week; overwrite any existing rows for that usrah-week before writing new statuses.
- Reporting completeness: for each usrah and week in window, check if any Attendance rows exist for that usrah-week; use to compute percentages.

## 11. Edge Cases
- Duplicate codes: reject at validation; admin must keep unique.
- Missing week definition: show warning banner and treat as not reported.
- Member moved usrah: future weeks use new usrah_id; historical data stays with old usrah_id.
- Sheet unreachable: show friendly outage message; do not cache stale writes.
- Very small screens: enable horizontal scroll for grid; keep row labels sticky.

## 12. Non-Functional Requirements
- Performance: dashboard paints in under 2 seconds for 500 members x 24 weeks on broadband; submission write completes under 2 seconds.
- Reliability: graceful handling of Google Sheets rate limits; simple retry with backoff on writes.
- Accessibility: keyboard navigable submission form; contrast-compliant colors; tooltips not required for comprehension.
- Privacy/Security: open dashboard by design; submission gated by codes; avoid personal data beyond names.

## 13. Instrumentation and Logging
- Page view counts (optional) for dashboard and submit page.
- Submission success/failure counts; log usrah_id (not member names) for health monitoring.

## 14. Rollout and QA Checklist
- Verify sample sheet loads and metrics compute correctly.
- Validate submission overwrite behavior and timestamp.
- Test invalid code, missing week, and offline sheet states.
- Spot-check accessibility: focus order, labels, contrast, hover not required.

## 15. Future Enhancements
- Toggle week range (8 / 12 / 20).
- CSV export of visible window.
- Comment field per week per usrah.
- Visual separators for Ramadan or breaks.
- Optional lightweight auth (link-based) if chapters request.

## 16. Open Questions
- Should excused count as present for streaks and attendance rate, or be neutral? (default: neutral, excluded from numerator and denominator.)
- Should week start day be globally configurable or per chapter? (default: global setting.)
- Do we need printable view for board reports?
