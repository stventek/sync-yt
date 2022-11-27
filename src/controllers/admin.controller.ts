import { Request, Response } from "express";

export const admin = async (req: Request, res: Response) => {
    return res.json({msg: `Welcome back ${req.user.name}`})
};