import moment from "moment";
import cron from "node-cron";
import db from '../models';
import { STATUS_COMPETITION, calculateDistanceFromDate } from "../utils/const";
import competitionService from "../services/competitionService";
import roundResultService from "../services/roundResultService";

const checkAndChangeStatusCompetitionCancel = async () => {
  try {
    const competitions = await db.Competition.findAll({
      where: {status: STATUS_COMPETITION.CREATED},
      nest: true,
      raw: false,
      include: [
        {
          model: db.Register,
          as: "competitionRegister",
          separate:true, 
          order: [
            ['createdAt', 'ASC']
          ],
         
        },
      ],
  
    });
    if(!competitions?.length) {
      return;
    }

    const competitionsChange = competitions.filter(competition => !competition?.competitionRegister || competition?.competitionRegister?.length < competition?.minimumQuantity);
  
    if(competitionsChange.length){
       try {
        await db.sequelize.transaction(async (t) => {
  
            const trans = [];
  
          // competition chua du so luong sinh vien
          competitionsChange.forEach((item) => {
            trans.push(competitionService.updateStatusCompetition(item.id, STATUS_COMPETITION.CANCEL, t))
          })

  
          await Promise.all(competitionsChange);
  
        })
       } catch (error) {
        console.log("error:: ", error);
       }
    }

  } catch (err) {
    console.log("error jobs:: ", err);
  }
}

const checkAndChangeStatusCompetitionEnded = async () => {
  try {
    const competitions = await db.Competition.findAll({
      where: {status: STATUS_COMPETITION.STARTED},
      nest: true,
      raw: false,
      include: [
        {
          model: db.Round,
          as: "competitionRound",
          separate:true, 
          order: [
            ['createdAt', 'ASC']
          ],
         
        },
      ],
  
    });
    if(!competitions?.length) {
      return;
    }

    const competitionsChange = competitions.filter(competition => calculateDistanceFromDate(new Date(), competition.timeEnd) <= 0);
    if(competitionsChange.length){
      try {
       await db.sequelize.transaction(async (t) => {
 
           const trans = [];
 
         // competition chua du so luong sinh vien
         competitionsChange.forEach((item) => {
           trans.push(competitionService.updateStatusCompetition(item.id, STATUS_COMPETITION.ENDED, t))
         })

 
         await Promise.all(competitionsChange);
 
       })
      } catch (error) {
       console.log("error:: ", error);
      }
   }
 
  } catch (err) {
    console.log("error jobs:: ", err);
  }
}


const checkAndChangeStatusCompetitionStarted = async () => {
  try{
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
  
          // competition du so luong sinh vien
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
  catch(err){
    console.log("error jobs:: ", err);
  }
  

}

const scheduleCron = async () => {
  const currentTime = moment();
  console.log("cron job runnnn: ", currentTime.format('YYYY-MM-DD HH:mm:ss'));
  checkAndChangeStatusCompetitionStarted();
  checkAndChangeStatusCompetitionCancel();
  checkAndChangeStatusCompetitionEnded();

};

export const task = cron.schedule("0 0 0 * * *", scheduleCron); // run every midnight
// export const task = cron.schedule("*/2 * * * * *", scheduleCron); // run every 2 seconds
// export const task = cron.schedule("*/2 * * * * ", scheduleCron); // run every 2 minutes

const taskSchedule = () => {
  console.log("Cron job already Started !!!");
  task.start();
  // checkAndChangeStatusCompetitionStarted();

};

export default taskSchedule;
