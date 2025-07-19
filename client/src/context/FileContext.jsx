// client/src/context/FileContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const uploadFile = async ({ file, title, subject }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subject", subject);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/pdf/upload`, formData);
      alert("File uploaded!");
      return res.data;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const fetchFilesBySubject = async (subject) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pdf/files?subject=${subject}`);
      setFiles(res.data);
    } catch (err) {
      console.error("Fetch files error:", err);
    }
  };
 

  return (
    <FileContext.Provider value={{ uploadFile, fetchFilesBySubject, files }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext);
