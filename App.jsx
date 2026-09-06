import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GetStarted from "./GetStarted";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import Browse from "./Browse";
import ListItem from "./ListItem";
import ItemDetails from "./ItemDetails";
import MyItems from "./MyItems";
import Profile from "./Profile";
import BorrowRequest from "./BorrowRequest";

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
