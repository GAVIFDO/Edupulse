(function () {
  let appState = window.EduStore.loadState();
  let currentTab = "overview";
  let filterDept = "ALL";
  let searchQuery = "";

  const TAB_META = {
    overview: {
      title: "Executive Performance Overview",
      subtitle: "Real-time insights into teaching excellence, classroom engagement, and professional growth"
    },
    teachers: {
      title: "Educator Profiles & Competency Portfolios",
      subtitle: "Explore faculty credentials, 6-axis competency radars, and career milestones"
    },
    attendance: {
      title: "Attendance & Punctuality Tracking",
      subtitle: "Monitor daily check-in logs, bell punctuality, and instructional coverage"
    },
    training: {
      title: "Training, Workshops & Certifications",
      subtitle: "Track accredited professional development hours and micro-credentials"
    },
    feedback: {
      title: "Student & Peer Feedback System",
      subtitle: "360-degree classroom observations, cohort ratings, and qualitative reflections"
    },
    lessons: {
      title: "Lesson Plans & Syllabus Alignment",
      subtitle: "Review instructional blueprints, Bloom's Taxonomy depth, and pacing"
    },
    analytics: {
      title: "Visual Analytics & Longitudinal Reports",
      subtitle: "Deep-dive correlations between PD hours, feedback scores, and departmental benchmarks"
    },
    gamification: {
      title: "Educator Recognition & Gamification Hub",
      subtitle: "XP leaderboards, peer kudos, and verified achievement badges"
    },
    admin: {
      title: "School Management & Admin Console",
      subtitle: "Approve lesson plans, manage appraisal readiness, and export institutional data"
    }
  };

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }

  function populateTeacherSelects() {
    const selects = document.querySelectorAll(".dynamic-teacher-select");
    selects.forEach(function (sel) {
      sel.innerHTML = appState.teachers.map(function (t) {
        return `<option value="${t.id}">${t.name} (${t.department})</option>`;
      }).join("");
    });
  }

  function updateHeaderAndNav() {
    const meta = TAB_META[currentTab] || TAB_META.overview;
    const titleEl = document.getElementById("page-title");
    const subEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) subEl.textContent = meta.subtitle;

    document.querySelectorAll(".nav-item").forEach(function (btn) {
      const tab = btn.getAttribute("data-tab");
      if (tab === currentTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const pendingCount = appState.lessonPlans.filter(function (l) { return l.status === "Pending Review"; }).length;
    const badgeEl = document.getElementById("nav-pending-badge");
    if (badgeEl) {
      badgeEl.textContent = pendingCount;
    }
  }

  function renderCurrentView() {
    updateHeaderAndNav();
    const container = document.getElementById("main-content");
    if (!container) return;

    if (currentTab === "overview") {
      container.innerHTML = window.EduViews.renderOverview(appState);
      window.EduCharts.renderOverviewCharts(appState);
    } else if (currentTab === "teachers") {
      container.innerHTML = window.EduViews.renderTeacherProfiles(appState, filterDept, searchQuery);
      const selected = window.EduViews.findTeacher(appState, appState.selectedTeacherId);
      window.EduCharts.renderProfileRadar(selected);
      bindTeacherFilterInputs();
    } else if (currentTab === "attendance") {
      container.innerHTML = window.EduViews.renderAttendance(appState);
    } else if (currentTab === "training") {
      container.innerHTML = window.EduViews.renderTraining(appState);
    } else if (currentTab === "feedback") {
      container.innerHTML = window.EduViews.renderFeedback(appState);
    } else if (currentTab === "lessons") {
      container.innerHTML = window.EduViews.renderLessons(appState);
    } else if (currentTab === "analytics") {
      container.innerHTML = window.EduViews.renderAnalytics(appState);
      window.EduCharts.renderAnalyticsViewCharts(appState);
    } else if (currentTab === "gamification") {
      container.innerHTML = window.EduViews.renderGamification(appState);
    } else if (currentTab === "admin") {
      container.innerHTML = window.EduViews.renderAdmin(appState);
    }

    populateTeacherSelects();
  }

  function bindTeacherFilterInputs() {
    const searchInput = document.getElementById("teacher-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        searchQuery = e.target.value;
        renderCurrentView();
        const refreshedInput = document.getElementById("teacher-search-input");
        if (refreshedInput) {
          refreshedInput.focus();
          refreshedInput.setSelectionRange(refreshedInput.value.length, refreshedInput.value.length);
        }
      });
    }

    const deptSelect = document.getElementById("teacher-dept-filter");
    if (deptSelect) {
      deptSelect.addEventListener("change", function (e) {
        filterDept = e.target.value;
        renderCurrentView();
      });
    }
  }

  function openModal(modalId) {
    populateTeacherSelects();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(function (m) {
      m.classList.remove("open");
    });
  }

  function exportCSV() {
    const headers = ["Name", "Role", "Department", "PerformanceScore", "AttendanceRate", "StudentFeedback", "TrainingHours", "XP"];
    const rows = appState.teachers.map(function (t) {
      return [
        '"' + t.name + '"',
        '"' + t.role + '"',
        '"' + t.department + '"',
        t.performanceScore,
        t.attendanceRate,
        t.studentFeedbackAvg,
        t.trainingHours,
        t.xp
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "edupulse_faculty_performance_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Faculty performance report exported as CSV.");
  }

  function initEventDelegation() {
    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const target = btn.getAttribute("data-tab");
        if (target) {
          currentTab = target;
          renderCurrentView();
          const sidebar = document.getElementById("sidebar");
          const backdrop = document.getElementById("sidebar-backdrop");
          if (sidebar) sidebar.classList.remove("open");
          if (backdrop) backdrop.classList.remove("open");
        }
      });
    });

    const mobileBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (mobileBtn && sidebar && backdrop) {
      mobileBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        backdrop.classList.toggle("open");
      });
      backdrop.addEventListener("click", function () {
        sidebar.classList.remove("open");
        backdrop.classList.remove("open");
      });
    }

    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const current = window.EduStore.getTheme();
        const next = current === "dark" ? "light" : "dark";
        window.EduStore.setTheme(next);
        renderCurrentView();
        showToast("Switched to " + next + " mode.");
      });
    }

    const globalSearch = document.getElementById("global-search-input");
    if (globalSearch) {
      globalSearch.addEventListener("input", function (e) {
        searchQuery = e.target.value;
        if (currentTab !== "teachers") {
          currentTab = "teachers";
        }
        renderCurrentView();
      });
    }

    const roleSelect = document.getElementById("role-switcher");
    if (roleSelect) {
      roleSelect.addEventListener("change", function (e) {
        appState.currentUserRole = e.target.value;
        window.EduStore.saveState(appState);
        showToast("Active perspective switched to: " + e.target.options[e.target.selectedIndex].text);
        renderCurrentView();
      });
    }

    document.body.addEventListener("click", function (e) {
      const navTargetBtn = e.target.closest("[data-nav-target]");
      if (navTargetBtn) {
        currentTab = navTargetBtn.getAttribute("data-nav-target");
        renderCurrentView();
        return;
      }

      const inspectBtn = e.target.closest("[data-inspect-teacher]");
      if (inspectBtn) {
        appState.selectedTeacherId = inspectBtn.getAttribute("data-inspect-teacher");
        window.EduStore.saveState(appState);
        currentTab = "teachers";
        renderCurrentView();
        return;
      }

      const selectTeacherBtn = e.target.closest("[data-select-teacher]");
      if (selectTeacherBtn) {
        appState.selectedTeacherId = selectTeacherBtn.getAttribute("data-select-teacher");
        window.EduStore.saveState(appState);
        renderCurrentView();
        return;
      }

      const openModalBtn = e.target.closest("[data-open-modal]");
      if (openModalBtn) {
        openModal(openModalBtn.getAttribute("data-open-modal"));
        return;
      }

      const closeModalBtn = e.target.closest("[data-close-modal]");
      if (closeModalBtn) {
        closeAllModals();
        return;
      }

      const completeTrBtn = e.target.closest("[data-complete-training]");
      if (completeTrBtn) {
        const trId = completeTrBtn.getAttribute("data-complete-training");
        const tr = appState.trainings.find(function (x) { return x.id === trId; });
        if (tr) {
          tr.progress = 100;
          tr.status = "Certified";
          tr.completionDate = "2026-10-27";
          tr.credentialId = "CERT-" + Math.floor(10000 + Math.random() * 90000);
          const teacher = window.EduViews.findTeacher(appState, tr.teacherId);
          if (teacher) {
            teacher.trainingHours += tr.hours;
            teacher.xp += 250;
          }
          window.EduStore.saveState(appState);
          renderCurrentView();
          showToast("Certification verified! +250 XP awarded to " + (teacher ? teacher.name : "educator") + ".");
        }
        return;
      }

      const approveLpBtn = e.target.closest("[data-approve-lesson]");
      if (approveLpBtn) {
        const lpId = approveLpBtn.getAttribute("data-approve-lesson");
        const plan = appState.lessonPlans.find(function (x) { return x.id === lpId; });
        if (plan) {
          plan.status = "Approved";
          plan.completion = 100;
          const teacher = window.EduViews.findTeacher(appState, plan.teacherId);
          if (teacher) {
            teacher.xp += 150;
          }
          window.EduStore.saveState(appState);
          renderCurrentView();
          showToast("Lesson plan approved and published to curriculum library.");
        }
        return;
      }

      const kudosBtn = e.target.closest("[data-kudos-teacher]");
      if (kudosBtn) {
        const tId = kudosBtn.getAttribute("data-kudos-teacher");
        const teacher = window.EduViews.findTeacher(appState, tId);
        if (teacher) {
          teacher.xp += 100;
          window.EduStore.saveState(appState);
          renderCurrentView();
          showToast("Sent +100 XP Peer Kudos to " + teacher.name + "!");
        }
        return;
      }

      if (e.target.id === "btn-export-csv") {
        exportCSV();
        return;
      }

      if (e.target.id === "btn-reset-demo") {
        appState = window.EduStore.resetState();
        renderCurrentView();
        showToast("Demo data restored to initial competition state.");
      }
    });

    const formTeacher = document.getElementById("form-add-teacher");
    if (formTeacher) {
      formTeacher.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("t-name").value.trim();
        const role = document.getElementById("t-role").value.trim();
        const dept = document.getElementById("t-dept").value;
        const email = document.getElementById("t-email").value.trim();
        const exp = Number(document.getElementById("t-exp").value) || 3;
        const bio = document.getElementById("t-bio").value.trim();

        const parts = name.split(" ");
        const initials = (parts[0][0] + (parts[1] ? parts[1][0] : "E")).toUpperCase();
        const newId = "t" + (appState.teachers.length + 1) + "_" + Date.now().toString().slice(-3);

        const newTeacher = {
          id: newId,
          name: name,
          role: role,
          department: dept,
          email: email,
          phone: "+94 77 401 2290",
          experienceYears: exp,
          avatarBg: "linear-gradient(135deg, #4f46e5, #0d9488)",
          initials: initials,
          performanceScore: 91,
          attendanceRate: 98.0,
          punctualityRate: 98.0,
          studentFeedbackAvg: 4.8,
          trainingHours: 24,
          xp: 2200,
          level: "Innovator II",
          bio: bio || "Dedicated educator focused on student mastery and collaborative inquiry.",
          competencies: {
            pedagogy: 92,
            engagement: 91,
            curriculum: 90,
            technology: 93,
            assessment: 89,
            collaboration: 92
          },
          milestones: [
            { year: "2026", title: "Joined Royal Crest Faculty", detail: "Appointed to " + dept + " division." }
          ],
          badges: ["b1", "b5"]
        };

        appState.teachers.unshift(newTeacher);
        appState.selectedTeacherId = newId;
        window.EduStore.saveState(appState);
        formTeacher.reset();
        closeAllModals();
        currentTab = "teachers";
        renderCurrentView();
        showToast("Added educator profile for " + name + ".");
      });
    }

    const formAttendance = document.getElementById("form-add-attendance");
    if (formAttendance) {
      formAttendance.addEventListener("submit", function (e) {
        e.preventDefault();
        const teacherId = document.getElementById("a-teacher").value;
        const date = document.getElementById("a-date").value;
        const checkIn = document.getElementById("a-time").value;
        const status = document.getElementById("a-status").value;
        const classes = Number(document.getElementById("a-classes").value) || 4;
        const note = document.getElementById("a-note").value.trim() || "Regular schedule";

        appState.attendanceLogs.unshift({
          id: "a_" + Date.now(),
          teacherId: teacherId,
          date: date,
          checkIn: checkIn,
          status: status,
          classesCovered: classes,
          note: note
        });

        window.EduStore.saveState(appState);
        formAttendance.reset();
        closeAllModals();
        renderCurrentView();
        showToast("Attendance check-in logged.");
      });
    }

    const formTraining = document.getElementById("form-add-training");
    if (formTraining) {
      formTraining.addEventListener("submit", function (e) {
        e.preventDefault();
        const teacherId = document.getElementById("tr-teacher").value;
        const title = document.getElementById("tr-title").value.trim();
        const provider = document.getElementById("tr-provider").value.trim();
        const category = document.getElementById("tr-category").value;
        const hours = Number(document.getElementById("tr-hours").value) || 12;
        const status = document.getElementById("tr-status").value;

        const isCert = status === "Certified";
        appState.trainings.unshift({
          id: "tr_" + Date.now(),
          teacherId: teacherId,
          title: title,
          provider: provider,
          category: category,
          hours: hours,
          progress: isCert ? 100 : 50,
          status: status,
          completionDate: isCert ? "2026-10-27" : "Expected Dec 2026",
          credentialId: isCert ? "CRED-" + Math.floor(1000 + Math.random() * 9000) : "Pending"
        });

        const teacher = window.EduViews.findTeacher(appState, teacherId);
        if (teacher && isCert) {
          teacher.trainingHours += hours;
          teacher.xp += 200;
        }

        window.EduStore.saveState(appState);
        formTraining.reset();
        closeAllModals();
        renderCurrentView();
        showToast("Professional development record saved.");
      });
    }

    const formFeedback = document.getElementById("form-add-feedback");
    if (formFeedback) {
      formFeedback.addEventListener("submit", function (e) {
        e.preventDefault();
        const teacherId = document.getElementById("fb-teacher").value;
        const sourceType = document.getElementById("fb-source").value;
        const reviewer = document.getElementById("fb-reviewer").value.trim();
        const clarity = Number(document.getElementById("fb-clarity").value) || 5;
        const engagement = Number(document.getElementById("fb-engagement").value) || 5;
        const support = Number(document.getElementById("fb-support").value) || 5;
        const comment = document.getElementById("fb-comment").value.trim();

        const avg = Math.round(((clarity + engagement + support) / 3) * 10) / 10;

        appState.feedbackList.unshift({
          id: "fb_" + Date.now(),
          teacherId: teacherId,
          sourceType: sourceType,
          reviewer: reviewer,
          date: "2026-10-27",
          rating: avg,
          clarity: clarity,
          engagement: engagement,
          support: support,
          tags: ["Verified Review", sourceType],
          comment: comment
        });

        const teacher = window.EduViews.findTeacher(appState, teacherId);
        if (teacher) {
          teacher.studentFeedbackAvg = Math.round(((teacher.studentFeedbackAvg + avg) / 2) * 10) / 10;
          teacher.xp += 120;
        }

        window.EduStore.saveState(appState);
        formFeedback.reset();
        closeAllModals();
        renderCurrentView();
        showToast("Evaluation submitted! Educator rating & XP updated.");
      });
    }

    const formLesson = document.getElementById("form-add-lesson");
    if (formLesson) {
      formLesson.addEventListener("submit", function (e) {
        e.preventDefault();
        const teacherId = document.getElementById("lp-teacher").value;
        const title = document.getElementById("lp-title").value.trim();
        const subject = document.getElementById("lp-subject").value.trim();
        const grade = document.getElementById("lp-grade").value.trim();
        const bloom = document.getElementById("lp-bloom").value;
        const objectives = document.getElementById("lp-objectives").value.trim();
        const resources = document.getElementById("lp-resources").value.trim();

        appState.lessonPlans.unshift({
          id: "lp_" + Date.now(),
          teacherId: teacherId,
          title: title,
          subject: subject,
          grade: grade,
          week: "Week 10 • Nov 2026",
          completion: 85,
          status: "Pending Review",
          objectives: objectives,
          bloomLevel: bloom,
          resources: resources || "Interactive slides, rubric handout"
        });

        window.EduStore.saveState(appState);
        formLesson.reset();
        closeAllModals();
        renderCurrentView();
        showToast("Lesson plan submitted for leadership review.");
      });
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    const savedTheme = window.EduStore.getTheme();
    window.EduStore.setTheme(savedTheme);
    initEventDelegation();
    renderCurrentView();
  });
})();
