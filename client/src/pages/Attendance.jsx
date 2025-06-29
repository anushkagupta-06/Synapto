import { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "Electromagnetic Theory (ECN13101)", total: 0, present: 0 },
    { name: "Signals and Systems (ECN13102)", total: 0, present: 0 },
    { name: "Data Structures and Operating Systems (CSN13404)", total: 0, present: 0 },
    { name: "Networks and Systems (EEN13401)", total: 0, present: 0 },
    { name: "Microprocessor and Its Applications (ECN13103)", total: 0, present: 0 },
    { name: "Solid State Devices and Circuits (ECN13104)", total: 0, present: 0 },
    { name: "Business Economics (HSN13602)", total: 0, present: 0 },
    { name: "Extra Academic Activity-B-II (EAN13700)", total: 0, present: 0 },
  ]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("synapto_token");
        const res = await axios.get("http://localhost:5050/api/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedSubjects = subjects.map((subject) => {
          const records = res.data.filter((r) => r.subject === subject.name);
          const total = records.length;
          const present = records.filter((r) => r.status === "present").length;
          return { ...subject, total, present };
        });

        setSubjects(updatedSubjects);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };
    fetchAttendance();
  }, []);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const markAttendance = async (index, isPresent) => {
    const date = selectedDate;
    const subject = subjects[index].name;
    const status = isPresent ? "present" : "absent";

    try {
      const token = localStorage.getItem("synapto_token");
      await axios.post(
        "http://localhost:5050/api/attendance",
        { subject, date, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubjects((prev) =>
        prev.map((subj, i) =>
          i === index
            ? {
                ...subj,
                total: subj.total + 1,
                present: isPresent ? subj.present + 1 : subj.present,
              }
            : subj
        )
      );
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-10 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-yellow-600">
        🎓 Attendance Tracker
      </h2>

      <div className="flex justify-center mb-8">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const percentage =
            subject.total > 0
              ? Math.round((subject.present / subject.total) * 100)
              : 0;

          return (
            <div
              key={index}
              className="bg-[#1a1a1a]/80 backdrop-blur border border-[#1f1f1f] rounded-xl p-5 shadow-md transition-transform hover:scale-105 hover:shadow-cyan-500/30"
            >
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-300 mb-1">
                Total Classes: {subject.total}
              </p>
              <p className="text-sm text-gray-300 mb-1">
                Present Days: {subject.present}
              </p>
              <p className="text-sm mb-4 text-gray-300">
                Attendance:{" "}
                <span className="text-lime-400 font-bold">{percentage}%</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => markAttendance(index, true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 text-sm rounded-md font-medium shadow-md"
                >
                  Mark Present
                </button>
                <button
                  onClick={() => markAttendance(index, false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-sm rounded-md font-medium shadow-md"
                >
                  Mark Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
