import {Router} from 'express'
import {signIn} from '../controllers/user.controller'

const router = Router()

router.post('/user/signin', signIn)

export default router;