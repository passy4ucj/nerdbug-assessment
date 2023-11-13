import { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";
import { UserRoleEnum } from "../models";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    const hashedPassword1 = await bcrypt.hash("john", 10);
    const hashedPassword2 = await bcrypt.hash("test1234", 10);

    try {
      await queryInterface.bulkInsert("Users", [
        {
          id: "5eae1d74-5275-11ee-a8cd-08920430c60a",
          firstname: "John",
          lastname: "Doe",
          password: hashedPassword1,
          role: UserRoleEnum.USER,
          email: "john.doe@example.com",
        },
        {
          id: "5eae1d74-5275-11ee-a8cd-08920430c4g7",
          firstname: "Jerry",
          lastname: "Tom",
          password: hashedPassword2,
          role: UserRoleEnum.ADMIN,
          email: "test@example.com",
        },
      ]);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  },
  async down(queryInterface: QueryInterface) {
    queryInterface.bulkDelete(
      "Users",
      { email: "john.doe@example.com" },
      {}
    );
  },
};
