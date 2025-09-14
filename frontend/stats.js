const viewStatsBtn = document.getElementById("viewStatsBtn");
const statsMinutes = document.getElementById("total-time");
const statsSessions = document.getElementById("total-pomodoros");

viewStatsBtn.addEventListener("click", async () => {
    viewStatsBtn.textContent = "Loading...";

    try {
        const session = await window.fetchStats();
        const minutes = session.total_focus_min;
        statsSessions.textContent = `${session.total_sessions}`;
        statsMinutes.textContent = `${minutes}`;

        viewStatsBtn.textContent = "View Stats";
    } catch (e) {
        console.error(e);
        viewStatsBtn.textContent = "Error — Retry?";
    }
});

document.addEventListener("stats:refresh", async () => {
  try {
    const s = await window.fetchStats();
    statsSessions.textContent = s.total_sessions;
    statsMinutes.textContent = s.total_focus_min;
  } catch {}
});