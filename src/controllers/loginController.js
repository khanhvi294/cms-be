const jwt = require("jsonwebtoken");
// import {jwt} from jsonwebtoken;
const user = { _id: 1, name: "vi" };
const handleLogin = (req, res) => {
  console.log("object");
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  return res.send("ho");
};

module.exports = { handleLogin };
