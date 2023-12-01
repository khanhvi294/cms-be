import db from "../models";
import roundResultService from "../services/roundResultService";

const importRoundResults = async () => {
  await roundResultService.createRoundResult(
    { studentId: 1, roundId: 1 },
    null
  );
};

export default importRoundResults;
