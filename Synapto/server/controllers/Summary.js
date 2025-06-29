import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

export const Summary = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);
    const text = data.text?.slice(0, 1500) || "No readable text found.";

    const response = await fetch("https://api-inference.huggingface.co/models/t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `summarize: ${text}`,
      }),
    });

    const result = await response.json();
    const summary = result?.[0]?.summary_text || "No summary generated.";

    return res.json({ summary });
  } catch (error) {
    console.error("Summary Error:", error.message);
    return res.status(500).json({ error: "Error generating summary." });
  }
};
