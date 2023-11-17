import db from "../models";

const createCompetitionClass = async (data) => {
  const result = await db.CompetitionClass.create({
    competitionId: data.competitionId,
    classId: data.classId,
  });
  return result;
};

export default {
  createCompetitionClass,
};
