import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import UrlShortener from "./utils/UrlShortener";

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UrlShortener />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
