const logs = [];

export function addLog(message, level = "info") {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  logs.push(entry);
}

export function getLogs() {
  return logs;
}
