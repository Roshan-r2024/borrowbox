import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

        {/* FIRST PAGE */}
        <Route
          path="/"
          element={<Navigate to="/get-started" replace />}
        />

        {/* GET STARTED */}
        <Route
          path="/get-started"
          element={<GetStarted />}
        />

        {/* AUTHENTICATION */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        {/* HOME */}
        <Route
          path="/home"
          element={<Home />}
        />

        {/* BROWSE ITEMS */}
        <Route
          path="/browse"
          element={<Browse />}
        />

        {/* LIST AN ITEM */}
        <Route
          path="/list-item"
          element={<ListItem />}
        />

        {/* ITEM DETAILS */}
       <Route
  path="/item-details/:id"
  element={<ItemDetails />}
/>

        <Route
          path="/my-items"
          element={<MyItems />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* BORROW REQUEST */}
        <Route
          path="/borrow-request"
          element={<BorrowRequest />}
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/get-started" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;