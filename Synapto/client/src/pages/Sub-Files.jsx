
import { useState } from "react";
import "./Sub-Files.css";

const initialSubjects = [
  {
    name: "Mathematics",
    files: ["Limits.pdf", "Integrals.docx", "Derivatives.png", "Vector.pdf"],
  },
  {
    name: "Physics",
    files: ["Kinematics.pdf", "Optics.pdf", "Quantum.docx"],
  },
  {
    name: "Chemistry",
    files: ["Organic.pdf", "Inorganic.pdf"],
  },
];

export default function SubjectFileManager() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newFileTitles, setNewFileTitles] = useState({});

  const handleGenerateSummary = (fileName) => {
    alert(`Generating summary for ${fileName}...`);
  };

  const handleGenerateQuiz = (fileName) => {
    alert(`Generating quiz for ${fileName}...`);
  };

  const handleAddFile = (subjectName) => {
    const newFileTitle = newFileTitles[subjectName] || "";
    if (!newFileTitle.endsWith(".pdf")) {
      alert("Only PDF files are supported.");
      return;
    }
    const updatedSubjects = subjects.map((subj) => {
      if (subj.name === subjectName) {
        return {
          ...subj,
          files: [...subj.files, newFileTitle],
        };
      }
      return subj;
    });
    setSubjects(updatedSubjects);
    if (selectedSubject?.name === subjectName) {
      setSelectedSubject({
        ...selectedSubject,
        files: [...selectedSubject.files, newFileTitle],
      });
    }
    setNewFileTitles({ ...newFileTitles, [subjectName]: "" });
  };

  return (
    <div className="container full-screen">
      {/* Left Sidebar */}
      <div className="sidebar">
        {subjects.map((subject) => (
          <div key={subject.name} className="subject-card">
            <div
              className="subject-name"
              onClick={() => setSelectedSubject(subject)}
            >
              {subject.name}
            </div>
            <div className="file-count">{subject.files.length} files uploaded</div>
            <div className="add-file-form">
              <input
                type="text"
                placeholder="Enter title (e.g. Notes.pdf)"
                value={newFileTitles[subject.name] || ""}
                onChange={(e) =>
                  setNewFileTitles({
                    ...newFileTitles,
                    [subject.name]: e.target.value,
                  })
                }
                className="file-input"
              />
              <button
                onClick={() => handleAddFile(subject.name)}
                className="action-button"
              >
                Add File
              </button>
            </div>
            <button
              className="view-button"
              onClick={() => setSelectedSubject(subject)}
            >
              View Files
            </button>
          </div>
        ))}
      </div>

      {/* Right Display Area */}
      <div className="display-area">
        {selectedSubject ? (
          <div className="subject-detail">
            <h2>{selectedSubject.name} Files</h2>
            <div className="file-list vertical-list">
              {selectedSubject.files.map((file, index) => (
                <div key={index} className="file-card organized large">
                  <div className="file-name">📄 {file.replace(/\.pdf$/, "")}</div>
                  <div className="file-actions">
                    <button
                      className="action-button"
                      onClick={() => handleGenerateSummary(file)}
                    >
                      Summary
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleGenerateQuiz(file)}
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="placeholder">Select a subject to view files</p>
        )}
      </div>
    </div>
  );
}
