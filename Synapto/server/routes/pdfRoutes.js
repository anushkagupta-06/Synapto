import express from 'express';
import  {Summary}  from '../controllers/Summary.js';
import multer from "multer";
import fs from 'fs';



const router = express.Router();
// const uploadDir = './summary';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
const upload = multer({ dest: "summary/" });




router.post("/summary", upload.single("file"), Summary);

export default router;


