import React, { createContext, useContext, useEffect, useState } from "react";
import { readLogs, clearLogs } from "../logger/logStore";
import { logger } from "../logger/logger";

const LogCtx = createContext(null);

export function LogProvider({ children }) {
  const [logs, setLogs] = useState(readLogs());

  useEffect(() => {
    const t = setInterval(() => setLogs(readLogs()), 800);
    logger.info("app:mounted");
    return () => clearInterval(t);
  }, []);

  const wipe = () => {
    clearLogs();
    setLogs([]);
    logger.warn("logs:cleared");
  };

  return <LogCtx.Provider value={{ logs, wipe }}>{children}</LogCtx.Provider>;
}

export function useLogs() { return useContext(LogCtx); }
