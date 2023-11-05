import Joi from "joi";

const userValidate = {
  login: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Vui lòng nhập email",
        "string.email": "Email không hợp lệ",
        "string.empty": "Vui lòng nhập email",
      }),
      password: Joi.string().required().messages({
        "any.required": "Vui lòng nhập mật khẩu",
        "string.empty": "Vui lòng nhập mật khẩu",
      }),
    });

    return schema.validate(data);
  },
};

export default { userValidate };
