export const getAllStudentByClass = async (classId) => {
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  // const data = await db.Round.findOne({
  //   where: { id: roundId },
  //   raw: true,
  //   nest: true,
  //   include: [
  //     {
  //       model: db.Judge,
  //       as: "roundJudge",
  //     },
  //   ],
  //   order: [["updatedAt", "DESC"]],
  // });
  // if (data.roundJudge) {
  //   return resFindAll(data.roundJudge);
  // }

  const data = await db.Class.findAll({
    where: { classId: classId },
    raw: true,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Student,
        as: "ClassStudentStudent",
        attributes: ["fullName", "id"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return resFindAll(data);
};

export default { getAllStudentByClass };
