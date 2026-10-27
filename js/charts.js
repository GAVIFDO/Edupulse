(function () {
  const activeCharts = {};

  function destroyChart(id) {
    if (activeCharts[id]) {
      activeCharts[id].destroy();
      delete activeCharts[id];
    }
  }

  function getPalette() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return {
      text: isDark ? "#94a3b8" : "#475569",
      grid: isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(15, 23, 42, 0.07)",
      indigo: "#4f46e5",
      teal: "#0d9488",
      amber: "#d97706",
      rose: "#e11d48",
      emerald: "#059669"
    };
  }

  function renderOverviewCharts(state) {
    if (typeof Chart === "undefined") return;
    const palette = getPalette();

    const trendEl = document.getElementById("chart-overview-trend");
    if (trendEl) {
      destroyChart("chart-overview-trend");
      activeCharts["chart-overview-trend"] = new Chart(trendEl, {
        type: "line",
        data: {
          labels: state.monthlyTrends.labels,
          datasets: [
            {
              label: "Instructional Index (%)",
              data: state.monthlyTrends.performance,
              borderColor: palette.indigo,
              backgroundColor: "rgba(79, 70, 229, 0.12)",
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 4
            },
            {
              label: "Student Engagement (%)",
              data: state.monthlyTrends.engagement,
              borderColor: palette.teal,
              backgroundColor: "rgba(13, 148, 136, 0.08)",
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: palette.text, font: { family: "Plus Jakarta Sans", size: 12 } } }
          },
          scales: {
            y: {
              min: 80,
              max: 100,
              ticks: { color: palette.text },
              grid: { color: palette.grid }
            },
            x: {
              ticks: { color: palette.text },
              grid: { display: false }
            }
          }
        }
      });
    }

    const deptEl = document.getElementById("chart-dept-comparison");
    if (deptEl) {
      destroyChart("chart-dept-comparison");
      const deptMap = {};
      state.teachers.forEach(function (t) {
        if (!deptMap[t.department]) {
          deptMap[t.department] = { sum: 0, count: 0 };
        }
        deptMap[t.department].sum += t.performanceScore;
        deptMap[t.department].count += 1;
      });
      const labels = Object.keys(deptMap);
      const values = labels.map(function (d) {
        return Math.round((deptMap[d].sum / deptMap[d].count) * 10) / 10;
      });

      activeCharts["chart-dept-comparison"] = new Chart(deptEl, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Avg Performance Score",
              data: values,
              backgroundColor: [
                "rgba(79, 70, 229, 0.82)",
                "rgba(13, 148, 136, 0.82)",
                "rgba(225, 29, 72, 0.82)",
                "rgba(124, 58, 237, 0.82)",
                "rgba(217, 119, 6, 0.82)"
              ],
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              min: 75,
              max: 100,
              ticks: { color: palette.text },
              grid: { color: palette.grid }
            },
            x: {
              ticks: { color: palette.text },
              grid: { display: false }
            }
          }
        }
      });
    }
  }

  function renderProfileRadar(teacher) {
    if (typeof Chart === "undefined" || !teacher) return;
    const radarEl = document.getElementById("chart-teacher-radar");
    if (!radarEl) return;

    const palette = getPalette();
    destroyChart("chart-teacher-radar");

    const c = teacher.competencies || {
      pedagogy: 90,
      engagement: 90,
      curriculum: 90,
      technology: 90,
      assessment: 90,
      collaboration: 90
    };

    activeCharts["chart-teacher-radar"] = new Chart(radarEl, {
      type: "radar",
      data: {
        labels: [
          "Pedagogy",
          "Student Engagement",
          "Curriculum Design",
          "EdTech Integration",
          "Assessment Quality",
          "Peer Collaboration"
        ],
        datasets: [
          {
            label: teacher.name,
            data: [
              c.pedagogy,
              c.engagement,
              c.curriculum,
              c.technology,
              c.assessment,
              c.collaboration
            ],
            backgroundColor: "rgba(79, 70, 229, 0.22)",
            borderColor: palette.indigo,
            pointBackgroundColor: palette.indigo,
            borderWidth: 2
          },
          {
            label: "School Benchmark",
            data: [88, 89, 87, 85, 86, 88],
            backgroundColor: "rgba(13, 148, 136, 0.1)",
            borderColor: palette.teal,
            borderDash: [4, 4],
            pointBackgroundColor: palette.teal,
            borderWidth: 1.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 70,
            suggestedMax: 100,
            angleLines: { color: palette.grid },
            grid: { color: palette.grid },
            pointLabels: {
              color: palette.text,
              font: { family: "Plus Jakarta Sans", size: 11, weight: "600" }
            },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: {
            labels: { color: palette.text, font: { family: "Plus Jakarta Sans", size: 11 } }
          }
        }
      }
    });
  }

  function renderAnalyticsViewCharts(state) {
    if (typeof Chart === "undefined") return;
    const palette = getPalette();

    const scatterEl = document.getElementById("chart-analytics-training-vs-score");
    if (scatterEl) {
      destroyChart("chart-analytics-training-vs-score");
      activeCharts["chart-analytics-training-vs-score"] = new Chart(scatterEl, {
        type: "bar",
        data: {
          labels: state.teachers.map(function (t) { return t.name.split(" ").slice(-1)[0]; }),
          datasets: [
            {
              label: "Performance Score (%)",
              data: state.teachers.map(function (t) { return t.performanceScore; }),
              backgroundColor: "rgba(79, 70, 229, 0.85)",
              borderRadius: 6
            },
            {
              label: "PD Hours Completed (x2 scaled)",
              data: state.teachers.map(function (t) { return Math.min(100, t.trainingHours * 2); }),
              backgroundColor: "rgba(13, 148, 136, 0.8)",
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: palette.text } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: palette.text },
              grid: { color: palette.grid }
            },
            x: {
              ticks: { color: palette.text },
              grid: { display: false }
            }
          }
        }
      });
    }

    const doughnutEl = document.getElementById("chart-analytics-feedback-dist");
    if (doughnutEl) {
      destroyChart("chart-analytics-feedback-dist");
      let fiveStar = 0;
      let fourFive = 0;
      let fourStar = 0;
      state.feedbackList.forEach(function (f) {
        if (f.rating >= 4.9) fiveStar++;
        else if (f.rating >= 4.6) fourFive++;
        else fourStar++;
      });

      activeCharts["chart-analytics-feedback-dist"] = new Chart(doughnutEl, {
        type: "doughnut",
        data: {
          labels: ["4.9 - 5.0 Exceptional", "4.6 - 4.8 Strong", "4.0 - 4.5 Solid"],
          datasets: [
            {
              data: [fiveStar, fourFive, Math.max(1, fourStar)],
              backgroundColor: [palette.indigo, palette.teal, palette.amber],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: palette.text, padding: 14 }
            }
          }
        }
      });
    }
  }

  window.EduCharts = {
    renderOverviewCharts: renderOverviewCharts,
    renderProfileRadar: renderProfileRadar,
    renderAnalyticsViewCharts: renderAnalyticsViewCharts
  };
})();
