import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|csv|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        // cb(new Error('Error: Only images (JPEG, JPG, PNG, GIF) and documents(PDF, CSV, xlsx) are allowed!'));
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

// const upload = multer({ storage: storage });

export default upload