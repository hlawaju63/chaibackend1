class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statuscode; // Corrected assignment
        this.data = null;
        this.message = message;
        this.success = false; // Corrected assignment
        this.errors = errors;

        if (stack) {
            this.stack = stack; // Corrected spelling
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
