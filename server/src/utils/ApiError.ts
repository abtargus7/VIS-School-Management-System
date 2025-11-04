interface ApiErrorInterface {
    statusCode: number;
    data: null;
    success: boolean;
    errors: any[];
    stack?: string;
}

class ApiError extends Error implements ApiErrorInterface {
    public statusCode: number;
    public data: null;
    public success: boolean;
    public errors: any[];

    constructor(
        statusCode: number, 
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.errors = errors
        
        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}