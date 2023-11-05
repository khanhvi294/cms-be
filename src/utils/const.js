export const ROLES = {
  ADMIN: 2,
  STUDENT: 0,
  EMPLOYEE: 1,
};

export const STATUS = {
  success: "success",
  failed: "failed",
};

export const ENV_CONFIG = {
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
  // EMAIL_APP: process.env.EMAIL_APP,
  // APP_NAME: process.env.APP_NAME,
  // EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  // EMAIL_HOST: process.env.EMAIL_HOST,
  TOKEN_LIFE_ACCESS_TOKEN: process.env.TOKEN_LIFE_ACCESS_TOKEN,
  // TOKEN_LIFE_REFRESH_TOKEN: process.env.TOKEN_LIFE_REFRESH_TOKEN,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
};
