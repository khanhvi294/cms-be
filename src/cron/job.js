import moment from "moment";
import cron from "node-cron";
import db from '../models';
import { STATUS_COMPETITION, calculateDistanceFromDate } from "../utils/const";
import competitionService from "../services/competitionService";
import roundResultService from "../services/roundResultService";

const checkAndChangeStatusCompetition = async () => {
  const competitions = await db.Competition.findAll({
    where: {status: STATUS_COMPETITION.CREATED},
    nest: true,
    raw: false,
    include: [
      {
        model: db.Round,
        as: "competitionRound",
        separate:true, 
        order: [
          ['timeStart', 'ASC']
        ],
       
      },
    ],

  });
  if(!competitions?.length) {
    return;
  }

  const competitionsChange = competitions.filter(competition => (calculateDistanceFromDate(new Date(), competition.timeStart) <= 2) && competition.competitionRound.length);

  if(competitionsChange.length){
     try {
      await db.sequelize.transaction(async (t) => {

          const trans = [];

        competitionsChange.forEach((item) => {
          trans.push(competitionService.updateStatusCompetition(item.id, STATUS_COMPETITION.STARTED, t))
          trans.push(roundResultService.tmpCreateRounds({
            roundId: item?.competitionRound[0].id,
            competitionId: item.id,
          }))
        })

        await Promise.all(competitionsChange);

      })
     } catch (error) {
      console.log("error:: ", error);
     }
  }

}

const scheduleCron = async () => {
  const currentTime = moment();
  console.log("cron job runnnn: ", currentTime.format('YYYY-MM-DD HH:mm:ss'));
  checkAndChangeStatusCompetition();

};

export const task = cron.schedule("0 0 0 * * *", scheduleCron); // run every midnight
// export const task = cron.schedule("*/2 * * * * *", scheduleCron); // run every 2 seconds
// export const task = cron.schedule("*/2 * * * * ", scheduleCron); // run every minutes

const taskSchedule = () => {
  console.log("Cron job already Started !!!");
  task.start();
  // checkAndChangeStatusCompetition();

};

export default taskSchedule;
