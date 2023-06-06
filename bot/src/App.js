import "./App.css";
import React from "react";
import Bot from "./Components/Bot";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/bot/:key" element={<Bot />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
