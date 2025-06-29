import express from 'express';
import  {Summary}  from '../controllers/Summary.js';
import multer from "multer";
import fs from 'fs';
const router = express.Router();
// const uploadDir = './summary';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const upload = multer({ dest: "summary/" });
const storage = multer.diskStorage({
  destination: 'summary/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 10MB limit
  }
});
router.post("/summary", upload.single("file"), Summary);

export default router;


