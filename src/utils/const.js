import moment from "moment";

export const ROLES = {
  TEACHER: 2,
  STUDENT: 0,
  EMPLOYEE: 1,
};

export const STATUS = {
  success: "success",
  failed: "failed",
};

export const STATUS_COMPETITION = {
  CREATED: 0,
  STARTED: 1,
  ENDED: 2,
  CANCEL: 3,
};

export const STATUS_COMPETIION_MESSAGE ={
  [STATUS_COMPETITION.CREATED]: 'created',
  [STATUS_COMPETITION.STARTED]: 'started',
  [STATUS_COMPETITION.ENDED]: 'ended',
  [STATUS_COMPETITION.CANCEL]: 'canceled',

}

export const DISTANCE_DATE_CHANGE_STATUS = 2;

export const checkCompetitionStatus = (statusId) => {
  return Object.values(STATUS_COMPETITION).includes(statusId);
};

export const DEFAULT_PASSWORD = "123123";

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

export const resFindAll = (data) => {
  return {
    data,
    total: data.length,
  };
};

export function findMinDate(arr) {
  /**
   *  {
   *    time
   *    roundId
   *  }
   */
  if (arr.length === 0) {
    // Handle empty array case
    return null; // or you can throw an error or handle it according to your needs
  }

  if (arr.length === 1) {
    return arr[0];
  }

  let minValue = arr[0].time;
  let pos = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].time < minValue) {
      minValue = arr[i].time;
      pos = i;
    }
  }

  return arr[pos];
}

export function findMinDateCondition(arr, condition) {
  /**
   *  {
   *    time
   *    roundId
   *  }
   */
  if (arr.length === 0) {
    // Handle empty array case
    return undefined; // or you can throw an error or handle it according to your needs
  }

  if (arr.length === 1) {
    return arr[0];
  }

  const arrCon = arr.filter((item) => item.time > condition.time);
  if (arrCon.length == 0) {
    return null;
  }

  if (arrCon.length === 1) {
    return arrCon[0];
  }
  return findMinDate(arrCon);
}


export const calculateDistanceFromDate = (from, to) => {
  let now = moment(from); //todays date
  let end = moment(to); // another date
  const days = end.diff(now, 'days');
  // let duration = moment.duration(now.diff(end, 'days'));
  // let days = duration.asDays();
  return days;
}