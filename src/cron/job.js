import cron from "node-cron";

const scheduleCron = async () => {};

export const task = cron.schedule("0 0 0 * * *", scheduleCron);

const taskSchedule = () => {
  task.start();
};

export default taskSchedule;
