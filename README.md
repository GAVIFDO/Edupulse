# EduPulse — Teacher Performance & Development Tracking System

## Project Overview

**EduPulse** is an interactive web platform built for educators and school leadership to track classroom performance, attendance and punctuality, professional development certifications, 360-degree student and peer feedback, lesson plan alignment, and career milestones. Designed around Sarah's mission to modernize faculty growth and celebrate teaching excellence, the platform combines real-time visual analytics with a gamified recognition engine.

### Key Modules Included
- **Teacher Profiles & Competency Portfolios**: Searchable and filterable faculty directory featuring 6-axis competency radar charts (Pedagogy, Student Engagement, Curriculum Design, EdTech Integration, Assessment Quality, and Peer Collaboration) and chronological career milestone timelines.
- **Attendance & Punctuality Ledger**: Real-time daily check-in tracking, punctuality rates, period coverage logs, and interactive check-in entry.
- **Training & Certifications Tracker**: Professional development credit tracking, course progress bars, credential IDs, and one-click certification completion that automatically awards educator XP.
- **360° Feedback System**: Multi-source classroom evaluations from Student Cohorts, Peer Walkthroughs, and Leadership Appraisals scored across Instructional Clarity, Engagement, and Classroom Support.
- **Lesson Plans & Syllabus Repository**: Structured curriculum blueprints tagged with Bloom's Taxonomy levels, learning objectives, required resources, and administrative approval workflows.
- **Visual Analytics Suite**: Longitudinal performance and engagement trajectories, departmental benchmark comparisons, PD-hour correlations, and rating distributions.
- **Gamification & Recognition Hub**: Tiered educator levels, XP leaderboards, one-click "+100 XP Peer Kudos", and an unlocked achievement badge catalog.
- **Admin Governance Console**: Direct sign-off queue for pending lesson plans, automated annual appraisal readiness checks, one-click CSV report export, role switching (`Principal / Admin`, `Educator Self-Portal`, `Peer Evaluator`), and demo data reset.

## Technologies Used

- **HTML5**: Semantic application layout, modal dialogs, and accessible form controls.
- **CSS3**: Custom design token variables (`css/variables.css`), responsive grid and flexbox architecture (`css/layout.css`, `css/responsive.css`), dark/light mode theming, and modular UI components (`css/components.css`).
- **Vanilla JavaScript (ES6+)**: Modular architecture separated into state seed data (`js/data.js`), persistent `localStorage` state management (`js/storage.js`), interactive chart controllers (`js/charts.js`), dynamic view templates (`js/views.js`), and event-delegated application logic (`js/app.js`).
- **Chart.js (v4.4.1)**: Responsive line, bar, radar, and doughnut visualizations.
- **Plus Jakarta Sans**: Google Fonts typography for high-contrast academic legibility.

## Project File Structure

```text
teacher-performance-tracker/
├── index.html
├── README.md
├── css/
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── data.js
    ├── storage.js
    ├── charts.js
    ├── views.js
    └── app.js
```

## Usage Instructions

1. **Run Locally**:
   - Clone or download this repository to your machine.
   - Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari) or serve the folder using VS Code Live Server (`npx serve .`).
2. **Navigate Modules**:
   - Use the left navigation sidebar (or the top-left menu button on mobile/tablet screens) to switch between the 8 core modules.
   - Toggle between **Light Mode** and **Dark Mode** anytime using the moon icon in the top navigation bar.
3. **Interactive Workflows**:
   - **Add Records**: Click `+ Add Educator Profile`, `+ Log Check-In`, `+ Enroll / Log Certification`, `+ New Classroom Evaluation`, or `+ Submit Lesson Plan` to add live entries. All changes persist automatically in your browser via `localStorage`.
   - **Approve & Certify**: Mark in-progress trainings as 100% certified or approve pending lesson plans from the **Lesson Plans** or **Admin Dashboard** tabs to dynamically update educator XP and readiness metrics.
   - **Export & Reset**: Visit the **Admin Dashboard** to export the faculty performance table as a `.csv` file or reset the demo dataset back to its default state.
4. **Deploy to GitHub Pages / Netlify / Vercel**:
   - Push the contents of this folder to a public GitHub repository.
   - In GitHub, go to **Settings → Pages**, select the `main` branch and `/ (root)` folder, and click **Save**. Your live deployment URL will be ready in under a minute.
