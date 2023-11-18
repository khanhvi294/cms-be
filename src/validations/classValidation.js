import Joi from "joi";

const classValidate = {
  create: (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(50).messages({
        "any.required": "Name is required",
        "string.empty": "Name is required",
        "string.min": "Name min is 3 characters",
        "string.max": "Name max is 50 characters",
      }),
      timeStart: Joi.string().required().isoDate().messages({
        "any.required": "Password is required",
        "string.empty": "Password is required",
        "string.isoDate": "timeStart is invalid",
      }),
      courseId: Joi.number().integer().min(1).required().messages({
        "any.required": "courseId is required",
        "number.integer": "courseId must be integer",
        "number.min": "courseId must be greater than 0 and is an integer",
      }),
    });

    return schema.validate(data);
  },
};

export default classValidate;
