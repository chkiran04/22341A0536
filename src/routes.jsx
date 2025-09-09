import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Redirector from "./pages/Redirector";
import Logs from "./pages/Logs";

export default function RoutesView() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stats/:code" element={<Stats />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/:code" element={<Redirector />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}
