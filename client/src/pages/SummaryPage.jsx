
import { useGoogle } from "../context/googleapi.jsx";

import "./SummaryPage.css";

export default function SummaryPage() {
    const {summary,summaryLoading,summaryTitle} = useGoogle();
    const fileTitle = "Sample PDF"; // Replace with actual file title or state
  return (
    <div className="summary-wrapper">
      <div className="summary-header">
        <h2>📄 {summaryTitle} Summary</h2>
        <button className="back-btn">⬅ Back</button>
      </div>
      <div className="summary-content">
        {summaryLoading ? (
          <div className="loader">Generating Summary...</div>
        ) : (
          <p>{summary}</p>
        )}
      </div>
    </div>
  );
}
