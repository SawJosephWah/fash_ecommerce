import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = './public/temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 1. Limit: 2MB (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // 2. Validation: Check the MIME type
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isMimeValid = allowedTypes.test(file.mimetype);
    const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeValid && isExtValid) {
      return cb(null, true);
    }
    
    // 3. Reject if not an image
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!') as any, false);
  }
});