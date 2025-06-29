import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PasskeySetup from "./pages/Passkey";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import Summary from "./pages/Summary";

function App() {
  return (
    
      <Routes>
        <Route path="/summary" element={<Summary />} />
        <Route path="/passkey" element={<PasskeySetup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
      </Routes>
    
  );
}

export default App;