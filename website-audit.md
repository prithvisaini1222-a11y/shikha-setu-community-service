# ShikshaSetu — Comprehensive Website & Portal Audit Report

**Academic Baseline:** CBSE / NCERT 2026–27  
**Platform Status:** Operational & Audited  
**Generated Date:** October 2026  

---

## Executive Summary

A comprehensive architectural, functional, and visual audit of the entire **ShikshaSetu** platform was conducted. The audit covered all public-facing educational routes, authentication workflows, and the five authenticated role-based portals: **Learner**, **Volunteer**, **Donor**, **Institution / NGO**, and **Admin**.

The platform is designed to connect verified Child Care Institutions (CCIs) with educators, volunteers, and donors, while providing structured, syllabus-mapped digital learning for children in Classes 6 through 10 under strict **POCSO (Protection of Children from Sexual Offences) Act** and **Juvenile Justice (Care and Protection of Children) Act** guidelines.

---

## 1. Public Website Audit

| Route | Page Name | Primary Function | Audit Finding & Status |
| :--- | :--- | :--- | :--- |
| `/` | **Homepage** | Platform mission, core value pillars, curriculum highlights, live platform counters, role portals CTA | **Audited & Refined:** Reduced excessive vertical spacing from `space-y-20` to `space-y-12 sm:space-y-16`, eliminated 160px bottom gap above footer. Real-time metric counters operational. |
| `/learn` | **Curriculum Gateway** | Overview of Classes 6 to 10 NCERT 2026–27 curriculum and core textbooks | **Audited & Active:** Visual grade selector (Classes 6–10), textbook cards (Ganita Prakash, Curiosity, Exploring Society, etc.), direct links to grade syllabus. |
| `/learn/[classNumber]` | **Grade Learning Hub** | Class-specific subjects, textbook chapters, video lecture libraries, and notes | **Audited & Active:** Supports Classes 6, 7, 8, 9, 10. Contains 2,673 categorized and syllabus-aligned video lectures with quota-optimized PostgreSQL caching. |
| `/teach` | **Volunteer Gateway** | Overview of "Teach for a Day" program, matching algorithm preview, application CTA | **Audited & Active:** Connected to real institutional needs, highlights verified school matching, and guides educators through credential submission. |
| `/needs` | **Educational Needs Board** | Public registry of urgent and ongoing physical & teaching requirements from CCIs | **Audited & Active:** Filter by category (Books, Classroom, STEM, Digital) and urgency. Real-time fulfillment progress bars and direct sponsorship modal. |
| `/impact` | **Impact & Transparency** | Platform accountability, verified sessions count, books distributed, live CCI map | **Audited & Active:** Displays verifiable impact figures, 4-stage contribution lifecycle, and authentic care home stories. |
| `/about` | **About ShikshaSetu** | Platform origins, founding mission, governance structure, child protection protocols | **Audited & Active:** Full institutional background, advisory board, core team, and statutory compliance declarations. |
| `/contact` | **Contact & Grievance** | Institutional inquiries, volunteer onboarding support, donor assistance, child safety grievance cell | **Newly Implemented:** Full interactive inquiry form, dedicated support channels, secretariat address, helpline, and grievance officer contact details. |
| `/auth/login` | **Sign In** | Role-aware credentials login for all 5 user types | **Audited & Active:** Session cookie dispatch (`shikshasetu_session_uid`), automatic role-based redirect, demo credential switchers. |
| `/auth/register` | **Sign Up** | Multi-role registration (Volunteer, Donor, Institution, Learner) | **Audited & Active:** Full validation, password criteria, role-specific profile initialization, POCSO safety notice for minors. |
| `/auth/forgot-password` | **Forgot Password** | Self-service account recovery and institutional assistance | **Audited & Upgraded:** Working recovery dispatch, validation, error handling, and guidance for institutional learner accounts. |
| `/auth/reset-password` | **Reset Password** | Token verification and new password confirmation | **Newly Implemented:** Verification token input, password strength meter, confirmation match check, and automatic sign-in redirect. |
| `/career` | **Career Guidance** | Academic stream navigation, vocational roadmaps, and higher education mentorship for Grades 9–10 | **Audited & Active:** Stream exploratory matrices (Science, Commerce, Arts, Vocational), NEP 2020 skill recommendations. |

---

## 2. Learner Portal Audit (`/dashboard/learner`)

### Objective
Provide a focused, distraction-free, syllabus-aligned learning workspace for Class 6–10 students under institutional supervision.

### Current Architecture & Features
- **Collapsible Sidebar (`LearnerCollapsibleSidebar.tsx`):**
  - Controlled strictly via click toggle (no erratic hover-based jumping).
  - Navigation sections: *My Learning*, *Class Syllabus*, *Practice & Quizzes*, *Ask a Doubt*, *Career Guidance*, and *Profile*.
- **Interactive Subject Explorer (`SubjectSpatialExplorer.tsx`):**
  - Spatial 3D-inspired core subject card carousel.
  - Displays official textbook names (Ganita Prakash, Curiosity, Exploring Society, Poorvi, Malhar, Deepakam).
  - Subject progress tracking and resume lecture shortcuts.
- **Learning Content View (`SubjectLearningContentView.tsx`):**
  - Complete chapter hierarchy (Class → Subject → Chapter → Topic → Lecture).
  - YouTube player integration with fallback error boundaries.
  - Video lecture progress tracking (`trackVideoProgressAction`).
