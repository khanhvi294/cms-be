const handleError = (err, req, res, next) => {
  console.log("handleErr:: ", err);
  if (err && err?.errorCode) {
    return res
      .status(err.errorCode)
      .json({ status: err.errorCode, message: err.message });
  }
  console.error("error from server: ", err.message);
  console.log(err);
  return res
    .status(500)
    .json({ status: 500, message: "Đã có lỗi xảy ra ở server" });
};

export default handleError;
