import express from 'express';
import { Summary } from '../controllers/Summary.js';
import { uploadFile } from '../controllers/fileController.js';
import  {getFiles} from '../controllers/fileController.js';
import  {generateQuiz} from '../controllers/Quiz.js'; 
import multer from "multer";


const router = express.Router();

// Common multer configuration
const createUpload = () => multer({
  storage: multer.memoryStorage(), // Store in memory instead of disk
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

const upload = createUpload();
const upload2 = createUpload();


router.post("/quiz", generateQuiz);
router.post("/summary", Summary);
router.post("/upload", upload2.single("file"), uploadFile);
router.get("/files", getFiles);

export default router;