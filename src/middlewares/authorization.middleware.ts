import {Request, Response, NextFunction} from 'express';
import User from '../models/user.model';
import ApiError from '../utils/error-api';
import { verifyJwt } from '../utils/jwt';

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    if(!(authorizationHeader &&  authorizationHeader.split(' ')[1] )) return next(ApiError.unauthorized([{message: "session either expired or invalid"}]));
    const payload = verifyJwt(authorizationHeader.split(' ')[1])
    if(payload){
        const user = await User.findOne({where: {id: payload.sub}})
        req.user = user
        next()
    }
    else
        return next(ApiError.unauthorized([{message: "session either expired or invalid"}]));
}

export default authorization;