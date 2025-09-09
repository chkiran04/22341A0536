import React from "react";
import { Paper, Typography, Grid, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function ResultsGrid({ items = [] }) {
  const origin = window.location.origin;
  if (!items.length) return null;
  return (
    <Paper sx={{ p:2, mb:3 }}>
      <Typography variant="h6">Created Short Links</Typography>
      <Grid container spacing={2} sx={{ mt:1 }}>
        {items.map(it => {
          const exp = new Date(new Date(it.createdAt).getTime() + it.ttlMinutes*60*1000);
          return (
            <Grid item xs={12} md={6} key={it.id}>
              <Paper sx={{ p:2 }}>
                <Typography variant="subtitle1">{origin}/{it.code}</Typography>
                <Typography variant="body2">Original: <Link href={it.longUrl} target="_blank" rel="noreferrer">{it.longUrl}</Link></Typography>
                <Typography variant="body2">Expires: {exp.toLocaleString()}</Typography>
                <Typography variant="body2">Clicks: {it.clicks}</Typography>
                <div style={{ marginTop:8, display:"flex", gap:8 }}>
                  <Button component={RouterLink} to={`/stats/${it.code}`} variant="outlined">Stats</Button>
                  <Button href={`/${it.code}`} variant="contained">Visit</Button>
                </div>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
