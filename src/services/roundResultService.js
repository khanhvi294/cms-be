import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";

const findOrCreateRoundResult = async (data) => {
  if (!data.studentId || data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const [roundResult, created] = await db.RoundResult.findOrCreate({
    where: { studentId: data.studentId, roundId: data.roundId },
    defaults: {
      studentId: data.studentId,
      roundId: data.roundId,
      score: 0,
      numOfJudges: 0,
    },
  });

  return roundResult;
};

export const updateRoundResult = async (data, isNew = true, transaction) => {
  if (!data.studentId || !data.roundId || !data.score) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const roundResult = await findOrCreateRoundResult(data);
  const result = await db.RoundResult.update(
    {
      score: roundResult.score + data.score,
      numOfJudges: isNew ? numOfJudges + 1 : numOfJudges,
    },
    {
      where: { id: roundResult.id },
      transaction:  transaction
    }
  ).then(async () => {
    return await findOrCreateRoundResult(data);
  });
  return result;
};

export default {
  findOrCreateRoundResult,
  updateRoundResult,
};
