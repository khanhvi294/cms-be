import Joi from "joi";

const studentValidate = {
  create: (data) => {
    const schema = Joi.object({
      accountStudent: Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Email is required",
          "string.email": "Email is invalid",
          "string.base": "Email is invalid",
          "string.empty": "Email is required",
        }),
      }),
      fullName: Joi.string().required().min(3).max(50).messages({
        "any.required": "fullName is required",
        "string.empty": "fullName is required",
        "string.min": "FullName min is 3",
        "string.max": "FullName max is 50",
      }),
    });

    return schema.validate(data);
  },
};

export default studentValidate;
