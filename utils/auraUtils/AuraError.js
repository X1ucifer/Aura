const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
}

class BaseError extends Error
{
    constructor(name, description, statusCode, isOperational)
    {
        super(description, name);
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.message = description;
        Error.captureStackTrace(this)
    }
}

class ResponseError extends Error
{
    constructor(name, description, statusCode, isOperational)
    {
        super(description);
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
    }
}


class ApiError extends BaseError {

    constructor(name, description = 'Some Internal Error Kindly contact support', statusCode = httpStatusCodes.NOT_FOUND, isOperational = true)
    {
        super(name, description, statusCode, isOperational);
    }
}

class AuraException extends ResponseError{
 
    constructor(res, errorMessage, statusCode = httpStatusCodes.NOT_FOUND, error = 'Not found.', description="Not found.", name="Error", isOperational = false)
    {
        console.log(errorMessage);
        super("name", "description", 400, true);
        res.status(statusCode).json({status: name, errors: error});
    }

}

module.exports = {
    AuraException,
    ApiError,
    httpStatusCodes
};