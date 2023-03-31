export class ResponseError extends Error {
    public statusCode: number;

    constructor(statusCode: number, error = '') {
        super(error);
        this.statusCode = statusCode;
    }
}

export class ValidationError extends ResponseError {
    constructor(error: string) {
        super(400, error);
    }
}

export class AuthValidationError extends ResponseError {
    constructor(error: string) {
        super(403, error);
    }
}

export class ServerError extends ResponseError {
    constructor(error: string) {
        super(500, error);
    }
}
