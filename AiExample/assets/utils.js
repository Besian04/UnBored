// assets/utils.js
// Hilfsfunktionen für Unbored

export const VERSION = 1;

// -------- Local Storage Handling --------
export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("Konnte Daten nicht speichern:", e);
    }
}

export function load(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch (e) {
        return fallback;
    }
}

// -------- Mathe / Zufall --------
export function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// Gewichtete Zufallsauswahl
export function weightedRandom(items) {
    if (!items || items.length === 0) return null;

    const total = items.reduce((sum, x) => sum + (x.weight || 1), 0);
    if (total <= 0) return items[0]?.item || null;

    let r = Math.random() * total;
    for (const x of items) {
        if ((r -= x.weight || 1) <= 0) return x.item;
    }
    return items[items.length - 1].item;
}

// -------- Datei-Handling --------
export function download(filename, text) {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// -------- Sonstiges --------
export function kebab(str) {
    return String(str).toLowerCase().replace(/\s+/g, '-');
}

// Prüft, ob Aktivität ins Zeitfenster passt
export function withinDuration(activity, minutes) {
    if (!minutes || !activity.durationMin) return true;
    const tol = Math.floor(activity.durationMin * 0.1); // ±10 %
    return (
        activity.durationMin >= minutes - tol &&
        activity.durationMin <= minutes + tol
    );
}