import multer from "multer";
import fs from "fs";
import path from "path";
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/"); // Specify your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "resumes/"); // Specify your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed!"), false);
  }

  cb(null, true);
};

const fileFilterPdf = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF files are allowed!"), false);
  }

  cb(null, true);
};

// Initialize multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export const uploadFile = multer({
  storage: storageFile,
  fileFilter: fileFilterPdf,
});

export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  });
};

export const multiUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only images and PDFs are allowed!");
    }
  },
});
