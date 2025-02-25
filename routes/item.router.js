import express from 'express'
import {
    addItem,
    getItemById,
    getItems,
    updateItem,
    updateItemStatus,
} from '../controllers/item.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/', getItems)
router.get('/:id', getItemById)
router.post('/', addItem)
router.put('/', updateItem)
router.put('/status', updateItemStatus)


export default router