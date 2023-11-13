import { sequelize } from "./config/database";
import { redisClient } from "./src/utils";

beforeAll(async () => {
  await sequelize.authenticate();
  jest.mock("redis", () => ({
    createClient: jest.fn().mockReturnValue({
      multi: jest.fn(),
      sAdd: jest.fn(),
      expire: jest.fn(),
      exec: jest.fn(),
      sIsMember: jest.fn(),
    }),
  }));
});

afterAll(async () => {
  await sequelize.close();
  await redisClient.quit();
  jest.clearAllMocks();
});
