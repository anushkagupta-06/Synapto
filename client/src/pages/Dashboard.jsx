import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <div className="text-center p-10 rounded-xl shadow-lg bg-[#111111] border-2 border-cyan-500">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4 drop-shadow-md">Welcome to Synapto 🚀</h1>
        <p className="text-gray-300 mb-6">You're successfully logged in.</p>

        <button
          onClick={() => navigate("/attendance")}
          className="mb-4 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          Go to Attendance
        </button>

        <br />
        <button
          onClick={() => navigate("/chat")}
          className="mb-4 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          Go to Chat
        </button>
        <br />
        <button
          onClick={() => navigate("/notes")}
          className="mb-4 bg-purple-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          Go to Notes
        </button>
        <br />
        <button
          onClick={() => navigate("/professors")}
          className="mb-4 bg-orange-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-black font-medium transition"
        >
          Proff List
        </button>
        <br />

        <button
          onClick={() => {
            localStorage.removeItem("synapto_token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;