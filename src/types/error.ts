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