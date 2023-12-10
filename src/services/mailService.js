const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

console.log(transporter);

export const sendMail = (data) => {
	const mailOptions = {
		from: process.env.EMAIL_USERNAME,
		...data,
	};
	return transporter.sendMail(mailOptions);
};

export const mailService = {
	sendMail,
};
