import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Cookies from "js-cookie";

export default function App() {
  const [user, setUser] = useState(null);

  useState(()=>{
    setUser(Cookies.get('userInfo') !== undefined ? Cookies.get('userInfo') : null);
  },[user]);
  return (
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/dashboard/*" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
  );
}
