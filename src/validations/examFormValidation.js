import Joi from "joi";

const examFormValidate = {
  create: (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(30).messages({
        "any.required": "Name is required",
        "string.email": "Name is invalid",
        "string.empty": "Name is required",
        "string.min": "Name minimum is 3 characters",
        "string.max": "Name maximum is 30 characters",
      }),
    });

    return schema.validate(data);
  },
};

export default examFormValidate;
