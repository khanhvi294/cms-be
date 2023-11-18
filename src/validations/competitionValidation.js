import Joi from "joi";

const competitionValidation = {
  create: (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(30).messages({
        "any.required": "Name is required",
        "string.email": "Name is invalid",
        "string.empty": "Name is required",
        "string.min": "Name minimum is 3 characters",
        "string.max": "Name maximum is 30 characters",
      }),
      numberOfRound: Joi.number(),
      maximumQuantity: Joi.number().integer().min(1).required().messages({
        "any.required": "maximumQuantity is required",
        "number.integer": "maximumQuantity must be integer",
        "number.min":
          "maximumQuantity must be greater than 0 and is an integer",
      }),
      minimumQuantity: Joi.number().integer().min(1).required().messages({
        "any.required": "minimumQuantity is required",
        "number.integer": "minimumQuantity must be integer",
        "number.min":
          "minimumQuantity must be greater than 0 and is an integer",
      }),
      numOfPrizes: Joi.number().integer().min(1).required().messages({
        "any.required": "numOfPrizes is required",
        "number.integer": "numOfPrizes must be integer",
        "number.min": "numOfPrizes must be greater than 0 and is an integer",
      }),
      competitionClass: Joi.array().items(
        Joi.number().integer().messages({
          "any.required": "classId is required",
          "number.integer": "classId must be integer",
        })
      ),
    });

    return schema.validate(data);
  },
};

export default competitionValidation;
