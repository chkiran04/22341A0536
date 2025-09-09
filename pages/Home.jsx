import React, { useEffect, useState } from "react";
import MultiShortenForm from "../components/MultiShortenForm";
import ResultsGrid from "../components/ResultsGrid";
import { urlService } from "../services/urlService";
import { Typography } from "@mui/material";

export default function Home() {
  const [results, setResults] = useState([]);
  const [all, setAll] = useState([]);

  async function loadAll() {
    const l = await urlService.listAll();
    setAll(l);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleSubmit(entries) {
    const resp = await urlService.createBatch(entries);
    await loadAll();
    setResults(resp.success);
    return resp;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>URL Shortener(Frontend)</Typography>
      <MultiShortenForm onSubmit={handleSubmit} />
      <ResultsGrid items={results} />
      <Typography variant="h6" sx={{ mt:2 }}>Recent URLs</Typography>
      <div style={{ marginTop:8 }}>
        {all.map(it => (
          <div key={it.id} style={{ marginBottom:8 }}>
            <div style={{ fontWeight:600 }}>{window.location.origin}/{it.code} {it.expired ? "(expired)" : ""}</div>
            <div style={{ fontSize:13 }}>{it.longUrl} • clicks: {it.clicks}</div>
          </div>
        ))}
        {!all.length && <div>No URLs yet, Please add or select it.</div>}
      </div>
    </>
  );
}
