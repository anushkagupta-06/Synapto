import React from "react";
import "./Summary.css";
import { useGoogle} from "../context/googleapi.jsx";

const Summary = () => {
  const { summary, uploadPDF } = useGoogle();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      uploadPDF(file);
    }
  };


  
  return (
    <div className="summary-container">
      <h2>PDF Summary Generator</h2>
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <div className="summary-box">
        {summary ? <p>{summary}</p> : <p>Upload a PDF to get its summary</p>}
      </div>
    </div>
  );
};

export default Summary;
