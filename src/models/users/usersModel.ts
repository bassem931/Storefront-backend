import client from "../../../Config/database";
import bcrypt from "bcrypt";
import { passBcrypt, saltRounds } from "../../../Config/envConfig";

// User naming not following camelCase to be same name format as database
export interface User {
	id?: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
}

export class usersClass {
	static index = async (): Promise<User[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM users;";
		const result = await conn.query(sql);

		conn.release();
		//check for empty result

		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number): Promise<User | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM users WHERE id =($1);";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (user: User): Promise<User | string> => {
		const conn = await client.connect();

		let hash;
		//hash for password
		try {
			hash = await bcrypt.hash(user.password + passBcrypt, parseInt(saltRounds as string));
		} catch (err) {
			return "hash error";
		}

		const sql =
			"INSERT INTO users (first_name,last_name,username,password) VALUES ($1,$2,$3,$4) RETURNING *;";
		const result = await conn.query(sql, [user.first_name, user.last_name, user.username, hash]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static update = async (
		firstnameExist: number,
		lastnameExist: number,
		usernameExist: number,
		passwordExist: number,
		user: object,
		id: number,
	): Promise<User | string> => {
		const conn = await client.connect();
		const sqlinit = "UPDATE users SET";

		let sqlParams;
		let commacount = 0;

		if (firstnameExist === 1) {
			sqlParams = "first_name=$1";
			commacount++;
		}

		if (lastnameExist === 1) {
			if (commacount === 0) {
				sqlParams = "last_name=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,last_name=$2";
				}
			}
			commacount++;
		}

		if (usernameExist === 1) {
			if (commacount === 0) {
				sqlParams = "username=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,username=$2";
				} else if (commacount === 2) {
					sqlParams = sqlParams + " ,username=$3";
				}
			}
			commacount++;
		}

		if (passwordExist === 1) {
			if (commacount === 0) {
				sqlParams = "password=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,password=$2";
				} else if (commacount === 2) {
					sqlParams = sqlParams + " ,password=$3";
				} else if (commacount === 3) {
					sqlParams = sqlParams + " ,password=$4";
				}
				commacount++;
			}
		}

		//to correctly place id placeholder value
		commacount++;

		const sql = `${sqlinit} ${sqlParams} WHERE id=$${commacount} RETURNING *;`;

		//spread operators
		const userSpread = { ...user, id };

		const result = await conn.query(sql, Object.values(userSpread));

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static delete = async (id: number): Promise<User | string> => {
		const conn = await client.connect();
		const sql = "DELETE FROM users WHERE id = ($1) RETURNING *";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static signInUser = async (username: string, password: string): Promise<string | User> => {
		const conn = await client.connect();

		//search for a user with same name and password and get password
		const sql = "SELECT * FROM users WHERE username=$1 ;";

		const result = await conn.query(sql, [username]);

		conn.release();

		//if empty no user with such username
		if (result.rowCount === 0) {
			return "no user with such username";
		} else {
			const passwordFound = result.rows[0].password;

			try {
				bcrypt.compare(password + passBcrypt, passwordFound.password, (err, resultHash) => {
					if (resultHash === false) {
						return "password incorrect";
					}
				});
			} catch (err) {
				return err as string;
			}

			//password is correct return user
			return result.rows[0];
		}
	};
}
