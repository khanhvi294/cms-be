const login = async (req, res) => {
  const user = await Account.findOne({
    where: { email: req.email, password: req.password },
  });
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  return res.send(token);
};

export default { login };
