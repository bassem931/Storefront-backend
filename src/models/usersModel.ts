import client from "../../Config/database";

export interface User {
	id?: number;
	firstName: string;
	lastName: string;
	username: string;
	password: string;
}

export class usersClass {
	static index = async (): Promise<User[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM users;";
		const result = await conn.query(sql);
		//check for empty result

		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number) => {
		const conn = await client.connect();
		const sql = "SELECT * FROM users WHERE id =($1);";
		const result = await conn.query(sql, [id]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (user: User) => {
		const conn = await client.connect();
		const sql = "INSERT into users VALUES ($1,$2,$3,$4) RETURNING *;";
		const result = await conn.query(sql, [
			user.firstName,
			user.lastName,
			user.username,
			user.password,
		]);
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
		user: User,
		id: number,
	) => {
		const conn = await client.connect();
		const sqlinit = "UPDATE users SET";

		let sqlParams;
		let commacount = 0;

		if (firstnameExist === 1) {
			sqlParams = "first_name = $(1)";
			commacount++;
		}

		if (lastnameExist === 1) {
			if (commacount === 0) {
				sqlParams = "last_name = $(1)";
			} else {
				if (commacount === 1) {
					sqlParams = ",last_name = $(2)";
				}
			}
			commacount++;
		}

		if (usernameExist === 1) {
			if (commacount === 0) {
				sqlParams = "username = $(1)";
			} else {
				if (commacount === 1) {
					sqlParams = ",username = $(2)";
				} else if (commacount === 2) {
					sqlParams = ",username = $(3)";
				}
			}
			commacount++;
		}

		if (passwordExist === 1) {
			if (commacount === 0) {
				sqlParams = "password = $(1)";
			} else {
				if (commacount === 1) {
					sqlParams = ",password = $(2)";
				} else if (commacount === 2) {
					sqlParams = ",password = $(3)";
				} else if (commacount === 3) {
					sqlParams = ",password = $(4)";
				}
			}
			commacount++;
		}

		const sql = `${sqlinit} ${sqlParams} WHERE id=$(${commacount});`;

		const result = await conn.query(sql, [user]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static delete = async (id: number) => {
		const conn = await client.connect();
		const sql = "DELETE FROM users WHERE id = ($1)";
		const result = await conn.query(sql, [id]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};
}
