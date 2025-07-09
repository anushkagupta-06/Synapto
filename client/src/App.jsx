import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PasskeySetup from "./pages/Passkey";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import ChatBot from "./pages/ChatBot";
import SubjectFileManager from "./pages/Sub-Files.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import Quiz from  "./pages/Quiz.jsx"
import ChatPage from "./pages/ChatPage";
import Notes from './pages/Notes';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/passkey" element={<PasskeySetup />} />
        <Route path="/subject-file-manager" element={<SubjectFileManager />} />
        <Route path="/notes" element={<Notes />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;