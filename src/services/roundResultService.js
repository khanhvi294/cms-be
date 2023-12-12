import { STATUS_COMPETITION, resFindAll } from "../utils/const";

import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import competitionService from "./competitionService";
import db from "../models";
import judgeService from "./judgeService";
import roundService from "./roundService";
import scoreService from "./scoreService";

const tmpCreateRounds = async (data) => {
  /**
   *  data {
   *    roundId,
   *    competitionId
   * }
   */

  if (!data.roundId || !data.competitionId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const competition = await db.Competition.findOne({
    where: { id: data.competitionId },
    nest: true,
    raw: false,
    include: [
      {
        model: db.Register,
        as: "competitionRegister",
        attributes: ["id", "studentId"],
      },
    ],
  });

  if (!competition) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Competition")
    );
  }

  return await createRoundResultMultiStudents({
    roundId: data.roundId,
    studentIds: competition.competitionRegister.map((item) => item.studentId),
  });
};

const createRoundResultMultiStudents = async (data) => {
  /**
   *  data {
   *    roundId: 1,
   *    studentIds: [1,2,3,4,5]
   * }
   */
  if (!data.studentIds || !data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  try {
    const competitionRound = await db.Round.findOne({
      where: { id: data.roundId },
      nest: true,
      raw: false,
      include: [
        {
          model: db.Competition,
          as: "competitionRound",
          attributes: ["id"],
          include: [
            {
              model: db.Register,
              as: "competitionRegister",
              attributes: ["id", "studentId"],
            },
          ],
        },
      ],
    });

    if (!competitionRound?.competitionRound?.competitionRegister) {
      throw new HttpException(400, ErrorMessage.DATA_IS_INVALID);
    }

    const result = await db.sequelize.transaction(async (t) => {
      // competitionRound?.competitionRound?.competitionRegister.map((item) => {
      // })

      const roundResultPromise = data.studentIds.map((studentId) => {
        return createRoundResult({
          studentId: studentId,
          roundId: data.roundId,
        });
      });

      return await Promise.all(roundResultPromise);
    });

    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error.message);
  }
};

const createRoundResult = async (data, t) => {
  if (!data.studentId || !data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  await checkRoundResultExists(data);

  const roundResult = await db.RoundResult.create(
    {
      studentId: data.studentId,
      roundId: data.roundId,
      score: null,
    },
    { transaction: t }
  );

  return roundResult;
};

const checkRoundResultExists = async (data) => {
  const check = await db.RoundResult.findOne({
    where: { roundId: data.roundId, studentId: data.studentId },
  });
  if (check) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_EXISTING("Student's result")
    );
  }

  return false;
};

const findRoundResult = async (id, t) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.RoundResult.findOne({
    where: { id: id },
    transaction: t,

    nest: true,
    raw: false,
    include: [
      {
        model: db.Score,
        as: "roundResultScore",
      },
    ],
  });
  return result;
};

const getRoundResult = async (id) => {
  const result = await findRoundResult(id);
  if (!result) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Student's result")
    );
  }
  return result;
};

