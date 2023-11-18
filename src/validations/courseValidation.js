import Joi from "joi";

const courseValidation = {
  create: (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(30).messages({
        "any.required": "Name is required",
        "string.email": "Name is invalid",
        "string.empty": "Name is required",
        "string.min": "Name minimum is 3 characters",
        "string.max": "Name maximum is 30 characters",
      }),
      trainingTime: Joi.number().integer().min(1).required().messages({
        "any.required": "trainingTime is required",
        "number.integer": "trainingTime must be integer",
        "number.min": "trainingTime must be greater than 0 and is an integer",
      }),
    });

    return schema.validate(data);
  },
};

export default courseValidation;
