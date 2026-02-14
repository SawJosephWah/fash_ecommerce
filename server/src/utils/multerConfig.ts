import multer from 'multer';
import path from 'path';

// 1. Define Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products'); // Ensure this folder exists!
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. File Filter (Optional but recommended)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        const error: any = new Error('Not an image! Please upload only images.');
        error.statusCode = 400; // Attach the 400 status code here
        cb(error, false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});