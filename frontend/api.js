const API_BASE = window.APP_CONFIG.API_BASE;

export const logSession = async ({ durationSec, kind}) => {
    const res = await fetch(`${API_BASE}/api/sessions`, {
        method: "POST",
        headers:  {"Content-Type": "application/json"},
        body: JSON.stringify({duraration_sec: durationSec, kind}),
    });

    return res.json();
};

export const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/api/stats`);

    return res.json();
}