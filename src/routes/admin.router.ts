import {Router} from 'express';
import { admin } from '../controllers/admin.controller';
import authorization from '../middlewares/authorization.middleware';

const router = Router();

router.get('/admin', authorization, admin)

export default router;