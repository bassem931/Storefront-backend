import {
	postgres_host,
	postgres_db,
	postgres_db_test,
	postgres_user,
	postgres_pass,
	env,
} from "./envConfig";
import { Pool } from "pg";

let databaseUsed: string | undefined = "";

if (env === "dev") {
	databaseUsed = postgres_db;
}
//can be overwritten in scripts
if (env === "test") {
	databaseUsed = postgres_db_test;
}

const client = new Pool({
	host: postgres_host,
	database: databaseUsed,
	user: postgres_user,
	password: postgres_pass,
});

export default client;
