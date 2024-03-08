import express from 'express'
import upload from '../config/imageUploadConfig.js'
import requireAuth from '../middleware/requireAuth.js'
import {
    addImage,
    getImagesByItemId
} from '../controllers/image.controller.js'


const router = express.Router()
router.use(requireAuth)


router.get('/by-item/all/:id', getImagesByItemId)
router.post('/', upload.array('itemImage'), addImage)


export default router