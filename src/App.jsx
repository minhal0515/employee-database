import React from "react";
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddEmployeePage from "./pages/add-employee";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<Home />}/>
        <Route path="/add-employee" element={<AddEmployeePage />} /> 
      </Routes>
    </Router>
  );
}
