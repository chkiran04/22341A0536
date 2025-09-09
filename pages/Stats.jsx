import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { getLogs, addLog } from "../utils/logStore";

function Stats() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const allLogs = getLogs(); 
    setLogs(allLogs);
    addLog("Stats page loaded", "info");
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      {logs.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {logs.map((log, idx) => (
            <Grid item xs={12} key={idx}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">
                    Timestamp: {log.timestamp}
                  </Typography>
                  <Typography>Level: {log.level}</Typography>
                  <Typography>Message: {log.message}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Stats;
