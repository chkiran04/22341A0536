import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { urlService } from "../services/urlService";
import { Paper, Typography, Button } from "@mui/material";
import { logger } from "../logger/logger";

export default function Redirector() {
  const { code } = useParams();
  const [state, setState] = useState({ loading:true, error:"" });

  useEffect(() => {
    (async () => {
      try {
        const item = await urlService.getByCode(code);
        if (!item) {
          setState({ loading:false, error:"Shortcode not found" });
          logger.warn("redirect:not_found", { code });
          return;
        }
        if (item.expired) {
          setState({ loading:false, error:"This short link has expired" });
          logger.warn("redirect:expired", { code });
          return;
        }
        await urlService.incrementClick(code);
        logger.info("redirect:success", { code, to: item.longUrl });
        window.location.assign(item.longUrl);
      } catch (err) {
        setState({ loading:false, error:"Unexpected error" });
        logger.error("redirect:error", { code, err: String(err?.message || err) });
      }
    })();
  }, [code]);

  if (state.loading) return <Paper sx={{ p:2 }}>Redirecting…</Paper>;
  return (
    <Paper sx={{ p:2 }}>
      <Typography color="error">{state.error}</Typography>
      <Button component={RouterLink} to="/">Home</Button>
    </Paper>
  );
}
