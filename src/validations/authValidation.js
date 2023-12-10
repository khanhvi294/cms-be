import Joi from 'joi';

const authValidate = {
	forgotPassword: (data) => {
		const schema = Joi.object({
			email: Joi.string().email().required().messages({
				'any.required': 'Email is required',
				'string.empty': 'Email is required',
				'string.email': 'Email is invalid',
			}),
		});

		return schema.validate(data);
	},
};

export default authValidate;
