import authService from "../services/authService";

const login = async (req, res) => {
  await authService.login();
  return res.status(200).json({ message: "loginapi" });
};

export default {
  login,
};
