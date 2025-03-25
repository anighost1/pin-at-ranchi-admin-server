import multer from "multer";

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File size is too large. Maximum size allowed is 2MB.' });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Invalid file type.' });
        }
        return res.status(400).json({ message: 'Something went wrong during file upload.' });
    } else if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
    next();
}

export default multerErrorHandler;