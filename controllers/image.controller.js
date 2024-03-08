import Image from "../models/image.model.js";
import imageRetriever from "../service/imageRetriever.js";
import { fs } from "memfs";
import { gfs } from "../index.js";
import { Readable } from 'stream'
import generateUniqueFileName from "../service/randomNameGenerator.js";


export const getImagesByItemId = async (req, res) => {
    const itemId = req.params.id
    let imgArray = []
    try {
        const imgData = await Image.find({ itemId });
        await Promise.all(
            imgData.map(async (img) => {
                await imageRetriever(img, imgArray)
            })
        );
        fs.unlinkSync('/outputFile');
        // console.log(imgArray)
        res.json(imgArray)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Images'
        });
    }
}


export const addImage = async (req, res) => {
    const imageData = req.files
    // console.log(imageData)
    if (imageData.length < 1) {
        res.status(404).json({
            message: 'No Image found'
        });
        return
    }
    try {
        await Promise.all(
            imageData.map((item) => {
                const uploadStream = gfs.openUploadStream(generateUniqueFileName(item.originalname))
                const readStream = Readable.from(item.buffer)
                const result = readStream.pipe(uploadStream)
                uploadStream.once('finish', () => {
                    console.log(uploadStream.id)
                    delete item.buffer
                    console.log(item)
                    console.log(req.body)
                    new Image({
                        gridfsId: uploadStream.id,
                        ...item,
                        ...req.body
                    }).save()
                })
            })
        )
        res.status(200).json({
            message: 'Image(s) successfully uploaded',
        })
    } catch (e) {
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