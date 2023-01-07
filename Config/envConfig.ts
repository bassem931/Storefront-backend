import dotenv from "dotenv";

dotenv.config();

export const {
	port,
	postgres_host,
	postgres_db,
	postgres_db_test,
	postgres_user,
	postgres_pass,
	env,
} = process.env;