export const updateRoundResult = async (employeeId, data) => {
  /**
   *  data {
   *    id
   *    score
   *    roundId,
   * }
   */

  if (!data.id || !data.roundId || !data.score) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  if (0 > data.score || data.score > 10) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Score must be between 0 and 10")
    );
  }

  const judge = await judgeService.findJudgeByEmployeeIdAndRoundId({
    employeeId: employeeId,
    roundId: data.roundId,
  });

  if (!judge) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("You doesn't have permission to update score")
    );
  }

  const competition = await roundService.getCompetitionByRoundId(data.roundId);
  const round = await roundService.getRoundById(data.roundId);

  if (new Date() < new Date(round.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Can not update score because round is not started")
    );
  }

  if (round?.approved) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Can not update score because round is approved")
    );
  }

  if (competition.status != STATUS_COMPETITION.STARTED) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Can't input score because competition is not started"
      )
    );
  }

  let isNew = true;
  const hasScore = await db.Score.findOne({
    where: { judgeId: judge.id, roundResultId: data.id },
  });

  if (hasScore) {
    isNew = false;
  }

  // check does round result is existing;
  // update score -> create new score for this bgk
  // const await Promise.all([getRoundResult(data.id)]);
  const roundResultStudent = await getRoundResult(data.id);

  // update score ->
  if (!isNew) {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        // update score ->
        const oldScore = await scoreService.updateScoreForOneStudent(
          {
            roundResultId: data.id,
            judgeId: judge.id,
            score: data.score,
          },
          t
        );

        // update to round result
        const roundResultUpdate = await db.RoundResult.increment(
          {
            score: data.score - oldScore,
          },
          { where: { id: data.id }, transaction: t }
        ).then(async () => {
          return await findRoundResult(data.id, t);
        });
        return roundResultUpdate;
      });
      return result;
    } catch (error) {
      console.log("ERROR:: ", error);
      throw new HttpException(400, error.message);
    }
  }

  // create score
  try {
    const result = await db.sequelize.transaction(async (t) => {
      // create score
      await scoreService.createScoreForOneStudent(
        {
          roundResultId: data.id,
          judgeId: judge.id,
          score: data.score,
        },
        t
      );
      let roundResultUpdate = undefined;
      // update to round result
      if (!roundResultStudent.score) {
        roundResultUpdate = await db.RoundResult.update(
          {
            score: data.score,
          },
          { where: { id: data.id }, transaction: t }
        );
      } else {
        roundResultUpdate = await db.RoundResult.increment(
          {
            score: data.score,
          },
          { where: { id: data.id }, transaction: t }
        );
      }

      if (roundResultStudent) {
        await Promise.all([roundResultStudent]);
      }
    });
    return await findRoundResult(data.id);
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error.message);
  }
};

const getRoundResultByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.RoundResult.findAll({
    where: { roundId },
    raw: false,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Students,
        as: "roundResultStudent",
        attributes: ["fullName", "id"],
      },
      {
        model: db.Score,
        as: "roundResultScore",
        attributes: ["score"],
        raw: false,
        nest: true,
        include: [
          {
            model: db.Judge,
            as: "scoreJudge",
            attributes: ["employeeId", "id"],
            raw: false,
            nest: true,
            include: [
              {
                model: db.Employee,
                as: "employeeJudge",
                attributes: ["fullName"],
              },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

const getRoundResultByRoundForTeacher = async (roundId, teacherId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  if (!teacherId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  const roundResults = await db.RoundResult.findAll({
    where: { roundId },
    raw: false,
    nest: true,
    include: [
      {
        model: db.Students,
        as: "roundResultStudent",
        attributes: ["id", "fullName"],
      },
      {
        model: db.Score,
        as: "roundResultScore",
        attributes: ["score"],
        raw: false,
        nest: true,
        include: [
          {
            model: db.Judge,
            as: "scoreJudge",
            attributes: [], // Chỉ lấy employeeId
            where: {
              employeeId: teacherId, // Lọc theo employeeId trong bảng Judge
              roundId, // Lọc theo roundId trong bảng Judge
            },
          },
        ],
      },
    ],
  });
  return resFindAll(roundResults);
};

export const getRoundResultIncludeScoreByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.RoundResult.findAll({
    where: { roundId },
    raw: false,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Students,
        as: "roundResultStudent",
        attributes: ["fullName", "id"],
      },
    ],
    include: [
      {
        model: db.Score,
        as: "roundResultScore",
      },
    ],

    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export const getRoundResultByIdAndStudentId = async (roundId, studentId) => {
  if (!roundId || !studentId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.RoundResult.findOne({
    where: { roundId: roundId, studentId: studentId },
    nest: true,
    raw: false,
    include: [
      {
        model: db.Score,
        as: "roundResultScore",
      },
      {
        model: db.Score,
        as: "roundResultScore",
        attributes: ["score"],
        raw: false,
        nest: true,
        include: [
          {
            model: db.Judge,
            as: "scoreJudge",
            attributes: ["employeeId", "id"],
            raw: false,
            nest: true,
            include: [
              {
                model: db.Employee,
                as: "employeeJudge",
                attributes: ["fullName"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!result) {
    return null;
  }
  return result;
};

// const updateScore = async (data) => {};

// chua check timeStart
const checkStudentPassRound = async (data) => {
  /**
   * data {
   *    markPoint,
   *    roundId
   * }
   */

  if (!data.markPoint || !data.roundId) {
    throw new HttpException(400, ErrorMessage.MISSING_PARAMETER);
  }

  // check coi phai vong cuoi cung ko
  // const nextRound = await roundService.getNextRoundWithoutCompetitionId(
  //   data.roundId
  // );
  // if (!nextRound) {
  //   throw new HttpException(400, ErrorMessage.CANNOT_CHECK_PASS_LAST_ROUND);
  // }

  const roundResults = await getAllRoundResultByRoundId(data.roundId);
  if (!roundResults.length) {
    return [];
  }

  const resultPass = roundResults.filter(
    (item) => item.score >= data.markPoint
  );

  return resultPass;
};

const getAllRoundResultByRoundId = async (roundId) => {
  const data = await db.RoundResult.findAll({
    where: { roundId: roundId },
    nest: true,
    raw: false,
    include: [
      {
        model: db.Students,
        as: "roundResultStudent",
        attributes: ["fullName", "id"],
      },
    ],
  });

  return data;
};

const confirmStudentPassRound = async (data) => {
  /**
   *  roundId: 2
   *  studentIds: [1,2,3,4]
   * 
   */
  // check list student
  // create new round result for student
  if (!data.roundId || !data.studentIds) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  if (!data.studentIds.length) {
    throw new HttpException(400, "Student list is empty");
  }

  try {
    const result = await db.sequelize.transaction(async (t) => {
      const roundResultsPromise = db.RoundResult.findAll({
        where: { roundId: data.roundId },
      });
      const competitionPromise = roundService.getCompetitionByRoundId(
        data.roundId
      );

      const [roundResult, competition] = await Promise.all([
        roundResultsPromise,
        competitionPromise,
      ]);
      console.log(
        "🚀 ~ file: roundResultService.js:529 ~ result ~ competition:",
        competition
      ),
        console.log(
          "🚀 ~ file: roundResultService.js:532 ~ result ~ roundResult:",
          roundResult
        );

      const studentPass = data.studentIds.map((item) => {
        const id = roundResult.find((result) => result.studentId == item);
        if (!id) {
          console.log("id:: ", id);
          throw new HttpException(
            400,
            ErrorMessage.OBJECT_IS_NOT_EXISTING("Student")
          );
        }
        return id;
      });

      if(data?.scorePoint){
        await db.Round.update({
          scorePoint: data.scorePoint
        }, {
          where: {
            roundId: data.roundId
          },
          transaction: t
        })
      }

      await roundService.approveRound(data.roundId);

      const nextRound = await roundService.getNextRound(
        competition.id,
        data.roundId
      );

      if (!nextRound || nextRound.id == data.roundId) {
        return {
          isLastRound: true,
          roundId: data.roundId,
          message: "This is last round",
        };
      }

      return await createRoundResultMultiStudents({
        roundId: nextRound.id,
        studentIds: studentPass.map((item) => item.studentId),
      });
    });
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error.message);
  }
};

export default {
  createRoundResult,
  updateRoundResult,
  findRoundResult,
  getRoundResult,
  getRoundResultByRound,
  getRoundResultByRoundForTeacher,
  // updateScore,
  checkStudentPassRound,
  confirmStudentPassRound,
  createRoundResultMultiStudents,
  tmpCreateRounds,
  getAllRoundResultByRoundId,
  getRoundResultIncludeScoreByRound,
  getRoundResultByIdAndStudentId,
};
