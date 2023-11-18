import Joi from "joi";

const userValidate = {
  login: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email is invalid",
        "string.empty": "Email is required",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password is required",
      }),
    });

    return schema.validate(data);
  },
};

export default userValidate;
