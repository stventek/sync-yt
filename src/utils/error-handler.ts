import ApiError from './error-api';
import {Request, Response, NextFunction} from 'express';

function apiErrorHandler(errors : any, req : Request, res : Response, next: NextFunction) {
  if (errors instanceof ApiError) {
    return res.status(errors.code).json(errors);
  }
  //handles unexpected errors
  return res.status(500).json({code: 500, errors: [{message: 'something went wrong'}]});
}

export default apiErrorHandler;