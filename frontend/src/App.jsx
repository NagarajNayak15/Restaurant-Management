import React from "react";
import Home from "./pages/Home.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";
import {  Route, Routes } from 'react-router-dom'
import CheckOut from "./pages/CheckOut.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  return (
    <RestaurantProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:token" element={<Login />} />
        <Route path="/checkout" element={<CheckOut/>} />
      </Routes>
      
    </RestaurantProvider>
  );
};

export default App;