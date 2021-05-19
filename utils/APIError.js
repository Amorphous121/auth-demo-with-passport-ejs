/**
 * @extends Error class To create Customized errors
 */

class ExtendableErrors extends Error {
    constructor({ message, errors, status, isPublic, stack }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.status = status;
        this.isPublic = isPublic;
        this.stack = stack;
    }
}


class APIError extends ExtendableErrors {
    constructor({ message, errors, stack, status = 500, isPublic = true}) {
        super({ message, errors, status, isPublic, stack })
    }
}

module.exports = APIError;