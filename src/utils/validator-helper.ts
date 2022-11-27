import { NextFunction, Request, Response } from 'express';
import {validationResult, ValidationError} from 'express-validator';
import { IError } from '../types/error';
import ApiError from '../utils/error-api';

const formartErrors = (errors: ValidationError[]) => {
    const errorsFormated : IError[] = errors.map((error) => {
        return {message: error.msg, field: error.param};
    })
    return errorsFormated;
};

const validateFields = (req : Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(errors.isEmpty())
        next();
    else{
        next(ApiError.badRequest(formartErrors(errors.array())));
    }
};

export default validateFields;