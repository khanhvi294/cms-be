import Joi from "joi";

const studentValidate = {
  create: (data) => {
    const schema = Joi.object({
      accountStudent: Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Email is required",
          "string.email": "Email is invalid",
          "string.base": "Email is invalid",
          "string.empty": "Email is required",
        }),
      }),
      fullName: Joi.string()
        .required()
        .pattern(
          /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        )
        .trim(true)
        .min(3)
        .max(50)
        .messages({
          "any.required": "FullName is required",
          "string.empty": "FullName is required",
          "string.min": "FullName min is 3",
          "string.max": "FullName max is 50",
          "string.pattern.base": "FullName is only alphanumeric characters",
        }),
      phone: Joi.string()
        .length(10)
        .allow(null, "")
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "phone is required",
          "string.length": "phone must be 10 number",
          "string.empty": "phone is required",
          "string.pattern.name": "phone is 10 number only in 0-9",
        }),
      address: Joi.string().allow(null, "").optional().max(50).messages({
        // "string.base": "Address nmust be string",
        "string.max": "address max is 50",
      }),
      gender: Joi.boolean().messages({
        "boolean.base": "Gender must be boolean",
      }),
      dateOfBirth: Joi.date().allow(null, "").optional().max("now").messages({
        "date.max": "Birthday is invalid",
      }),
    });

    return schema.validate(data);
  },
  update: (data) => {
    const schema = Joi.object({
      accountStudent: Joi.object({
        email: Joi.string().email().optional().messages({
          "any.required": "Email is required",
          "string.email": "Email is invalid",
          "string.base": "Email is invalid",
          "string.empty": "Email is required",
        }),
      }),

      fullName: Joi.string()
        .required()
        .pattern(
          /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        )
        .trim(true)
        .min(3)
        .max(50)
        .messages({
          "any.required": "FullName is required",
          "string.empty": "FullName is required",
          "string.min": "FullName min is 3",
          "string.max": "FullName max is 50",
          "string.pattern.base": "FullName is only alphanumeric characters",
        }),
      phone: Joi.string()
        .length(10)
        .allow(null, "")
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "phone is required",
          "string.length": "phone must be 10 number",
          "string.empty": "phone is required",
          "string.pattern.name": "phone is 10 number only in 0-9",
        }),
      address: Joi.string().allow(null, "").optional().max(50).messages({
        // "string.base": "Address must be string",
        "string.max": "address max is 50",
      }),
      gender: Joi.boolean().messages({
        "boolean.base": "Gender must be boolean",
      }),
      dateOfBirth: Joi.date().required().max("now").messages({
        "date.max": "Birthday is invalid",
        "any.required": "Birthday is required",
      }),
    });

    return schema.validate(data);
  },
  updateByAdmin: (data) => {
    const schema = Joi.object({
      accountStudent: Joi.object({
        email: Joi.string().email().optional().messages({
          "any.required": "Email is required",
          "string.email": "Email is invalid",
          "string.base": "Email is invalid",
          "string.empty": "Email is required",
        }),
      }),
      id: Joi.number().integer().min(1).required().messages({
        "any.required": "id is required",
        "number.min": "id is invalid",
        "number.integer": "id is invalid",
      }),
      fullName: Joi.string()
        .required()
        .pattern(
          /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        )
        .trim(true)
        .min(3)
        .max(50)
        .messages({
          "any.required": "FullName is required",
          "string.empty": "FullName is required",
          "string.min": "FullName min is 3",
          "string.max": "FullName max is 50",
          "string.pattern.base": "FullName is only alphanumeric characters",
        }),
      phone: Joi.string()
        .length(10)
        .allow(null, "")
        .pattern(/^[0-9]+$/, { name: "numbers" })
        .messages({
          "any.required": "phone is required",
          "string.length": "phone must be 10 number",
          "string.empty": "phone is required",
          "string.pattern.name": "phone is 10 number only in 0-9",
        }),
      address: Joi.string().allow(null, "").optional().max(50).messages({
        // "string.base": "Address must be string",
        "string.max": "address max is 50",
      }),
      gender: Joi.boolean().messages({
        "boolean.base": "Gender must be boolean",
      }),
      dateOfBirth: Joi.date().required().max("now").messages({
        "date.max": "Birthday is invalid",
        "any.required": "Birthday is required",
      }),
    });

    return schema.validate(data);
  },
};

export default studentValidate;
