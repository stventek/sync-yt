import {Router} from 'express';
import { testGet } from '../controllers/test.controller';

const router = Router();

router.get('/user/update', testGet);
export default router;