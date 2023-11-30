const ErrorMessage = {
  MISSING_PARAMETER: "Missing parameter",
  OBJECT_IS_EXISTING: (name) => `${name} is already exists`,
  OBJECT_IS_NOT_EXISTING: (name) => `${name} is not exists`,
  OBJECT_NOT_FOUND: (name) => `${name} is not found`,
  DATA_IS_INVALID: (name) => `${name} is invalid`,
  LOGIN_FAILED: "Email or password is incorrect",
  INTERNAL_ERROR: "Internal error",
  CUSTOM: (message) => `${message}`,
  HAS_NO_DATA: "Has no data",
  COMPETITION_CANNOT_ADD_ROUND:
    "Competition ended or canceled  cannot be added round",
    COMPETITION_CANNOT_UPDATE_ROUND:
    "Competition ended or canceled  cannot be updated round",
};

export default ErrorMessage;
