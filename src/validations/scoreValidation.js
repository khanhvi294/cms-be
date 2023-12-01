import Joi from "joi";

const scoreValidate = {
  createOnRound: (data) => {
    const schema = Joi.object({
      roundId: Joi.number().integer().min(1).required().messages({
        "any.required": "roundId is required",
        "number.min": "roundId must be greater than 0 and is an integer",
        "number.integer": "roundId is invalid",
      }),
      judgeId: Joi.number().integer().min(1).required().messages({
        "any.required": "judgeId is required",
        "number.min": "judgeId must be greater than 0 and is an integer",
        "number.integer": "judgeId is invalid",
      }),
      scores: Joi.array().items(
        Joi.object({
            studentId:  Joi.number().integer().min(1).required().messages({
                "any.required": "studentId is required",
                "number.min": "studentId must be greater than 0 and is an integer",
                "number.integer": "studentId is invalid",
              }),
            score: Joi.number().integer().min(0).required().messages({
                "any.required": "score is required",
                "number.min": "score must be greater or equal than 0 and is an integer",
                "number.integer": "score is invalid",
            })
        })
       
      ),
    });

    return schema.validate(data);
  },
};

export default scoreValidate;