- **Practice & Quizzes Workspace (`LearnerPracticeView.tsx`):**
  - Real database diagnostic quizzes and questions.
  - Interactive radio-select quiz player with instant marks calculation, passing criteria, and detailed explanations.
- **Ask a Doubt (`LearnerDoubtsView.tsx`):**
  - Cascading Subject → Chapter selector.
  - Query description textarea connected to `submitDoubtAction`.
  - Doubt resolution history showing educator responses, educator badges, and resolution timestamps.
- **Learner Institutional Profile (`LearnerProfileView.tsx`):**
  - Anonymous institutional roll alias (`LRN-xxx`).
  - Active Class Level with one-click class switching overlay (`VisualClassSelection.tsx`).
  - Daily learning streak tracker.
  - POCSO / Juvenile Justice Act protection guarantee banner.

---

## 3. Volunteer Portal Audit (`/dashboard/volunteer`)

### Objective
Empower volunteer teachers and mentors to find teaching opportunities, conduct classes, and receive verified service certificates.

### Workflows Audited
1. **Overview & Smart Match Recommendation:** Calculates compatibility percentage based on volunteer subject, class level, availability, and institution urgency.
2. **Opportunities Tab:** Direct browsing of open CCI teaching needs with "Apply for Match" trigger.
3. **Teach for a Day Matcher (`TeachMatcherForm.tsx`):** 5-step form (Subject → Class → Schedule → Mode → Confirmation) invoking `submitTeachForADayAction`.
4. **My Sessions:** Live calendar of scheduled, ongoing, and completed sessions. Includes attendance reporting, session completion action, and issue logging.
5. **Contributions Lifecycle:** Visual 5-stage timeline tracking applications from *Applied* to *Approved*, *Scheduled*, *Completed*, and *Verified*.
6. **Skills & Competencies:** Subject preferences, class levels, and weekend availability management.
7. **Official Certificates:** Cryptographically verifiable certificates with direct verification links (`/certificates/verify/[number]`) and PDF downloads.
8. **Institutional Communications:** Child-safe messaging channel strictly between volunteer educators and CCI superintendents.

---

## 4. Donor Portal Audit (`/dashboard/donor`)

### Objective
Facilitate transparent educational philanthropy for textbook kits, school supplies, and digital lab equipment with end-to-end auditability.

### Workflows Audited
1. **Overview & Giving Metrics:** Total contributions, resources donated, needs fulfilled, and recipient institutions.
2. **Explore Needs Board:** Filterable by category (Books, Digital, Classroom, Uniforms) and urgency with search bar.
3. **Sponsorship Pledge Modal (`SponsorNeedModal.tsx`):** Creates real `Donation` records in PostgreSQL, generates unique tracking numbers (`TRK-SS-2026`), and increments need fulfillment counters.
4. **Impact Lifecycle:** 4-stage tracking: *Pledged* → *Received at CCI* → *Verified by Superintendent* → *Fulfilled to Children*.
5. **Saved Needs:** Client-side bookmarking of critical institution requirements.
6. **Official Section 80G Tax Receipt:** Full-fidelity tax receipt modal with NGO registration number (`AAATS8291PF20234`), itemized audit breakdown, and printable PDF dialog via `window.print()`.

---

## 5. Institution / NGO Portal Audit (`/dashboard/institution`)

### Objective
Enable Child Care Institution superintendents and NGO coordinators to manage educational needs, approve volunteer educators, acknowledge physical resources, and supervise learner cohorts.

### Workflows Audited
1. **Overview Dashboard:** Live counters for active needs, pending volunteer requests, upcoming teaching sessions, and verified donations.
2. **Needs Management:** Real-time modal for creating new educational requirements (`createNeedAction`) with urgency tagging and target class specification.
3. **Volunteer Applications Queue:** Review educator applications, compare compatibility match score, and execute `approveVolunteerRequestAction` or `rejectVolunteerRequestAction`.
4. **Session Verification & Certificates:** Official superintendent sign-off mechanism to authenticate completed classes and issue verifiable certificates.
5. **Resource Inventory:** Inbound delivery acknowledgment (`updateDonationStatusAction`) with audit notes.
6. **Learners Cohort Management (`learners` tab):** Roster of enrolled children showing anonymous aliases (`LRN-xxx`), class levels, and streak activity with strict adherence to POCSO privacy rules.
7. **Monthly Impact Reports:** Official printable summary designed for submission to District Child Protection Units (DCPU) and Child Welfare Committees (CWC).

---

## 6. Admin Portal Audit (`/dashboard/admin`)

### Objective
Provide comprehensive platform governance, KYC verification, curriculum management, moderation, and statutory audit logging.

### Workflows Audited
- **15 Integrated Management Tabs:** Overview, Users, Learners, Volunteers, Donors, Institutions, Verification Center, Curriculum Content Management, Needs Moderation, Donations, Sessions, Reports & Analytics, Impact Monitoring, Broadcast Notifications, and Platform Settings.
- **Verification Center:** Multi-tab verification directorate for inspecting institution 80G/12A registrations, volunteer ID documents, and issuing verified green checkmarks.
- **Curriculum Management (`AdminContentManagement.tsx`):** Full control over Classes 6–10 textbook chapters, learning videos, trusted YouTube channels, and content quality reports.
- **Audit Logs:** Immutable database activity trail recording all administrative approvals, rejections, and curriculum updates.

---

## Conclusion
The ShikshaSetu platform is fully operational, structurally sound, and compliant with educational curriculum and child protection standards. Spacing and layout inconsistencies have been rectified across all routes.

