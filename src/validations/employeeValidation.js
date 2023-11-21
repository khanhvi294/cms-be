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
        .length(12)
        .required()
        // .min(3)
        // .max(11)
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "cccd is required",
          "string.length": "cccd must be 12 character",
          "string.empty": "cccd is required",

          "string.pattern.name": "cccd is 11 characters only in 0-9",
        }),
      phone: Joi.string()
        .length(10)
        .required()
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "phone is required",
          "string.length": "phone must be 10 number",
          "string.empty": "phone is required",
          "string.pattern.name": "phone is 10 number only in 0-9",
        }),
      address: Joi.string().optional().max(50).messages({
        // "string.base": "Address must be string",
        "string.max": "address max is 50",
      }),
      gender: Joi.boolean().messages({
        "boolean.base": "Gender must be boolean",
      }),
      dateOfBirth: Joi.date().optional().max("now").messages({
        "date.max": "Birthday is invalid",
      }),
    });

    return schema.validate(data);
  },
};

export default employeeValidate;
