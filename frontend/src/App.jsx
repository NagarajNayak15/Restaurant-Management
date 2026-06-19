import React from "react";
import Home from "./pages/Home.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";
import {  Route, Routes } from 'react-router-dom'
import CheckOut from "./pages/CheckOut.jsx";

const App = () => {
  return (
    <RestaurantProvider>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<CheckOut/>} />
      </Routes>
      
    </RestaurantProvider>
  );
};

export default App;