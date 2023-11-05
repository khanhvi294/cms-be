import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const generateHashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, inputPassword) => {
  return await bcrypt.compare(inputPassword, password);
};

export default {
  generateHashPassword,
  comparePassword,
};
