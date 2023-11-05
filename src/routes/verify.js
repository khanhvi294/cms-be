import auth from "../middlewares/auth";

export const verifyAdmin = [auth.isAuthenticated];
export const verifyEmployee = [auth.isAuthenticated];
export const verifyStudent = [auth.isAuthenticated];
