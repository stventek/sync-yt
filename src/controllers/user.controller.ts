import { NextFunction, Request, Response } from "express"
import User from '../models/user.model'
import ApiError from "../utils/error-api"
import {validatePassword} from '../models/user.model'
import { IssueJwt } from "../utils/jwt"

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body
    var user : any
    if(email)
        user = await User.findOne({where: {email}})
    if(!user)
        return next(ApiError.badRequest([{message:'no such email', field: 'email'}]))
    if(validatePassword(password, user.password)){
        req.user = user;
        return res.json({accessToken: IssueJwt({"sub": user.id}), exp: Date.now() + 900000})
    }
    return next(ApiError.badRequest([{message: 'invalid password', field: 'password'}]))
};