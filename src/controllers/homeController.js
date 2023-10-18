const handleHi = (req, res) => {
  console.log("object");
  return res.send("ho");
};

module.exports = { handleHi };
