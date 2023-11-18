import Joi from "joi";

const employeeValidate = {
  create: (data) => {
    const schema = Joi.object({
      accountEmployee: Joi.object({
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
      cccd: Joi.string()
        .length(11)
        .required()
        // .min(3)
        // .max(11)
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "cccd is required",
          "string.length": "cccd must be 11 character",
          "string.empty": "cccd is required",
          "string.min": "cccd min is 3",
          "string.max": "cccd max is 11",
          "string.pattern.name": "cccd is 11 characters only in 0-9",
        }),
    });

    return schema.validate(data);
  },
};

export default employeeValidate;
