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
  TIME_START_MUST_BE_LESS_THAN_TIME_END:
    "Time start must be less than time end",
  EMAIL_IS_EXISTING: "Email is existing",
  MIN_CANNOT_GREATER_THAN_MAX:
    "Min of quantity  must be greater than max of quantity",
  COMPETITION_CANNOT_UPDATE: "This competition cannot be updated",
  COMPEITION_ROUND_MUST_BE_GREATER:
    "The round update must be greater current row",
  OBJECT_CANNOT_ADD: (name) => `${name} is already added before`,
  OBJECT_CANNOT_DELETE_GIVEN_OTHER: (name1, name2) =>
    `${name1} cannot be deleted because ${name2} is already existing in it`,
  OBJECT_CANNOT_DELETE_ADD_OTHER: (name1, name2) =>
    `${name1} cannot be deleted because ${name1} is already existing in ${name2} `,
};

export default ErrorMessage;
