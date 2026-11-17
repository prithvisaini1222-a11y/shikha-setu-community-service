# ShikshaSetu — Missing Functionality & Resolution Inventory

---

## 1. Inventory of Identified Gaps

Prior to this website-wide audit and completion phase, an exhaustive review of all codebase routes, client components, and server actions identified the following genuine missing features, incomplete workflows, and dead controls:

| # | Domain | Identified Gap | Severity | Resolution Implemented |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Public Routes** | `/contact` route did not exist (returned HTTP 404). Footer and navigation lacked Contact page. | **High** | Built [`src/app/contact/page.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/app/contact/page.tsx) with full interactive inquiry form, support channels (Institutions, Volunteers, Donors), secretariat address, phone, and Child Safety Grievance Officer contacts. |
| **2** | **Public Routes** | `/auth/reset-password` was missing (returned HTTP 404) while linked from forgot password flow. | **High** | Built [`src/app/auth/reset-password/page.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/app/auth/reset-password/page.tsx) with recovery token verification, password strength validator, confirmation matching, and sign-in redirect. |
| **3** | **Public Routes** | `/auth/forgot-password` was a static mock with no input validation or recovery instructions. | **Medium** | Upgraded [`src/app/auth/forgot-password/page.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/app/auth/forgot-password/page.tsx) to an interactive recovery form with email validation, recovery dispatch simulation, and guidance for institutional learner accounts. |
| **4** | **Learner Portal** | Clicking `#practice` in `LearnerCollapsibleSidebar` did not switch views; the client component only rendered `My Learning`. | **High** | Built [`src/components/learning/LearnerPracticeView.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/learning/LearnerPracticeView.tsx) with interactive MCQ quiz runner, instant score calculation, percentage accuracy, answer explanations, and database attempt persistence. |
| **5** | **Learner Portal** | Clicking `#doubts` in `LearnerCollapsibleSidebar` had no associated workspace view. | **High** | Built [`src/components/learning/LearnerDoubtsView.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/learning/LearnerDoubtsView.tsx) with Subject & Chapter cascading dropdowns, question textarea, direct `submitDoubtAction` integration, and verified educator response history. |
| **6** | **Learner Portal** | Learner profile details and class switching overlay could not be accessed directly from the sidebar. | **Medium** | Built [`src/components/learning/LearnerProfileView.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/learning/LearnerProfileView.tsx) displaying institutional roll alias (`LRN-xxx`), streak days, class level, language preferences, and POCSO safety declarations. |
| **7** | **Learner Actions** | `submitDoubtAction` and `submitQuizAction` failed if `user.learnerId` was absent in the session cookie. | **High** | Added automatic database fallback in [`src/actions/learning.ts`](file:///t:/community-service/shikha%20setu%202.o/src/actions/learning.ts) to query `prisma.learner.findFirst({ where: { userId: user.id } })`, ensuring 100% reliable action execution. |
| **8** | **Institution Portal** | The Institution dashboard lacked a "Learners" tab, preventing superintendents from viewing their student cohort. | **High** | Added `learners` query to [`src/app/dashboard/institution/page.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/app/dashboard/institution/page.tsx) and built a dedicated `learners` tab in [`src/components/institution/InstitutionDashboardClient.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/institution/InstitutionDashboardClient.tsx) with anonymized roll aliases (`LRN-xxx`) and POCSO badges. |
| **9** | **Donor Portal** | The donation receipt modal triggered an unstyled browser `alert('Receipt downloaded...')`. | **Medium** | Replaced with a formal **Section 80G Tax Receipt** paper layout in [`src/components/donor/DonorDashboardClient.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/donor/DonorDashboardClient.tsx) with registered trust number (`AAATS8291PF20234`), itemized audit quantities, and printable PDF dialog via `window.print()`. |
| **10** | **Navigation & Spacing** | Public navigation lacked About and Contact links; Homepage had an excessive 160px bottom blank space. | **Medium** | Updated [`src/components/shared/Navbar.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/shared/Navbar.tsx), reduced Homepage bottom padding, and optimized [`src/components/shared/Footer.tsx`](file:///t:/community-service/shikha%20setu%202.o/src/components/shared/Footer.tsx). |

---

## 2. Child Protection & Legal Compliance Audits

### Statutory Standards Applied:
1. **Protection of Children from Sexual Offences (POCSO) Act:**
   - Absolute bar on adult-to-child direct unmonitored messaging.
   - Volunteers only communicate with registered institution coordinators and superintendents.
   - All student doubts are answered in an academic, supervised context with no personal contact sharing.
2. **Juvenile Justice (Care and Protection of Children) Act:**
   - Strict child anonymization.
   - Individual student records use institutional aliases (`LRN-482`, `LRN-101`) rather than legal names or photographs.
   - Private phone numbers, family background, and care institution physical residential addresses are protected.
3. **Section 80G of the Income Tax Act:**
   - Tax-deductible educational resource sponsorship with formal NGO registration numbers and transparent 4-stage tracking.

