import db from '../models';
import {Op} from 'sequelize';
import { ROLES, resFindAll } from '../utils/const';


const getOverviewModel = async (model = "Students", condition={}, options ={}) => {
    const currentDate = new Date()
    const queryCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const queryCurrentWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    )
    const queryCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    const [currentMonth, currentWeek, currentDay, total] = await Promise.all([
        db[model].count({
          where: {
            createdAt: {
                [Op.gt]: queryCurrentMonth
            },
            ...condition
          },
          ...options
        }),
        db[model].count({
          where: {
            createdAt: {
              [Op.gt]: queryCurrentWeek
            }
          },
          ...options
        }),
        db[model].count({
          where: {
            createdAt: {
              [Op.gt]: queryCurrentDay
            },
          ...condition

          },
          ...options

        }),
        db[model].count({
            where: {
            ...condition
            },
            ...options
        })
      ])

      return {
        month: currentMonth,
        week: currentWeek,
        day: currentDay,
        total: total
      }
}

const getOerviewAll = async () => {
    const classPromise = getOverviewModel("Class")
    const studentPromise = getOverviewModel("Students")
    const employeePromise = getOverviewModel("Employee",{},
    {
        include: [
            {
                model: db.Account,
				as: 'accountEmployee',
                where: {
                    role: ROLES.EMPLOYEE
                }
            }
        ]
    })
    const teacherPromise = getOverviewModel("Employee",{},
    {
        include: [
            {
                model: db.Account,
				as: 'accountEmployee',
                where: {
                    role: ROLES.TEACHER
                }
            }
        ]
    })
    const coursePromise = getOverviewModel("Course")
    const competitionPromise = getOverviewModel("Competition")

    const [classOverview, studentOverview
        , employeeOverview, teacherOverview
        , courseOverview, competitionOverview] = await Promise.all([classPromise, studentPromise,
        employeePromise, teacherPromise, coursePromise, competitionPromise])

    return {
        class: classOverview,
        student: studentOverview,
        employee: employeeOverview,
        teacher: teacherOverview,
        course: courseOverview,
        competition: competitionOverview
    }
}

export const filterModelByDate = async (model="Students",from = '2023-01-01', to = new Date(), condition={}, options={}) => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    console.log('from ', fromDate, toDate)

    const result = await db[model].findAll({
        where: {
            [Op.gte]: from,
            [Op.lte]: to,
            ...condition
        },
         order: [["createdAt", "DESC"]],
        ...options
    })

    return resFindAll(result)
}

export default {
    getOverviewModel,
    getOerviewAll,filterModelByDate
}


