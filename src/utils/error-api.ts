interface IError{
    message: string,
    field?: string
}

interface IErrorResponse{
    code: number,
    errors: IError[]
    fieldErrors: IError[]
}

export {IError, IErrorResponse};


class ApiError implements IErrorResponse{
    code: number;
    errors: IError[];
    fieldErrors: IError[]

    constructor(code: number, errors: Array<IError>){
        this.code = code;
        this.errors = errors.filter(err => !(err.field));
        this.fieldErrors = errors.filter(err => err.field);
    }

    static internal(errors: Array<IError>) : IErrorResponse {
        return new ApiError(500, errors);
    }

    static unauthorized(errors: Array<IError>) : IErrorResponse {
        return new ApiError(401, errors);
    }

    static notFound(errors: Array<IError>) : IErrorResponse {
        return new ApiError(404, errors);
    }

    static badRequest(errors: Array<IError>) : IErrorResponse {
        return new ApiError(400, errors);
    }

    static conflict(errors: Array<IError>) : IErrorResponse {
        return new ApiError(409, errors);
    }
}

export default ApiError;