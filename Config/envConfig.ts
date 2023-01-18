import dotenv from "dotenv";

dotenv.config();

export const {
	port,
	postgres_host,
	db_port,
	postgres_db,
	postgres_db_test,
	postgres_user,
	postgres_pass,
	env,
	passBcrypt,
	saltRounds,
	tokenPass,
} = process.env;
