import {
	postgres_host,
	db_port,
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

let portDatabase;
if (db_port !== undefined) {
	portDatabase = parseInt(db_port);
}

const client = new Pool({
	host: postgres_host,
	database: databaseUsed,
	user: postgres_user,
	password: postgres_pass,
	port: portDatabase,
});

export default client;
