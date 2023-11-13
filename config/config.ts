import "dotenv/config";

interface DbOptions {
  host: string | undefined;
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  port: number | undefined,
  dialect: string;
}

const devEnvironment: DbOptions = {
  host: process.env.DEV_DATABASE_HOST,
  username: process.env.DEV_DATABASE_USERNAME,
  password: process.env.DEV_DATABASE_PASSWORD,
  database: process.env.DEV_DATABASE_NAME,
  port: Number(process.env.DEV_DATABASE_PORT),
  dialect: "mysql"
};

const testEnvironment: DbOptions = {
  host: process.env.TEST_DATABASE_HOST,
  username: process.env.TEST_DATABASE_USERNAME,
  password: process.env.TEST_DATABASE_PASSWORD,
  database: process.env.TEST_DATABASE_NAME,
  port: Number(process.env.TEST_DATABASE_PORT),
  dialect: "mysql"
};

const prodEnvironment: DbOptions = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  dialect: "mysql"
};


module.exports = {
  development: devEnvironment,
  test: testEnvironment,
  production: prodEnvironment
}
