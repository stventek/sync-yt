import jwt from 'jsonwebtoken';

export const IssueJwt = (payload: any) => {
    //expires in 15min
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '900000ms' });
}

export const verifyJwt = (token: string ) => {
    try{
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');;
    }
    catch(err){
        return false;
    }
};