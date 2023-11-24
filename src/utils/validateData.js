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
      break;

    default:
      return data;
  }
  return result;
};
