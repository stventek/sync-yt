import {Router} from 'express'
import { adminController, dashboardController } from '../controllers/admin.controller'
import authorizationMiddleware from '../middlewares/authorization.middleware'
import validateFields from '../utils/validator-helper'
import { dashboardValidator } from '../validators/dashboard.validator'

const router = Router()

router.get('/admin', authorizationMiddleware, adminController)
router.get('/admin/dashboard', authorizationMiddleware, dashboardValidator, validateFields, dashboardController)

export default router;