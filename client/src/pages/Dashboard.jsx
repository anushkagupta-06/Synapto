import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="text-center p-10 rounded-xl shadow-lg bg-[#111111] border-2 border-cyan-500">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 drop-shadow-md">Welcome to Synapto 🚀</h1>
          <p className="text-gray-300">You're successfully logged in.</p>

          <button
        onClick={() => {
            localStorage.removeItem("synapto_token");
            navigate("/login");
        }}
        className="mt-6 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
        >
        Logout
        </button>

        </div>
      </div>
    );
  };
  
  export default Dashboard;
