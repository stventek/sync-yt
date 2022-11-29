import jwt from 'jsonwebtoken';

export const IssueJwt = (payload: any) => {
    //expires in 1 day,  1000 * 60 * 60 * 24 = 86400000
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '86400000ms' });
}

export const verifyJwt = (token: string ) => {
    try{
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');;
    }
    catch(err){
        return false;
    }
};