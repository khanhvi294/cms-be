import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION, resFindAll } from "../utils/const";
import classService from "./classService";
import competitionClassService from "./competitionClassService";
import { sequelize } from "../config/connectDB";
import { checkCompetitionStatus } from "../utils/const";

export const createCompetition = async (employeeId, data) => {
  if (!data?.competitionClass || !data?.competitionClass?.length) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  if (new Date() >= new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Time start must be greater than today")
    );
  }
  if (new Date(data.timeStart) > new Date(data.timeEnd)) {
    throw new HttpException(
      422,
      ErrorMessage.TIME_START_MUST_BE_LESS_THAN_TIME_END
    );
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const competitionData = {
        name: data.name,
        status: STATUS_COMPETITION.CREATED,
        employeeId: employeeId,
        minimumQuantity: data.minimumQuantity,
        numOfPrizes: data.numOfPrizes,
        numberOfRound: data.numberOfRound,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
      };

      const competition = await db.Competition.create(competitionData, {
        transaction: t,
      });

      const competitionClassPromise = await data.competitionClass.map(
        async (item) => {
          await classService.getClassById(item);
          return competitionClassService.createCompetitionClass(
            {
              competitionId: competition.id,
              classId: item,
            },
            t
          );
        }
      );

      const result = await Promise.all(competitionClassPromise);

      return { ...competition, competitionClass: result };
    });

    if (result?.dataValues) {
      return result.dataValues;
    }

    return result;
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);

    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
  }
};

export const getAllCompetition = async () => {
  const data = await db.Competition.findAll({ order: [["createdAt", "DESC"]] });
  return resFindAll(data);
};

export const getAllCompetitionIncludeEmployee = async (employeeId) => {
  const data = await db.Competition.findAll({ where: { employeeId } });
  return resFindAll(data);
};

export const getCompetitionById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Competition.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Competition"));
  }

  return data;
};

export const getCompetitionIncludeRounds = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Competition.findOne({
    where: {
      id: id,
    },
    nest: true,
    raw: false,
    include: [
      {
        model: db.Round,
        as: "competitionRound",
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Competition"));
  }

  return data;
};

export const getCompetitionIncludeClass = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Competition.findOne({
    where: {
      id: id,
    },
    nest: true,
    raw: false,
    include: [
      {
        model: db.CompetitionClass,
        as: "competitionCompetitionClass",
      },
    ],
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Competition"));
  }

  return data;
};

export const updateStatusCompetition = async (id, statusId) => {
  const competition = await getCompetitionById(id);
  if (!checkCompetitionStatus(statusId)) {
    throw new HttpException(422, ErrorMessage.DATA_IS_INVALID("Status"));
  }

  const dataUpdate = await db.Competition.update(
    {
      status: statusId,
    },
    { where: { id } }
  );

  if (dataUpdate[0] === 1) {
    return await getCompetitionById(id);
  }

  throw new HttpException(400, ErrorMessage.INTERNAL_ERROR);
};

const updateCompetition = async (data) => {
  if (new Date(haveRound.timeStart) <= new Date()) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Competition is already started,can't update")
    );
  }

  if (new Date() >= new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Time start round must be greater than today")
    );
  }
  if (new Date(data.timeStart) > new Date(data.timeEnd)) {
    throw new HttpException(
      422,
      ErrorMessage.TIME_START_MUST_BE_LESS_THAN_TIME_END
    );
  }

  const competition = await getCompetitionById(data.id);
  if (competition.status !== STATUS_COMPETITION.CREATED) {
    throw new HttpException(400, ErrorMessage.COMPETITION_CANNOT_UPDATE);
  }

  const competitionDataUpdate = {
    name: data.name,
    minimumQuantity: data.minimumQuantity,
    numOfPrizes: data.numOfPrizes,
    numberOfRound: data.numberOfRound,
    timeStart: data.timeStart,
    timeEnd: data.timeEnd,
  };

  const result = await db.Competition.update(
    { ...competitionDataUpdate },
    { where: { id: data.id } }
  ).then(async () => {
    return await getCompetitionById(data.id);
  });

  return result;
};

const deleteCompetition = async (id) => {};

const addClassJoin = async (data) => {
  /**
   * data {
   *  id,
   *  competitionClass: []
   * }
   */

  if (!data?.competitionClass || !data?.competitionClass?.length) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const competitionn = await getCompetitionById(data.id);
  if (competitionn.status !== STATUS_COMPETITION.CREATED) {
    throw new HttpException(422, ErrorMessage.COMPETITION_IS_STARTED);
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const competitionClassPromise = data.competitionClass.map(
        async (item) => {
          await classService.getClassById(item);
          return competitionClassService.createCompetitionClass(
            {
              competitionId: data.id,
              classId: item,
            },
            t
          );
        }
      );

      return await Promise.all(competitionClassPromise);
    });
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);
  }
};

const removeClassJoin = async (data) => {
  /**
   * data {
   *  id,
   *  competitionClass: []
   * }
   */

  console.log("dataaa ", data);
  if (!data?.competitionClass || !data?.competitionClass?.length) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const competitionn = await getCompetitionById(data.id);
  if (competitionn.status !== STATUS_COMPETITION.CREATED) {
    throw new HttpException(422, ErrorMessage.COMPETITION_IS_STARTED);
  }

  try {
    const result = await db.sequelize.transaction(async (t) => {
      const competitionClassPromise = await data.competitionClass.map(
        async (item) => {
          await classService.getClassById(item);
          return competitionClassService.deleteClassCompetition(
            {
              competitionId: data.id,
              classId: item,
            },
            t
          );
        }
      );

      return await Promise.all(competitionClassPromise);
    });
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);
  }
};

export default {
  createCompetition,
  getAllCompetition,
  getCompetitionById,
  updateStatusCompetition,
  updateCompetition,
  getCompetitionIncludeClass,
  getCompetitionIncludeRounds,
  getAllCompetitionIncludeEmployee,
  deleteCompetition,
  addClassJoin,
  removeClassJoin,
};
