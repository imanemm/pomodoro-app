const viewStatsBtn  = document.getElementById("viewStatsBtn");
const statsPanel    = document.getElementById("stats");
const closeStatsBtn = document.getElementById("closeStatsBtn");
const statsMinutes  = document.getElementById("total-time");
const statsSessions = document.getElementById("total-pomodoros");

const updateStats = (session) => {
  if (session.total_sessions !== null && session.total_sessions !== undefined) {
    statsSessions.textContent = session.total_sessions;
  } else {
    statsSessions.textContent = 0;
  }

  if (session.total_focus_min !== null && session.total_focus_min !== undefined) {
    statsMinutes.textContent = session.total_focus_min;
  } else {
    statsMinutes.textContent = 0;
  }
};

const refreshStats = async () => {
  try {
    const session = await window.fetchStats();
    updateStats(session);
  } catch (e) {
    console.error("Could not fetch stats", e);
  }
};

const openStats = async () => {
  if (viewStatsBtn.disabled) return;
  viewStatsBtn.disabled = true;

  statsPanel.classList.add("show");
  viewStatsBtn.textContent = "Loading…";
  viewStatsBtn.style.backgroundColor = '#fff';
  viewStatsBtn.style.color = '#000';

  await refreshStats();
  
  try {
    await refreshStats();
    viewStatsBtn.textContent = "Close Stats";
  } finally {
    viewStatsBtn.disabled = false;
  }
};

const closeStats = () => {
  statsPanel.classList.remove("show");
  viewStatsBtn.textContent = "View Stats";
  viewStatsBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  viewStatsBtn.style.color = '#fff';
};

const toggleStats = () => {
  if (statsPanel.classList.contains("show")) {
    closeStats();
  } else {
    openStats();
  }
};

viewStatsBtn.addEventListener("click", toggleStats);
if (closeStatsBtn) closeStatsBtn.addEventListener("click", closeStats);
document.addEventListener("stats:refresh", refreshStats); 