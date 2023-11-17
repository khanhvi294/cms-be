const ErrorMessage = {
  MISSING_PARAMETER: "Missing parameter",
  OBJECT_IS_EXISTING: (name) => `${name} is already exists`,
  OBJECT_IS_NOT_EXISTING: (name) => `${name} is not exists`,
  DATA_IS_INVALID: (name) => `${name} is invalid`,
  LOGIN_FAILED: "Email or password is incorrect",
};

export default ErrorMessage;
