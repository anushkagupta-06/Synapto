import File from "../models/File.js";
import cloudinary from "../utils/cloudinary.js";
import extractText from "../utils/extractText.js";

export const uploadFile = async (req, res) => {
  try {
    const { title, subject } = req.body;

     try {
      const pingResult = await cloudinary.api.ping();
      console.log("Cloudinary ping successful:", pingResult);
    } catch (pingError) {
      console.error("Cloudinary ping failed:", pingError);
    }

    console.log("File received:", req.file.originalname, "Size:", req.file.size);

    // Upload buffer to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "study_files",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", uploaded.secure_url);

    // Extract text
    const text = await extractText(req.file);

    // Save to DB
    const saved = await File.create({
      fileName: req.file.originalname,
      title,
      subject,
      fileUrl: uploaded.secure_url,
      textContent: text,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      message: "File upload failed.", 
      error: err.message 
    });
  }
};


export const getFiles = async (req, res) => {
  const files = await File.find({ subject: req.query.subject });
  res.json(files);
};