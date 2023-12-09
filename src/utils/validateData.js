import HttpException from "../errors/httpException";
import ErrorMessage from "../common/errorMessage";
import { ROLES } from "./const";

export const validateData = async (func, data) => {
  const { error } = func(data);
  if (error) {
    console.log("validate:: ", error.details);
    const errorMessages = error.details.map((err) => ({
      message: err.message,
      key: err?.context?.key,
    }));
    // console.log('errorMessages ', errorMessages)
    // return res
    //   .status(422)
    //   .json({ status: 422, message: error.details[0].message });
    return error;
  }

  return false;
};

export const checkStartAndEnd =(from,to) => {
  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  if (dateFrom.getTime() > dateTo.getTime()) {
    throw new HttpException(422, 'Date start must be less than or equal to date end');
  }
}

export const formatInfoProfile = (data) => {
  const dataReturn = { ...data };

  Object.keys(data).forEach((key) => {
    dataReturn[key] = formatField(key, data[key]);
  });
  return dataReturn;
};

const formatField = (field, data) => {
  let result = data;
  switch (field) {
    case "fullName":
      result = data.trim();
      break;

    case "cccd":
      result = data.trim();
      break;

    case "phone":
      result = data.trim();

      break;

    case "address":
      result = data.trim();

      break;

    case "dateOfBirth":
      if (!is18OrOlder(result)) {
        throw new HttpException(
          400,
          ErrorMessage.CUSTOM("Age must be 18 or older")
        );
      }
      break;

    case "role":
      if (!Object.values(ROLES).includes(data)) {
        throw new HttpException(400, ErrorMessage.CUSTOM("Role is invalid"));
      }
      break;

    default:
      return data;
  }
  return result;
};

function is18OrOlder(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age >= 18;
}
