import auth from "../middlewares/auth";
import { ROLES } from "../utils/const";

export const verifyEmployee = [
  auth.isAuthenticated,
  auth.isAccessible([ROLES.EMPLOYEE]),
];
export const verifyTeacher = [
  auth.isAuthenticated,
  auth.isAccessible([ROLES.TEACHER]),
];
export const verifyStudent = [
  auth.isAuthenticated,
  auth.isAccessible([ROLES.STUDENT]),
];

export const verifyEmployeeTeacher = [
  auth.isAuthenticated,
  auth.isAccessible([ROLES.EMPLOYEE, ROLES.TEACHER]),
];

export const verifyRole = [
  auth.isAuthenticated,
  auth.isAccessible([ROLES.STUDENT, ROLES.TEACHER, ROLES.EMPLOYEE]),
];
