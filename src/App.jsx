import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import SkillInput from "./pages/SkillInput";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  const [role, setRole] = useState("");

  return (
    <BrowserRouter>

      {localStorage.getItem("token") && <Navbar />}

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/roles" element={
          <ProtectedRoute>
            <RoleSelect
              role={role}
              setRole={setRole} />
          </ProtectedRoute>} />

        <Route path="/skills" element={
          <ProtectedRoute>
            <SkillInput role={role} />
          </ProtectedRoute>} />

        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App