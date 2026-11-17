# ShikshaSetu — Role-Based Portal Feature Audit Report

---

## 1. Learner Portal (`/dashboard/learner`)

### Core Workflows Audited & Implemented

| Capability | Component | Database Model(s) | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Grade Switching** | `VisualClassSelection.tsx` | `Learner.classLevel` | **Verified** | One-click visual grade switcher (Classes 6–10) persisting to PostgreSQL via `updateLearnerClassAction`. |
| **Interactive Subject World** | `SubjectSpatialExplorer.tsx` | `Subject`, `Chapter`, `Class` | **Verified** | 3D-inspired core subject cards displaying official NCERT 2026–27 textbook titles (Ganita Prakash, Curiosity, Exploring Society, etc.). |
| **Structured Lesson Player** | `SubjectLearningContentView.tsx` | `LearningVideo`, `LearnerVideoProgress` | **Verified** | Video lectures categorized by Class → Subject → Chapter → Topic → Lecture with automatic watch-progress tracking. |
| **Practice & Quizzes Workspace** | `LearnerPracticeView.tsx` | `Quiz`, `Question`, `QuizAttempt` | **Implemented** | Interactive MCQ quiz engine with instant score calculation, percentage accuracy, answer explanations, and retake support. |
| **Ask a Doubt Workspace** | `LearnerDoubtsView.tsx` | `Doubt`, `Subject`, `Chapter` | **Implemented** | Doubt submission form (Subject, Chapter, Question) connected to `submitDoubtAction` with status tracking (`OPEN`, `ANSWERED`). |
| **Learner Profile & Privacy** | `LearnerProfileView.tsx` | `Learner`, `Institution` | **Implemented** | Displays institutional roll alias (`LRN-xxx`), learning streak counter, language preferences, and statutory POCSO protection badge. |
| **Child Protection Standard** | Architecture-wide | — | **Compliant** | Zero personal child contact details (phone, email, photo) stored or leaked. All doubt answers mediated by verified teachers. |

---

## 2. Volunteer Portal (`/dashboard/volunteer`)

### Core Workflows Audited & Implemented

| Capability | Component | Database Model(s) | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Smart Compatibility Match** | `VolunteerDashboardClient.tsx` | `Volunteer`, `InstitutionNeed` | **Verified** | Algorithm matching volunteer skills, subject, and weekend availability against institution requirements (92% compatibility preview). |
| **Teach for a Day Matcher** | `TeachMatcherForm.tsx` | `VolunteerRequest` | **Verified** | 5-step guided matcher (Subject, Class, Schedule, Mode, Confirmation) generating real requests via `submitTeachForADayAction`. |
| **Session Conduct & Sign-off** | `VolunteerDashboardClient.tsx` | `Session` | **Verified** | Detailed session modal with attendance logging (e.g. 18 students) and `updateSessionStatusAction` to mark COMPLETED. |
| **5-Stage Contribution Lifecycle** | `VolunteerDashboardClient.tsx` | `VolunteerRequest`, `Session` | **Verified** | Visual timeline: 1. Applied → 2. Approved → 3. Scheduled → 4. Completed → 5. Verified. |
| **Teaching Competencies** | `VolunteerDashboardClient.tsx` | `Volunteer.skills` | **Verified** | Manages primary subjects, classes, preferred modes (online/offline), and teaching availability. |
| **Authenticated Certificates** | `VolunteerDashboardClient.tsx` | `Certificate` | **Verified** | Official certificate cards with cryptographic numbers, verification URLs (`/certificates/verify/[number]`), and downloadable PDFs. |
| **Institutional Communications** | `VolunteerDashboardClient.tsx` | `User`, `Institution` | **Verified** | Safe messaging channel restricted to adult coordinators and superintendents, preventing direct minor contact. |

---

## 3. Donor Portal (`/dashboard/donor`)

### Core Workflows Audited & Implemented

