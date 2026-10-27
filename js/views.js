(function () {
  function findTeacher(state, id) {
    return state.teachers.find(function (t) { return t.id === id; }) || state.teachers[0];
  }

  function renderStars(score) {
    const full = Math.round(score);
    let out = "";
    for (let i = 0; i < 5; i++) {
      out += i < full ? "★" : "☆";
    }
    return out;
  }

  function computeSchoolAverages(state) {
    const count = state.teachers.length || 1;
    let perf = 0;
    let att = 0;
    let fb = 0;
    let hours = 0;
    state.teachers.forEach(function (t) {
      perf += Number(t.performanceScore) || 0;
      att += Number(t.attendanceRate) || 0;
      fb += Number(t.studentFeedbackAvg) || 0;
      hours += Number(t.trainingHours) || 0;
    });
    return {
      avgPerf: (perf / count).toFixed(1),
      avgAtt: (att / count).toFixed(1),
      avgFb: (fb / count).toFixed(2),
      totalHours: hours
    };
  }

  function renderOverview(state) {
    const stats = computeSchoolAverages(state);
    const pendingLessons = state.lessonPlans.filter(function (l) { return l.status === "Pending Review"; }).length;

    const topPerformers = state.teachers
      .slice()
      .sort(function (a, b) { return b.performanceScore - a.performanceScore; })
      .slice(0, 4);

    const recentFeedback = state.feedbackList.slice(0, 3);

    return `
      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-info">
            <span>Faculty Performance Index</span>
            <h3>${stats.avgPerf}%</h3>
            <div class="stat-trend up">▲ +2.4% vs last quarter</div>
          </div>
          <div class="stat-icon indigo">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>Attendance & Punctuality</span>
            <h3>${stats.avgAtt}%</h3>
            <div class="stat-trend up">▲ 98.2% on-time check-ins</div>
          </div>
          <div class="stat-icon teal">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>Student Feedback Rating</span>
            <h3>${stats.avgFb} / 5.0</h3>
            <div class="stat-trend up">★ Across ${state.feedbackList.length} verified cohorts</div>
          </div>
          <div class="stat-icon amber">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>PD Training Logged</span>
            <h3>${stats.totalHours} hrs</h3>
            <div class="stat-trend neutral">${pendingLessons} lesson plans awaiting review</div>
          </div>
          <div class="stat-icon emerald">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
          </div>
        </div>
      </div>

      <div class="grid-asymmetric">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Instructional Quality & Student Engagement Trajectory</div>
              <div class="card-subtitle">6-month longitudinal index across all academic departments</div>
            </div>
            <span class="badge badge-indigo">Academic Year 2026</span>
          </div>
          <div class="chart-box">
            <canvas id="chart-overview-trend"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Departmental Benchmarks</div>
              <div class="card-subtitle">Composite score by faculty division</div>
            </div>
          </div>
          <div class="chart-box">
            <canvas id="chart-dept-comparison"></canvas>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Leading Educators This Quarter</div>
              <div class="card-subtitle">Ranked by holistic rubric, student feedback, and PD milestones</div>
            </div>
            <button class="btn btn-secondary btn-sm" data-nav-target="teachers">View Directory</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Educator</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Feedback</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${topPerformers.map(function (t) {
                  return `
                    <tr>
                      <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                          <div class="avatar" style="width:36px;height:36px;font-size:0.8rem;background:${t.avatarBg}">${t.initials}</div>
                          <div>
                            <div style="font-weight:700;">${t.name}</div>
                            <div style="font-size:0.74rem;color:var(--text-secondary);">${t.level}</div>
                          </div>
                        </div>
                      </td>
                      <td><span class="badge badge-indigo">${t.department}</span></td>
                      <td><strong>${t.performanceScore}%</strong></td>
                      <td><span class="star-rating">★</span> <strong>${t.studentFeedbackAvg}</strong></td>
                      <td>
                        <button class="btn btn-secondary btn-sm" data-inspect-teacher="${t.id}">Inspect</button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Recent Classroom Feedback & Observations</div>
              <div class="card-subtitle">Latest verified student and leadership evaluations</div>
            </div>
            <button class="btn btn-primary btn-sm" data-open-modal="modal-feedback">+ Submit Evaluation</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${recentFeedback.map(function (f) {
              const teacher = findTeacher(state, f.teacherId);
              return `
                <div style="padding:12px 14px;border-radius:var(--radius-sm);background:var(--bg-subtle);border:1px solid var(--border-color);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <div>
                      <strong>${teacher.name}</strong>
                      <span class="badge badge-teal" style="margin-left:6px;">${f.sourceType}</span>
                    </div>
                    <span class="star-rating">${renderStars(f.rating)} (${f.rating})</span>
                  </div>
                  <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:6px;">"${f.comment}"</p>
                  <div style="font-size:0.72rem;color:var(--text-muted);display:flex;justify-content:space-between;">
                    <span>Reviewer: ${f.reviewer}</span>
                    <span>${f.date}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderTeacherProfiles(state, filterDept, searchQuery) {
    const query = (searchQuery || "").toLowerCase().trim();
    const dept = filterDept || "ALL";

    const filtered = state.teachers.filter(function (t) {
      const matchesDept = dept === "ALL" || t.department === dept;
      const matchesQuery = !query ||
        t.name.toLowerCase().indexOf(query) !== -1 ||
        t.role.toLowerCase().indexOf(query) !== -1 ||
        t.department.toLowerCase().indexOf(query) !== -1;
      return matchesDept && matchesQuery;
    });

    const selected = findTeacher(state, state.selectedTeacherId);
    const departments = ["ALL", "STEM & Robotics", "Mathematics", "Humanities", "Creative Arts", "Languages"];

    return `
      <div class="toolbar">
        <div class="filter-group">
          <input type="text" id="teacher-search-input" class="input-control" placeholder="Search faculty by name, role, subject..." value="${searchQuery || ""}" style="min-width:250px;">
          <select id="teacher-dept-filter" class="select-control">
            ${departments.map(function (d) {
              return `<option value="${d}" ${d === dept ? "selected" : ""}>${d === "ALL" ? "All Departments" : d}</option>`;
            }).join("")}
          </select>
        </div>
        <button class="btn btn-primary" data-open-modal="modal-teacher">+ Add Educator Profile</button>
      </div>

      <div class="grid-asymmetric">
        <div>
          <div class="grid-2" style="margin-bottom:0;">
            ${filtered.map(function (t) {
              const isSelected = t.id === selected.id;
              return `
                <div class="card teacher-card" style="${isSelected ? "border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-light);" : ""}">
                  <div class="teacher-card-top">
                    <div class="avatar" style="background:${t.avatarBg}">${t.initials}</div>
                    <div class="teacher-meta">
                      <h4>${t.name}</h4>
                      <p>${t.role}</p>
                      <span class="badge badge-indigo" style="margin-top:5px;">${t.department}</span>
                    </div>
                  </div>
                  <p style="font-size:0.81rem;color:var(--text-secondary);">${t.bio}</p>
                  <div class="teacher-metrics-row">
                    <div class="metric-mini">
                      <span>Performance</span>
                      <strong>${t.performanceScore}%</strong>
                    </div>
                    <div class="metric-mini">
                      <span>Attendance</span>
                      <strong>${t.attendanceRate}%</strong>
                    </div>
                    <div class="metric-mini">
                      <span>Rating</span>
                      <strong>★ ${t.studentFeedbackAvg}</strong>
                    </div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <span style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;">${t.experienceYears} yrs exp • ${t.trainingHours}h PD</span>
                    <button class="btn ${isSelected ? "btn-primary" : "btn-secondary"} btn-sm" data-select-teacher="${t.id}">
                      ${isSelected ? "Selected Profile" : "View Portfolio"}
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div class="card" style="align-self:start;position:sticky;top:88px;">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
            <div class="avatar avatar-lg" style="background:${selected.avatarBg}">${selected.initials}</div>
            <div>
              <span class="badge badge-teal">${selected.level}</span>
              <h3 style="font-size:1.2rem;font-weight:800;margin-top:4px;">${selected.name}</h3>
              <p style="font-size:0.82rem;color:var(--text-secondary);">${selected.email} • ${selected.phone}</p>
            </div>
          </div>

          <div style="margin-bottom:18px;">
            <div class="card-title" style="font-size:0.9rem;margin-bottom:6px;">6-Axis Competency Matrix vs Benchmark</div>
            <div class="chart-box" style="height:240px;">
              <canvas id="chart-teacher-radar"></canvas>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="card-title" style="font-size:0.9rem;margin-bottom:10px;">Career Milestones & Achievements</div>
            <div class="timeline">
              ${(selected.milestones || []).map(function (m) {
                return `
                  <div class="timeline-item">
                    <div style="font-size:0.72rem;font-weight:700;color:var(--primary);">${m.year}</div>
                    <div style="font-size:0.86rem;font-weight:700;">${m.title}</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary);">${m.detail}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAttendance(state) {
    const onTimeCount = state.attendanceLogs.filter(function (a) { return a.status === "On Time"; }).length;
    const punctualityRatio = state.attendanceLogs.length
      ? Math.round((onTimeCount / state.attendanceLogs.length) * 100)
      : 98;

    return `
      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-info">
            <span>Daily Check-In Rate</span>
            <h3>97.8%</h3>
            <div class="stat-trend up">▲ 100% classes covered today</div>
          </div>
          <div class="stat-icon teal">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>Punctuality Index</span>
            <h3>${punctualityRatio}%</h3>
            <div class="stat-trend up">▲ Before 07:55 AM bell</div>
          </div>
          <div class="stat-icon indigo">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>Substitute Coverage Needed</span>
            <h3>0 Classes</h3>
            <div class="stat-trend neutral">Zero unstaffed periods</div>
          </div>
          <div class="stat-icon emerald">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span>Total Logged Sessions</span>
            <h3>${state.attendanceLogs.length}</h3>
            <div class="stat-trend up">Verified biometric & portal logs</div>
          </div>
          <div class="stat-icon amber">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
        </div>
      </div>

      <div class="grid-asymmetric">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Daily Attendance & Punctuality Ledger</div>
              <div class="card-subtitle">Real-time arrival timestamps and instructional period coverage</div>
            </div>
            <button class="btn btn-primary btn-sm" data-open-modal="modal-attendance">+ Log Check-In</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Educator</th>
                  <th>Date</th>
                  <th>Check-In Time</th>
                  <th>Status</th>
                  <th>Classes Covered</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${state.attendanceLogs.map(function (log) {
                  const t = findTeacher(state, log.teacherId);
                  const badgeClass = log.status === "On Time"
                    ? "badge-emerald"
                    : log.status === "Late"
                    ? "badge-amber"
                    : "badge-rose";
                  return `
                    <tr>
                      <td><strong>${t.name}</strong></td>
                      <td>${log.date}</td>
                      <td>${log.checkIn}</td>
                      <td><span class="badge ${badgeClass}">${log.status}</span></td>
                      <td>${log.classesCovered} periods</td>
                      <td style="color:var(--text-secondary);">${log.note}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Faculty Punctuality Breakdown</div>
              <div class="card-subtitle">Cumulative semester attendance & on-time arrival rates</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${state.teachers.map(function (t) {
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:5px;">
                    <strong>${t.name}</strong>
                    <span style="color:var(--text-secondary);">Attendance: <strong>${t.attendanceRate}%</strong> • Punctuality: <strong>${t.punctualityRate}%</strong></span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width:${t.punctualityRate}%"></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderTraining(state) {
    return `
      <div class="toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:700;">Professional Development & Micro-Credentials</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Track workshops, accredited certifications, and continuing education units (CEUs)</p>
        </div>
        <button class="btn btn-primary" data-open-modal="modal-training">+ Enroll / Log Certification</button>
      </div>

      <div class="grid-3">
        ${state.trainings.map(function (tr) {
          const teacher = findTeacher(state, tr.teacherId);
          const isDone = tr.progress >= 100 || tr.status === "Certified";
          return `
            <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <span class="badge badge-indigo">${tr.category}</span>
                  <span class="badge ${isDone ? "badge-emerald" : "badge-amber"}">${tr.status}</span>
                </div>
                <h4 style="font-size:0.98rem;font-weight:700;margin-bottom:4px;">${tr.title}</h4>
                <p style="font-size:0.8rem;color:var(--text-secondary);">${tr.provider} • <strong>${tr.hours} PD Hours</strong></p>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:0.76rem;margin-bottom:5px;">
                  <span>Educator: <strong>${teacher.name}</strong></span>
                  <span><strong>${tr.progress}%</strong></span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${tr.progress}%"></div>
                </div>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border-color);font-size:0.76rem;color:var(--text-secondary);">
                <span>ID: ${tr.credentialId}</span>
                ${!isDone
                  ? `<button class="btn btn-teal btn-sm" data-complete-training="${tr.id}">Mark 100% Certified</button>`
                  : `<span>Completed ${tr.completionDate}</span>`
                }
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderFeedback(state) {
    return `
      <div class="toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:700;">360° Classroom Feedback & Peer Observations</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Synthesizing student voice, peer walkthroughs, and academic leadership reviews</p>
        </div>
        <button class="btn btn-primary" data-open-modal="modal-feedback">+ New Classroom Evaluation</button>
      </div>

      <div class="grid-2">
        ${state.feedbackList.map(function (f) {
          const teacher = findTeacher(state, f.teacherId);
          return `
            <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div class="avatar" style="width:40px;height:40px;font-size:0.85rem;background:${teacher.avatarBg}">${teacher.initials}</div>
                    <div>
                      <h4 style="font-size:0.95rem;font-weight:700;">${teacher.name}</h4>
                      <span style="font-size:0.76rem;color:var(--text-secondary);">${f.reviewer} • ${f.date}</span>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <div class="star-rating">${renderStars(f.rating)}</div>
                    <span class="badge badge-teal">${f.sourceType}</span>
                  </div>
                </div>
                <p style="font-size:0.86rem;color:var(--text-main);line-height:1.55;margin-bottom:12px;">"${f.comment}"</p>
              </div>

              <div>
                <div class="teacher-metrics-row" style="margin-bottom:10px;">
                  <div class="metric-mini"><span>Clarity</span><strong>${f.clarity}/5</strong></div>
                  <div class="metric-mini"><span>Engagement</span><strong>${f.engagement}/5</strong></div>
                  <div class="metric-mini"><span>Support</span><strong>${f.support}/5</strong></div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${(f.tags || []).map(function (tag) {
                    return `<span class="badge badge-indigo">${tag}</span>`;
                  }).join("")}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderLessons(state) {
    return `
      <div class="toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:700;">Curriculum & Lesson Plan Repository</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Structured lesson blueprints aligned with Bloom's Taxonomy and syllabus milestones</p>
        </div>
        <button class="btn btn-primary" data-open-modal="modal-lesson">+ Submit Lesson Plan</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lesson Plan & Objectives</th>
                <th>Educator</th>
                <th>Subject & Grade</th>
                <th>Bloom's Taxonomy</th>
                <th>Syllabus Pacing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.lessonPlans.map(function (lp) {
                const teacher = findTeacher(state, lp.teacherId);
                const isApproved = lp.status === "Approved";
                return `
                  <tr>
                    <td style="max-width:310px;">
                      <div style="font-weight:700;margin-bottom:3px;">${lp.title}</div>
                      <div style="font-size:0.77rem;color:var(--text-secondary);">${lp.objectives}</div>
                      <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px;">Resources: ${lp.resources}</div>
                    </td>
                    <td><strong>${teacher.name}</strong><div style="font-size:0.74rem;color:var(--text-secondary);">${lp.week}</div></td>
                    <td>
                      <span class="badge badge-indigo">${lp.subject}</span>
                      <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;">${lp.grade}</div>
                    </td>
                    <td><span class="badge badge-teal">${lp.bloomLevel}</span></td>
                    <td style="min-width:130px;">
                      <div style="font-size:0.75rem;font-weight:700;margin-bottom:4px;">${lp.completion}% Complete</div>
                      <div class="progress-track">
                        <div class="progress-fill" style="width:${lp.completion}%"></div>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${isApproved ? "badge-emerald" : "badge-amber"}">${lp.status}</span>
                    </td>
                    <td>
                      ${!isApproved
                        ? `<button class="btn btn-teal btn-sm" data-approve-lesson="${lp.id}">Approve Plan</button>`
                        : `<span style="font-size:0.76rem;color:var(--accent-emerald);font-weight:600;">✓ Verified</span>`
                      }
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAnalytics(state) {
    return `
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Performance Score vs. Professional Development Hours</div>
              <div class="card-subtitle">Comparing instructional evaluation index against completed training</div>
            </div>
          </div>
          <div class="chart-box">
            <canvas id="chart-analytics-training-vs-score"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Classroom Evaluation Score Distribution</div>
              <div class="card-subtitle">Breakdown of student & peer ratings across cohorts</div>
            </div>
          </div>
          <div class="chart-box">
            <canvas id="chart-analytics-feedback-dist"></canvas>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Comprehensive Faculty Competency Matrix</div>
            <div class="card-subtitle">Side-by-side breakdown across all 6 instructional pillars</div>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Educator</th>
                <th>Pedagogy</th>
                <th>Engagement</th>
                <th>Curriculum</th>
                <th>EdTech</th>
                <th>Assessment</th>
                <th>Collaboration</th>
                <th>Composite</th>
              </tr>
            </thead>
            <tbody>
              ${state.teachers.map(function (t) {
                const c = t.competencies || {};
                return `
                  <tr>
                    <td><strong>${t.name}</strong><div style="font-size:0.74rem;color:var(--text-secondary);">${t.department}</div></td>
                    <td>${c.pedagogy || 90}%</td>
                    <td>${c.engagement || 90}%</td>
                    <td>${c.curriculum || 90}%</td>
                    <td>${c.technology || 90}%</td>
                    <td>${c.assessment || 90}%</td>
                    <td>${c.collaboration || 90}%</td>
                    <td><span class="badge badge-indigo">${t.performanceScore}%</span></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderGamification(state) {
    const ranked = state.teachers.slice().sort(function (a, b) { return b.xp - a.xp; });

    return `
      <div class="grid-asymmetric">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Educator Excellence & XP Leaderboard</div>
              <div class="card-subtitle">Celebrating continuous growth, mentorship, and student impact</div>
            </div>
            <span class="badge badge-emerald">Season: Autumn Term 2026</span>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Educator</th>
                  <th>Tier Level</th>
                  <th>Badges Earned</th>
                  <th>Total XP</th>
                  <th>Recognize</th>
                </tr>
              </thead>
              <tbody>
                ${ranked.map(function (t, idx) {
                  const medal = idx === 0 ? "🥇 1st" : idx === 1 ? "🥈 2nd" : idx === 2 ? "🥉 3rd" : "#" + (idx + 1);
                  return `
                    <tr>
                      <td><strong>${medal}</strong></td>
                      <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                          <div class="avatar" style="width:36px;height:36px;font-size:0.8rem;background:${t.avatarBg}">${t.initials}</div>
                          <div>
                            <strong>${t.name}</strong>
                            <div style="font-size:0.74rem;color:var(--text-secondary);">${t.department}</div>
                          </div>
                        </div>
                      </td>
                      <td><span class="badge badge-indigo">${t.level}</span></td>
                      <td>
                        <div style="display:flex;gap:4px;font-size:1.05rem;">
                          ${(t.badges || []).map(function (bid) {
                            const b = state.badgeCatalog.find(function (x) { return x.id === bid; });
                            return b ? `<span title="${b.name}">${b.icon}</span>` : "";
                          }).join("")}
                        </div>
                      </td>
                      <td><strong style="color:var(--primary);">${t.xp.toLocaleString()} XP</strong></td>
                      <td>
                        <button class="btn btn-secondary btn-sm" data-kudos-teacher="${t.id}">+100 XP Kudos</button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Achievement Badge Catalog</div>
              <div class="card-subtitle">Milestones unlocked through verified teaching excellence</div>
            </div>
          </div>
          <div class="grid-2" style="margin-bottom:0;gap:12px;">
            ${state.badgeCatalog.map(function (b) {
              return `
                <div class="badge-card">
                  <div class="badge-emoji">${b.icon}</div>
                  <div style="font-weight:700;font-size:0.88rem;">${b.name}</div>
                  <p style="font-size:0.75rem;color:var(--text-secondary);">${b.desc}</p>
                  <span class="badge badge-teal">+${b.xpBonus} XP</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderAdmin(state) {
    const pendingPlans = state.lessonPlans.filter(function (l) { return l.status === "Pending Review"; });

    return `
      <div class="toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:700;">School Management & Governance Console</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">Approve curriculum submissions, export audit reports, and manage appraisal cycles</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary" id="btn-export-csv">Export Faculty CSV Report</button>
          <button class="btn btn-secondary" id="btn-reset-demo">Reset Demo Data</button>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Pending Lesson Plan Approvals (${pendingPlans.length})</div>
              <div class="card-subtitle">Direct sign-off queue for Department Heads and Principal</div>
            </div>
          </div>
          ${pendingPlans.length === 0
            ? `<p style="font-size:0.86rem;color:var(--accent-emerald);font-weight:600;padding:12px 0;">✓ All submitted lesson plans have been reviewed and approved.</p>`
            : `<div style="display:flex;flex-direction:column;gap:12px;">
                ${pendingPlans.map(function (lp) {
                  const teacher = findTeacher(state, lp.teacherId);
                  return `
                    <div style="padding:14px;border-radius:var(--radius-sm);background:var(--bg-subtle);border:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;gap:12px;">
                      <div>
                        <div style="font-weight:700;font-size:0.9rem;">${lp.title}</div>
                        <div style="font-size:0.78rem;color:var(--text-secondary);">${teacher.name} • ${lp.subject} (${lp.grade})</div>
                      </div>
                      <button class="btn btn-teal btn-sm" data-approve-lesson="${lp.id}">Approve</button>
                    </div>
                  `;
                }).join("")}
              </div>`
          }
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Annual Appraisal & Promotion Readiness</div>
              <div class="card-subtitle">Automated eligibility based on performance >= 92% and PD >= 35 hrs</div>
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Educator</th>
                  <th>Score</th>
                  <th>PD Hours</th>
                  <th>Appraisal Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.teachers.map(function (t) {
                  const eligible = t.performanceScore >= 92 && t.trainingHours >= 35;
                  return `
                    <tr>
                      <td><strong>${t.name}</strong></td>
                      <td>${t.performanceScore}%</td>
                      <td>${t.trainingHours} hrs</td>
                      <td>
                        <span class="badge ${eligible ? "badge-emerald" : "badge-indigo"}">
                          ${eligible ? "Merit Tier Ready" : "On Track"}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.EduViews = {
    renderOverview: renderOverview,
    renderTeacherProfiles: renderTeacherProfiles,
    renderAttendance: renderAttendance,
    renderTraining: renderTraining,
    renderFeedback: renderFeedback,
    renderLessons: renderLessons,
    renderAnalytics: renderAnalytics,
    renderGamification: renderGamification,
    renderAdmin: renderAdmin,
    findTeacher: findTeacher
  };
})();
