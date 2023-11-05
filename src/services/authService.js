import db from "../models";

const login = async (req, res) => {
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  const user = await db.Account.findOne({
    where: { email: req.email, password: req.password },
  });
  return {
    data: user,
    total: user.length,
  };
};

export default { login };
