package muteant.muteant.model.exception;

import muteant.muteant.model.dto.response.ResponseObject;

public class ValidationException extends BaseException {
    public ValidationException(String message) {
        super(message);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("VALIDATION_ERROR")
                .build();
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("VALIDATION_ERROR")
                .build();
    }
}
