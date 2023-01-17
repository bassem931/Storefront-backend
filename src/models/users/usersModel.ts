import client from "../../../Config/database";
import bcrypt from "bcrypt";
import { passBcrypt, saltRounds } from "../../../Config/envConfig";

// User naming not following camelCase to be same name format as database
//all variables other than variables related to database is database
//for database variables the convention is to use underscore
export interface User {
	id?: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
}

//create user class
export class usersClass {
	//get all users
	static index = async (): Promise<User[] | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql to database to get all users
		const sql = "SELECT * FROM users;";
		const result = await conn.query(sql);

		//release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number): Promise<User | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql to database to get user
		const sql = "SELECT * FROM users WHERE id =($1);";
		const result = await conn.query(sql, [id]);

		//release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (user: User): Promise<User | string> => {
		//connect to database
		const conn = await client.connect();

		let hash;
		//hash for password

		//perform hashing function using salt and pepper
		try {
			hash = await bcrypt.hash(user.password + passBcrypt, parseInt(saltRounds as string));
		} catch (err) {
			return "hash error";
		}

		//send sql to database to create user
		const sql =
			"INSERT INTO users (first_name,last_name,username,password) VALUES ($1,$2,$3,$4) RETURNING *;";
		const result = await conn.query(sql, [user.first_name, user.last_name, user.username, hash]);

		//release connection
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
	): Promise<string> => {
		//connect to database
		const conn = await client.connect();

		//create sql string that will be concatenated based on request body defined parameters
		let sqlParams = "UPDATE users SET ";

		//updated message to send detailed response to user based on updated parameters
		let updateMessage = "";

		//commacount to track the number of parameters
		let commacount = 0;

		//check for first name and add according to availability
		if (firstnameExist === 1) {
			sqlParams = sqlParams + "first_name=$1";
			updateMessage = updateMessage + "first_name ";
			commacount++;
		}

		//check for last name and add according to availability
		if (lastnameExist === 1) {
			updateMessage = updateMessage + "last_name ";
			if (commacount === 0) {
				sqlParams = sqlParams + "last_name=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,last_name=$2";
				}
			}
			commacount++;
		}

		//check for user name and add according to availability
		if (usernameExist === 1) {
			updateMessage = updateMessage + "username ";
			if (commacount === 0) {
				sqlParams = sqlParams + "username=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,username=$2";
				} else if (commacount === 2) {
					sqlParams = sqlParams + " ,username=$3";
				}
			}
			commacount++;
		}

		//check for password and add according to availability
		if (passwordExist === 1) {
			updateMessage = updateMessage + "password ";
			if (commacount === 0) {
				sqlParams = sqlParams + "password=$1";
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

		if (firstnameExist + lastnameExist + usernameExist + passwordExist === 0) {
			return "empty request body";
		}

		//concatenate to get correct sql query
		const sql = `${sqlParams} WHERE id=$${commacount} RETURNING *;`;

		//use spread operator to add id
		const userSpread = { ...user, id };

		//send sql query to database
		const result = await conn.query(sql, Object.values(userSpread));

		//release connection
		conn.release();

		//trim updatemessage
		updateMessage = updateMessage.trim();

		//add commas to string and second replace to add and instead of comma using regex
		updateMessage = updateMessage.replace(/ /g, " ,").replace(/ ,(?=[^,]*$)/g, " and ");

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return `user ${id} updated successfully with ${updateMessage}`;
		}
	};

	static delete = async (id: number): Promise<string> => {
		//connect to database
		const conn = await client.connect();

		//send sql to database to delete user
		const sql = "DELETE FROM users WHERE id = ($1) RETURNING *";
		const result = await conn.query(sql, [id]);

		//release connection
		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return `user ${id} deleted successfully`;
		}
	};

	static signInUser = async (username: string, password: string): Promise<string | User> => {
		//connect to database
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

			//use bcrypt to compare hash to confirm password is correct
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
