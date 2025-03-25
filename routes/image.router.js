import express from 'express'
import upload from '../config/imageUploadConfig.js'
import requireAuth from '../middleware/requireAuth.js'
import {
    addImage,
} from '../controllers/image.controller.js'
import multerErrorHandler from '../lib/multerErrorHandler.js'


const router = express.Router()
router.use(requireAuth)

router.post('/', upload.array('itemImage'), multerErrorHandler, addImage)

router.use(multerErrorHandler);

export default router