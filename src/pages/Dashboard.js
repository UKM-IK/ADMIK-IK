import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MemberData from "../components/MemberData";

export default function Dashboard({ user }) {
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-[375px] h-screen"></div>
      <div className="p-4 w-full">
        <Routes>
          <Route path="/overview" element={<Home />} exact />
          <Route path="/recruitment" element={<MemberData />} />
        </Routes>
      </div>
    </div>
  );
}