| Capability | Component | Database Model(s) | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Live Philanthropy Dashboard** | `DonorDashboardClient.tsx` | `Donation`, `InstitutionNeed` | **Verified** | Displays aggregated resources donated, care homes supported, and verified delivery metrics. |
| **Needs Board Filtering** | `DonorDashboardClient.tsx` | `InstitutionNeed` | **Verified** | Real-time filtering by category (Books, Digital, Classroom, STEM) and urgency (Urgent, Needed, Long-term) with search. |
| **Sponsorship Pledge Modal** | `SponsorNeedModal.tsx` | `Donation`, `InstitutionNeed` | **Verified** | Creates real `Donation` records in PostgreSQL via `createDonationAction` and generates audit tracking code (`TRK-SS-2026`). |
| **4-Stage Transparency Journey** | `DonorDashboardClient.tsx` | `Donation.status` | **Verified** | Visual milestone tracker: Pledged → Received at CCI → Verified by Superintendent → In Children's Hands. |
| **Saved Needs Wishlist** | `DonorDashboardClient.tsx` | Local State | **Verified** | Bookmark favorite requirements to monitor and support over time. |
| **Official 80G Tax Receipt** | `DonorDashboardClient.tsx` | `Donation`, `Institution` | **Implemented** | Formal receipt paper modal with 80G tax exemption number (`AAATS8291PF20234`), itemized quantities, and printable PDF dialog. |

---

## 4. Institution / NGO Portal (`/dashboard/institution`)

### Core Workflows Audited & Implemented

| Capability | Component | Database Model(s) | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Care Home Command Center** | `InstitutionDashboardClient.tsx` | `Institution` | **Verified** | Comprehensive overview of enrolled children, open needs, pending educator requests, and received resources. |
| **Requirement Publishing** | `InstitutionDashboardClient.tsx` | `InstitutionNeed` | **Verified** | Modal for creating new physical or teaching needs (`createNeedAction`) with target grade level and urgency. |
| **Volunteer Applications Queue** | `InstitutionDashboardClient.tsx` | `VolunteerRequest` | **Verified** | Evaluate volunteer applicant profiles and trigger `approveVolunteerRequestAction` or `rejectVolunteerRequestAction`. |
| **Session Sign-off & Certificate** | `InstitutionDashboardClient.tsx` | `Session`, `Certificate` | **Verified** | Superintendent sign-off portal triggering `verifySessionAndIssueCertificateAction` to issue verified volunteer certificates. |
| **Resource Intake Acknowledgment** | `InstitutionDashboardClient.tsx` | `Donation` | **Verified** | Delivery acknowledgment mechanism calling `updateDonationStatusAction` to verify incoming physical resources. |
| **Learner Cohort Roster** | `InstitutionDashboardClient.tsx` | `Learner` | **Implemented** | Anonymized student table showing institutional aliases (`LRN-xxx`), class levels, learning streaks, and POCSO compliance tag. |
| **Monthly Impact Report** | `InstitutionDashboardClient.tsx` | `Session`, `Donation` | **Verified** | Formatted printable institutional report for District Child Protection Units (DCPU) and Child Welfare Committees. |

---

## 5. Admin Portal (`/dashboard/admin`)

### Core Workflows Audited & Implemented

| Capability | Component | Database Model(s) | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **15 Management Modules** | `AdminDashboardClient.tsx` | All 30 Prisma Models | **Verified** | Complete platform administration across users, learners, volunteers, donors, institutions, needs, and sessions. |
| **Verification Directorate** | `AdminDashboardClient.tsx` | `Institution`, `Volunteer`, `User` | **Verified** | Multi-tab KYC review to inspect registration certificates, approve verified badges, or issue change requests. |
| **Curriculum Content Management** | `AdminContentManagement.tsx` | `Class`, `Subject`, `Chapter`, `LearningVideo` | **Verified** | Controls 2,673 mapped videos, trusted YouTube channels (Magnet Brains, NCERT Official), and quality report queue. |
| **Moderation & Audit Trail** | `AdminDashboardClient.tsx` | `AuditLog` | **Verified** | Immutable audit log capturing all administrative actions, timestamps, actor IDs, and IP addresses. |

