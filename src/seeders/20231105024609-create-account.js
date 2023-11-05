// "use strict";
// import passwordUtil from "../utils/password";
import { ROLES } from "../utils/const";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    // const hashPassword = await passwordUtil.generateHashPassword("123123");
    const hashPassword = "123123";

    await queryInterface.bulkInsert(
      "Accounts",
      [
        {
          email: "admin@gmail.com",
          password: hashPassword,
          role: 2,
          // Employee: {
          //   fullName: "Admin ",
          //   cccd: "123123123",
          // },
        },
      ],
      {
        // include: [Students, Employees],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Accounts", null, {});
  },
};
