import express from 'express'
import {
    getAdmin,
    getAdminById,
} from '../controllers/admin.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()
router.use(requireAuth)


router.get('/', getAdmin)
router.get('/:id', getAdminById)


export default router