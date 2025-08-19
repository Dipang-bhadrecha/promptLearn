
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./styles/sidebar.css";

export default function App() {
  return (
    <div className="app-root">
      <Sidebar />
    </div>
  );
}

