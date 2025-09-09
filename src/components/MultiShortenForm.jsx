import React, { useState } from "react";
import { Grid, TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
export default function MultiShortenForm({ onSubmit }) {  
  const emptyRow = { longUrl: "", ttlMinutes: "", customCode: "" };
  const [rows, setRows] = useState([ {...emptyRow} ]);
  const [snack, setSnack] = useState({ open:false, severity:"info", message:"" });

  function updateRow(idx, key, value) {
    const copy = rows.slice();
    copy[idx] = { ...copy[idx], [key]: value };
    setRows(copy);
  }
  function addRow() {
    if (rows.length >= 5) {
      setSnack({ open:true, severity:"warning", message:"Max 5 URLs allowed" }); return;
    }
    setRows([...rows, {...emptyRow}]);
  }
  function removeRow(idx) {
    const copy = rows.slice(); copy.splice(idx,1); setRows(copy);
  }
  async function submit() {
    try {
      const entries = rows.map(r => ({
        longUrl: r.longUrl.trim(),
        ttlMinutes: r.ttlMinutes === "" ? undefined : parseInt(r.ttlMinutes, 10),
        customCode: r.customCode.trim()
      }));
      const res = await onSubmit(entries);
      if (res.errors && res.errors.length) {
        setSnack({ open:true, severity:"error", message:`Created ${res.success.length} / ${rows.length}. Errors: ${res.errors.map(e=>`#${e.index}:${e.error}`).join("; ")}` });
      } else {
        setSnack({ open:true, severity:"success", message:`Created ${res.success.length} short URLs` });        
        setRows([ {...emptyRow} ]);
      }
    } catch (err) {
      setSnack({ open:true, severity:"error", message: String(err?.message || err) });
    }
  }

  return (
    <Paper sx={{ p:2, mb:3 }}>
      <Typography variant="h6" gutterBottom>Shorten up to 5 URLs</Typography>
      <Grid container spacing={2}>
        {rows.map((r, idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} md={6}>
              <TextField label="Long URL" value={r.longUrl} onChange={e=>updateRow(idx,"longUrl",e.target.value)} fullWidth required helperText="e.g. https://example.com/page" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField label="Validity (minutes)" value={r.ttlMinutes} onChange={e=>updateRow(idx,"ttlMinutes",e.target.value)} fullWidth helperText="Leave empty for default 30" inputProps={{ inputMode:"numeric" }} />
            </Grid>
            <Grid item xs={6} md={3} sx={{ display:"flex", gap:1, alignItems:"center" }}>
              <TextField label="Custom shortcode" value={r.customCode} onChange={e=>updateRow(idx,"customCode",e.target.value)} fullWidth helperText="optional, alphanumeric 4-32" />
              {rows.length > 1 && <Button color="error" variant="outlined" onClick={()=>removeRow(idx)}>Remove</Button>}
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12} sx={{ display:"flex", gap:1 }}>
          <Button variant="contained" onClick={addRow} disabled={rows.length>=5}>Add Row</Button>
          <Button variant="contained" color="primary" onClick={submit}>Shorten All</Button>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={()=>setSnack({...snack, open:false})}>
        <Alert onClose={()=>setSnack({...snack, open:false})} severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Paper>
  );
}
