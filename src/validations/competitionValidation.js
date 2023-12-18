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
      numberOfRound: Joi.number().min(1).integer().messages({
        "any.required": "numberOfRound is required",
        "number.integer": "numberOfRound must be integer",
        "number.min": "numberOfRound must be greater than 0 and is an integer",
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
      timeStart: Joi.date().required().messages({
        "date.min": "timeStart must be greater today",
        "any.required": "timeStart is required",
        "date.base": "timeStart must be a date",
      }),
      timeEnd: Joi.date().required().messages({
        "date.min": "timeEnd must be greater today",
        "any.required": "timeEnd is required",
        "date.base": "timeEnd must be a date",
      }),
    });

    return schema.validate(data);
  },

  update: (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(30).messages({
        "any.required": "Name is required",
        "string.email": "Name is invalid",
        "string.empty": "Name is required",
        "string.min": "Name minimum is 3 characters",
        "string.max": "Name maximum is 30 characters",
      }),
      numberOfRound: Joi.number().min(1).integer().messages({
        "any.required": "numberOfRound is required",
        "number.integer": "numberOfRound must be integer",
        "number.min": "numberOfRound must be greater than 0 and is an integer",
      }),
      id: Joi.number().required().integer().min(1).messages({
        "any.required": "id is required",
        "number.integer": "id must be integer",
        "number.min": "id must be greater than 0 and is an integer",
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
      timeStart: Joi.date().required().messages({
        "date.min": "timeStart must be greater now",
        "any.required": "timeStart is required",
        "date.base": "timeStart must be a date",
      }),
      timeEnd: Joi.date().required().messages({
        "date.min": "timeEnd must be greater now",
        "any.required": "timeEnd is required",
        "date.base": "timeEnd must be a date",
      }),
    });

    return schema.validate(data);
  },
};

export default competitionValidation;
