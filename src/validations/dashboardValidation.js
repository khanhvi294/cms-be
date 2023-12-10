import Joi from "joi";

const dashboardValidation = {
  filter: (data) => {
    const schema = Joi.object({
      from: Joi.date().messages({
        "any.required": "from is required",
        "date.base": "from must be a date",
      }),
      to: Joi.date().messages({
        "any.required": "to is required",
        "date.base": "to must be a date",
      }),
    });

    return schema.validate(data);
  },
};

export default dashboardValidation;
