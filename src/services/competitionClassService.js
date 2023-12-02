import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import classService from "./classService";
import competitionService from "./competitionService";

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
    order: [["createdAt", "DESC"]],
  });

  return resFindAll(data);
};
const getUnselectedClasses = (allClasses, selectedClasses) => {
  // Lọc ra các lớp chưa được chọn
  const unselectedClasses = allClasses.filter((classItem) => {
    // Kiểm tra xem lớp có trong danh sách đã chọn hay không
    const isSelected = selectedClasses.some(
      (selectedClass) => selectedClass.id === classItem.id
    );

    // Nếu lớp chưa được chọn, thì giữ lại trong mảng
    return !isSelected;
  });

  return unselectedClasses;
};

const getAllClassJoinCompetition = async (competitionId) => {
  if (!competitionId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.CompetitionClass.findAll({
    where: { competitionId: competitionId },
    raw: true,
    nest: true,
    include: [
      {
        model: db.Class,
        as: "ClassCompetitionClass",
        attributes: ["id", "name", "courseId", "timeStart", "timeEnd"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const formattedData = data.map((item) => item.ClassCompetitionClass);

  return resFindAll(formattedData);
};

const getClassChooseUpdate = async (competitionId) => {
  const competition =
    await competitionService.getCompetitionById(competitionId);

  const classChoose = await classService.getClassChooseJoin(
    competition.timeStart
  );

  const classAlreadyChoose = await getAllClassJoinCompetition(competitionId);

  return getUnselectedClasses(classChoose, classAlreadyChoose.data);
};

const deleteClassCompetition = async (competitionId, classId, t) => {
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  if (!competitionId)
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  const competition =
    await competitionService.getCompetitionById(competitionId);

  if (new Date(competition.timeStart) <= new Date()) {
    throw new HttpException(
      422,
      ErrorMessage.CUSTOM("Competition has started, can't removed class")
    );
  }
  const data = await db.CompetitionClass.destroy({
    where: { competitionId, classId },
  });

  return data;
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
  getAllClassJoinCompetition,
  deleteClassCompetition,
  getClassChooseUpdate,
  // getAllClassCanJoinCompetition,
  // checkClassCanJoinCompetition,
};
