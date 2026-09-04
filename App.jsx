import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ListItem from "./pages/ListItem";
import ItemDetails from "./pages/ItemDetails";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import BorrowRequest from "./pages/BorrowRequest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/get-started" replace />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/list-item" element={<ListItem />} />
        <Route path="/item-details/:id" element={<ItemDetails />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/borrow-request" element={<BorrowRequest />} />
        <Route path="*" element={<Navigate to="/get-started" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
