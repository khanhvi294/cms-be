import HttpException from "../errors/httpException";
import authService from "../services/authService";
import jwtUtil from "../utils/jwt";

export const isAuthenticated = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).json({
        status: 401,
        message: "Not authorized to access this resource",
      });
    }

    const token = header.replace("Bearer ", "");
    const data = await jwtUtil.verifyToken(token);

    const { role } = await authAccount(data.id);
    req.user = {
      id: data.id,
      role,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 401, message: "Not authorized to access this resource" });
  }
};

export const authAccount = async (id) => {
  if (!id) {
    throw new HttpException(401, "Not authorized to access this resource");
  }
  const user = await authService.findAccount(id);
  if (!user) {
    throw new HttpException(401, "Not authorized to access this resource");
  }

  return user;
};

export const isAccessible = (permissions) => {
  return async (req, res, next) => {
    const role = req?.user?.role || "";
    if (!permissions.includes(role)) {
      res
        .status(401)
        .json({ message: "You don't have permission", status: 401 });
    }
    next();
  };
};

export default { isAuthenticated, isAccessible };
