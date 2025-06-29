import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

dotenv.config();

export const Summary = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Use path.resolve to handle path correctly
    const filePath = path.resolve(req.file.path);
    console.log("File path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found on server." });
    }

    const buffer = fs.readFileSync(filePath);
    console.log("Buffer length:", buffer.length);
    

    // Add error handling for PDF parsing
    let data;
    try {
      data = await pdfParse(buffer);
      console.log("PDF parsed successfully");
    } catch (pdfError) {
      console.error("PDF Parse Error:", pdfError);
      return res.status(400).json({ error: "Failed to parse PDF file. Please ensure it's a valid PDF." });
    }

    const text = data.text?.slice(0, 1500) || "No readable text found.";
    console.log("Extracted text:", text);

    try {
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
    }),
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  // Check if response is OK before parsing JSON
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log("API Response:", result);

  const summary = result[0]?.summary_text || "No summary generated.";
  return res.status(200).json({ summary });
  
  
} catch (error) {
  console.error("Summary Error:", error.message);
  return res.status(500).json({ error: "Failed to generate summary" });
}
  } catch (error) {
    console.error("Summary Error:", error.message);
    return res.status(500).json({ error: "Error generating summary." });
  }
};
