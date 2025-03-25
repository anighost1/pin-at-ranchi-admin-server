import { imageUploader } from "../lib/imageUploader.js";
import Item from "../models/item.model.js";

export const addImage = async (req, res) => {
    const imageData = req.files
    const id = req.body.itemId
    // console.log(imageData)
    if (imageData.length < 1) {
        res.status(404).json({
            message: 'No Image found'
        });
        return
    }
    try {
        const docPaths = await imageUploader(imageData)
        const item = await Item.findById(id);
        item.image.push(...docPaths);
        await item.save();
        res.status(200).json({
            message: 'Image(s) successfully uploaded',
        })
    } catch (e) {
        if (e instanceof multer.MulterError) {
            let message;
            switch (e.code) {
                case 'LIMIT_FILE_SIZE':
                    message = 'File size exceeds the allowed limit (2MB).';
                    break;
                case 'LIMIT_UNEXPECTED_FILE':
                    message = 'Unexpected file type.';
                    break;
                default:
                    message = 'File upload error.';
                    break;
            }
            return res.status(400).json({
                success: false,
                message,
            });
        }
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: 'Image upload unsuccessful'
            });
        }
    }
}