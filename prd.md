# Product Requirements Document (PRD)  
**Project:** Usra Health, Commitment, & Engagement Dashboard  
**Organization Context:** MAS Chapter  
**Primary Goal:** Provide a single, visual system to understand **usra health, commitment, and engagement** across the chapter—spanning attendance, applications, leadership development, and tarbiyah progression.

---

## 1. Purpose & Vision

This product is a **chapter-wide operating system for usra life**.

It integrates:
- Attendance health (diagnostic, visual)
- Commitment and accountability (applications, contracts)
- Engagement pathways (leaderboards)
- Personal growth (development plans)
- Resources and mentor-side tracking

The system should:
- Make participation patterns obvious
- Motivate involvement without coercion
- Support tarbiyah without bureaucracy
- Feel **serious, intentional, and mission-driven**
- Use **light gamification** (Mario Kart–inspired icons, progress cues)

This is not a surveillance tool.  
It is a **tarbiyah and movement-health tool**.

---

## 2. Core Principles

- **No authentication**
  - Access is controlled via shared codes and forms
- **Google Sheets as backend**
  - Source of truth for all data
- **Visual-first**
  - Squares, progress bars, icons over text
- **Low friction**
  - Submissions should take under 1 minute
- **Gamified, not childish**
  - Mario Kart–style progress, not startup gamification

---

## 3. Users & Roles

### 3.1 Chapter Admin
- Maintains Google Sheets
- Reviews applications
- Assigns usras
- Oversees leaderboards and completion

### 3.2 Usra Leader
- Submits weekly attendance via code
- Views their usra’s health and resources

### 3.3 Member
- Applies to usra
- Views leaderboards
- Completes PDP and engagement milestones

### 3.4 Mentor
- Marks Personal Development Plans complete
- Tracks tarbiyah progress

---

## 4. System Modules (Pages)

The product consists of **five core pages**, all tied together visually and conceptually.

---

## 5. Page 1: Usra Application

### 5.1 Purpose
Provide a structured intake mechanism to assess **readiness, commitment, and alignment** before assigning a member to an usra.

### 5.2 Application Fields

**Basic Info**
- Name
- Email
- Phone number
- Birthday
- Age

**Alignment & Commitment**
- Do you agree with the MAS mission and vision? (Yes/No)
- What makes you interested in joining usra?

**Current Engagement**
- Are you currently attending any MAS programs or halaqas at another masjid?
  - What do you attend?
  - How long have you been attending?

**Service & Dawah**
- Are you involved in any consistent volunteering, community service, or MAS full team?
  - What are you involved in?
  - How long?

**Readiness**
- Do you have any mentors or references who can vouch for your readiness for usra?

**Contract Acknowledgement**
- Confirmation that applicant has read the Usra Contract
- Acknowledgement of $10 refundable deposit as commitment device

**Preferences**
- Is there a specific person or usra you want to be with?

### 5.3 Output
- Stored in Google Sheets
- Status: `Pending / Accepted / Assigned`
- Linked to People + Usra tables once accepted

---

## 6. Page 2: Usra Attendance Health Dashboard

*(This section builds on the previously defined attendance grid and remains unchanged in core behavior.)*

### 6.1 Key Elements
- Chapter-level attendance health
- Grid of squares:
  - Rows: Individuals
  - Columns: Weeks
  - Grouped by usra
- Usra summary rows

This page answers:  
**“Is our tarbiyah structure actually alive?”**

---

## 7. Page 3: Leaderboard (Engagement Pathway)

### 7.1 Purpose
Provide a **systematic pathway** to motivate general committee members and active students to engage in **all dimensions of campus dawah**.

### 7.2 Chapter-Level Leaderboard Criteria

Members earn progress for completing the following:

- Be in a Spring Semester Usra (≥70% attendance)
- Submit a Personal Development Plan
- Attend a Dawah Table
- Attend one Service Event or Tarbiyah Retreat
- Attend one Iftar at the Ramadan Tent
- Deliver a khaterah, khutbah, or halaqah on campus

### 7.3 Qualification Logic
- Complete **4 out of 5** required activities
- Qualifies member for:
  - **$250 Agent of Change Scholarship**
  - Awarded at MSA Banquet
- Application to participate required by start of semester

### 7.4 Visual Design
- Mario Kart–style icons (flags, trophies, checkpoints)
- Progress bars per member
- Subtle rank ordering (no aggressive competition)

### 7.5 Usra-Level Leaderboards
- Aggregate view of how each usra is doing
- Encourages collective responsibility

---

## 8. Page 4: Personal Development Plan (PDP)

### 8.1 Purpose
Formalize **intentional personal growth** as part of usra life.

### 8.2 Functionality
- Member completes PDP (external form or document)
- PDP generates a **clean, beautiful PDF**
- Mentor reviews PDP
- Mentor marks PDP as complete

### 8.3 System Behavior
- Admin/Mentor selects member name from list
- Marks PDP as complete
- Completion status feeds into:
  - Leaderboard
  - Member progress tracking

### 8.4 Requirements
- PDP has a target completion date
- Status: `Not Started / Submitted / Approved`

---

## 9. Page 5: Usra Resources

### 9.1 Purpose
Provide leaders with **clear, standardized guidance** on how to run a healthy usra.

### 9.2 Content
- Philosophy of usra
- Weekly structure guidance
- Attendance expectations
- Spiritual tone-setting
- Conflict handling
- Engagement best practices

This is mostly **static text**, but cleanly presented.

---

## 10. Page 6: Tarbiyah Tracking (Mentor View)

### 10.1 Purpose
Allow mentors to track **non-attendance-based growth**.

### 10.2 Features
- Mentor-side checklist:
  - PDP completion
  - Engagement milestones
  - Notes (optional, private)
- High-level view, not micromanagement
- Complements attendance data

---

## 11. Data Model (Google Sheets)

### Core Sheets
- `People`
- `Usra`
- `Applications`
- `Attendance`
- `Leaderboard_Progress`
- `PDP_Status`
- `Mentor_Tracking`

Each module writes to and reads from these sheets.

---

## 12. Visual & Aesthetic Requirements

- Base style: minimal, institutional
- Overlay: **Mario Kart–style gamification**
  - Icons, progress markers, checkpoints
- No:
  - Auth screens
  - Corporate dashboards
  - Excessive color
- Whitespace-first design

---

## 13. Non-Goals

- Security hardening
- Mobile apps
- Notifications
- Public-facing rankings
- Over-optimization

---

## 14. Success Criteria

The system is successful if:
- Admins can assess chapter health in under 10 seconds
- Leaders submit attendance consistently
- Members understand how to “advance” without explanation
- Tarbiyah feels intentional, not accidental
- The UI feels like a **movement tool**, not software

---

## 15. Future Enhancements (Optional)

- Ramadan-specific overlays
- Semester reset animations
- Longitudinal tarbiyah trends
- Exportable reports for shura review
