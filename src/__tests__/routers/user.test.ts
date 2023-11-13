import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { faker } from "@faker-js/faker";

import app from "../../app";
import { generateToken } from "../../utils";
import { UserRoleEnum } from "../../../models";

const server = request(app);

let token: string;

const user1 = {
  id: faker.string.uuid(),
  firstname: faker.string.sample(),
  lastname: faker.string.sample(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRoleEnum.USER,
};

beforeAll(() => {
  const user = {
    id: user1.id,
    firstname: user1.firstname,
    lastname: user1.lastname,
    email: user1.email,
    role: user1.role,
  };
  token = generateToken(user);
});

describe("Test POST /api/users/create", () => {
  it("Should create User representative successfully", async () => {
    const res = await server
      .post("/api/v1/users/create")
      .set({ authorization: `Bearer ${token}` })
      .send(user1);
      
    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body.id).toBeDefined();
    expect(res.body.message).toBe("User created successfully.");
  });
});

describe("Test POST /api/v1/auth/login", () => {
    it("Should generate token for correct credentials", async () => {
      const res = await server.post("/api/v1/users/login").send({
        email: "john.doe@example.com",
        password: "john",
      });
  
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe("success");
      expect(res.body.token).toBeDefined();
    });
  
    it("Should response with 'Invalid email or password' message for wrong credentials", async () => {
      const res = await server.post("/api/v1/users/login").send({
        email: "john.doe@example.com",
        password: "johns",
      });

      expect(res.body.token).not.toBeDefined();
    });

  });