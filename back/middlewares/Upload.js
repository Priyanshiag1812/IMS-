import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },

  filename: (req, file, callback) => {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1000000);
    const ext = path.extname(file.originalname);
    callback(null, `${timestamp}-${randomNum}${ext}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter
});

export default upload;