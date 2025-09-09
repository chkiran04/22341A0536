import React from "react";
import { useLogs } from "../context/LogContext";
import { Paper, Typography, Button } from "@mui/material";

export default function Logs() {
  const { logs, wipe } = useLogs();
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Application Logs</Typography>
      <Button variant="contained" color="error" onClick={wipe} sx={{ mt:1, mb:1 }}>Clear Logs</Button>
      <div style={{ maxHeight: "60vh", overflow: "auto" }}>
        {logs.slice().reverse().map(l => (
          <div key={l.id} style={{ padding:8, borderBottom:"1px solid #eee" }}>
            <div style={{ fontWeight:700 }}>{l.level.toUpperCase()} • {new Date(l.ts).toLocaleString()}</div>
            <div>{l.message}</div>
            {l.meta && <pre style={{ whiteSpace:"pre-wrap", fontSize:12 }}>{JSON.stringify(l.meta, null, 2)}</pre>}
          </div>
        ))}
        {!logs.length && <div>No logs yet.</div>}
      </div>
    </Paper>
  );
}
