import multer from "multer";
import fs from "fs";
import path from "path";

// Function to ensure a directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create separate upload directories
const categoryPath =  "../uploads/category/";
const subCategoryPath ="../uploads/subcategory/";
const productPath ="../uploads/product/";

ensureDirectoryExists(categoryPath);
ensureDirectoryExists(subCategoryPath);
ensureDirectoryExists(productPath);

// Common storage function
const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDirectoryExists(destination);
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

// File filter for image validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Only JPG, PNG, and JPEG files are allowed"), false);
  }
  cb(null, true);
};

// Multer instances for each type
const categoryUpload = multer({
  storage: createStorage(categoryPath),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
});

const subCategoryUpload = multer({
  storage: createStorage(subCategoryPath),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
});

const productUpload = multer({
  storage: createStorage(productPath),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for product images
  fileFilter,
});

export { categoryUpload, subCategoryUpload, productUpload };
