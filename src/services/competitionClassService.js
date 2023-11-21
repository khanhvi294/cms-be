import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

const createCompetitionClass = async (data, t) => {
  const result = await db.CompetitionClass.create(
    {
      competitionId: data.competitionId,
      classId: data.classId,
    },
    { transaction: t }
  );
  return result;
};

export const getAllCompetitionByClass = async (classId) => {
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.CompetitionClass.findAll({
    where: { classId: classId },
  });

  return resFindAll(data);
};

// const getAllClassCanJoinCompetition = async (competitionId) => {
//   const competition =
//     await competitionService.getCompetitionById(competitionId);

//   if (competition.status !== STATUS_COMPETITION.CREATED) {
//     throw new HttpException(400, ErrorMessage.HAS_NO_DATA);
//   }

//   // check tgian
//   const classes = await db.Class.findAll({
//     raw: true,
//     nest: true,
//     include: [
//       {
//         model: db.Course,
//         as: "courseClass",
//       },
//     ],
//     order: [["updatedAt", "DESC"]],
//   });

//   // return classes;

//   return classes.filter((item) => checkClassCanJoinCompetition(item));
// };

// const checkClassCanJoinCompetition = async (classObj) => {
//   const timeStart = new Date(classObj.timeStart);
//   const timeEnd = new Date(classObj.timeEnd);

//   const month =
//     (timeEnd.getYear() - timeStart.getYear()) * 12 +
//     (timeEnd.getMonth() - timeStart.getMonth());

//   if (month >= (2 / 3) * classObj.courseClass.trainingTime) {
//     return true;
//   }
//   return true;
// };

export default {
  createCompetitionClass,
  getAllCompetitionByClass,
  // getAllClassCanJoinCompetition,
  // checkClassCanJoinCompetition,
};
