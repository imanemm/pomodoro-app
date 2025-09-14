const API_BASE = window.APP_CONFIG.API_BASE;

window.logSession = async ({ durationSec, kind}) => {
    const res = await fetch(`${API_BASE}/api/sessions`, {
        method: "POST",
        headers:  {"Content-Type": "application/json"},
        body: JSON.stringify({duration_sec: durationSec, kind}),
    });

    return res.json();
};

window.fetchStats = async () => {
    const res = await fetch(`${API_BASE}/api/stats`);
    return res.json();
}