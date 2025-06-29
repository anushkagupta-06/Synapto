import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

const Googlecontext = createContext();
export const GoogleProvider = ({ children }) => {
  const [summary, setSummary] = useState("");

  const uploadPDF = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5050/api/pdf/summary", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSummary(res.data.summary);
  }, []);

  return (
    <Googlecontext.Provider
      value={{
        uploadPDF,
        summary,
      }}
    >
      {children}
    </Googlecontext.Provider>
  );
};

export const useGoogle = () => {
  return useContext(Googlecontext);
};
