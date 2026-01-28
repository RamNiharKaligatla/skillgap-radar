import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import SkillInput from "./pages/SkillInput";
import History from "./pages/History";

function App() {
  const [role, setRole] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/roles" element={<RoleSelect role={role} setRole={setRole} />} />
        <Route path="/skills" element={<SkillInput role={role} />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App