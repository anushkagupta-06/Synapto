import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PasskeySetup from "./pages/Passkey";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import SubjectFileManager from "./pages/Sub-Files.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import Quiz from  "./pages/Quiz.jsx"




function App() {
  return (
    <Routes>
       <Route path="/quiz" element={<Quiz />} />
      <Route path="/summary" element={<SummaryPage />} />
    
      <Route path="/passkey" element={<PasskeySetup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
 <Route path="/subject-file-manager" element={<SubjectFileManager />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
           </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;