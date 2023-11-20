import Joi from "joi";

const roundValidation = {
  create: (data) => {
    const schema = Joi.object({
      time: Joi.number().integer().min(1).required().messages({
        "any.required": "time is required",
        "number.integer": "time must be integer",
        "number.min": "time must be greater than 0 and is an integer",
      }),
      exam: Joi.string().optional().max(100).messages({
        "string.base": "exam must be a string",
        "string.max": "string must be max 100 characters",
      }),
      examFormId: Joi.number().integer().min(1).required().messages({
        "any.required": "examFormId is required",
        "number.integer": "examFormId must be integer",
        "number.min": "examFormId must be greater than 0 and is an integer",
      }),
      competitionId: Joi.number().integer().min(1).required().messages({
        "any.required": "competitionId is required",
        "number.integer": "competitionId must be integer",
        "number.min": "competitionId must be greater than 0 and is an integer",
      }),
      numPoint: Joi.number().integer().min(1).required().messages({
        "any.required": "numPoint is required",
        "number.integer": "numPoint must be integer",
        "number.min": "numPoint must be greater than 0 and is an integer",
      }),
      timeStart: Joi.date().iso().required().messages({
        "any.required": "timeStart must be required",
        "timeStart.iso": "timeStart is invalid",
      }),
    });

    return schema.validate(data);
  },
};

export default roundValidation;
