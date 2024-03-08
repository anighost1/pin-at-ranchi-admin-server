import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
import {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    updateCategoryStatus
} from '../controllers/category.controller.js'

const router = express.Router()
router.use(requireAuth)


router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', addCategory)
router.put('/', updateCategory)
router.put('/status', updateCategoryStatus)


export default router