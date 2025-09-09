const LOG_KEY = "__logs__";
export function readLogs() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function writeLogs(logs) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}
export function appendLog(entry) {
  const logs = readLogs();
  logs.push(entry);
  writeLogs(logs);
}
export function clearLogs() {
  writeLogs([]);
}
