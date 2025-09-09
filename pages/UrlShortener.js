import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { addLog } from "../utils/logStore";

function UrlShortener() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
      addLog("Added new URL input row", "info");
    }
  };

  const handleSubmit = () => {
    for (let url of urls) {
      try {
        new URL(url.longUrl); // validate URL
      } catch {
        alert("Invalid URL format");
        addLog("Validation failed: Invalid URL", "error");
        return;
      }
      if (url.validity && isNaN(parseInt(url.validity))) {
        alert("Validity must be an integer (minutes).");
        addLog("Validation failed: Invalid validity input", "error");
        return;
      }
    }

    // Mock API response
    const response = urls.map((url, idx) => ({
      longUrl: url.longUrl,
      shortUrl: `http://localhost:3000/${url.shortcode || "short" + (idx + 1)}`,
      expiry: new Date(Date.now() + (url.validity ? url.validity : 30) * 60000).toLocaleString(),
    }));

    setResults(response);
    addLog("URLs successfully shortened", "success");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((url, idx) => (
        <Card key={idx} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={url.longUrl}
                  onChange={(e) => handleChange(idx, "longUrl", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  value={url.validity}
                  onChange={(e) => handleChange(idx, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Custom Shortcode"
                  value={url.shortcode}
                  onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {urls.length < 5 && (
        <Button variant="outlined" onClick={handleAddUrl} sx={{ mr: 2 }}>
          + Add URL
        </Button>
      )}

      <Button variant="contained" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      <div style={{ marginTop: "2rem" }}>
        {results.map((res, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>Original: {res.longUrl}</Typography>
              <Typography>
                Shortened:{" "}
                <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">
                  {res.shortUrl}
                </a>
              </Typography>
              <Typography>Expiry: {res.expiry}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default UrlShortener;
