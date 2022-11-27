import {NextFunction, Request, Response} from 'express';

export const testGet = async(req : Request, res: Response) => {
    return res.send({msg: "ok"});
}
