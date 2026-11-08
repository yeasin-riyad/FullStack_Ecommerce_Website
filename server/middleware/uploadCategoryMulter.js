import multer from "multer";
import path from "path";

// File filter for image validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Only JPG, PNG, and JPEG files are allowed"), false);
  }
  cb(null, true);
};

// Use memoryStorage instead of diskStorage for serverless environments
const storage = multer.memoryStorage();

// Multer instances using Memory Storage
const categoryUpload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
});

const subCategoryUpload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
});

const productUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

export { categoryUpload, subCategoryUpload, productUpload };
