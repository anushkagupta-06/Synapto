import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PasskeySetup from "./pages/Passkey";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import ChatBot from "./pages/ChatBot";
import SubjectFileManager from "./pages/Sub-Files.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import Quiz from  "./pages/Quiz.jsx"
import WhatsAppAlertSender from "./pages/whatsappAlert.jsx"
import AIZonePage from "./pages/AIZonePage.jsx";
import MassBunkPage from "./pages/MassBunk.jsx";
import ImposterPage from "./pages/Imposter.jsx";
import Bunk from "./pages/Bunk.jsx"





function App() {
  return (
    <Routes>
       <Route path="/bunk" element={<Bunk/>} />
       <Route path="/imposter" element={<ImposterPage/>} />
       <Route path="/mass-bunk" element={<MassBunkPage/>} />
      <Route path="/AIZonePage" element={<AIZonePage/>} />
       <Route path="/quiz" element={<Quiz />} />
      <Route path="/summary" element={<SummaryPage />} />
      <Route path="/wtsp-alert" element={< WhatsAppAlertSender/>} />
      <Route path="/passkey" element={<PasskeySetup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
 <Route path="/subject-file-manager" element={<SubjectFileManager />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <HomePage/>
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
      <Route
        path="/chat"
        element={
        <PrivateRoute>
        <ChatBot />
        </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;