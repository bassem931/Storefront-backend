import client from "../../Config/database";

export interface Product {
	id?: number;
	name: string;
	price: number;
	category: string;
}

export class usersClass {
	static index = async (): Promise<Product[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM products;";
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
		const sql = "SELECT * FROM products WHERE id =($1);";
		const result = await conn.query(sql, [id]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (product: Product) => {
		const conn = await client.connect();
		const sql = "INSERT into products VALUES ($1,$2,$3,$4) RETURNING *;";
		const result = await conn.query(sql, [product.name, product.price, product.category]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static update = async (
		nameExist: number,
		priceExist: number,
		categoryExist: number,
		product: Product,
		id: number,
	) => {
		const conn = await client.connect();
		const sqlinit = "UPDATE products SET";

		let sqlParams;
		let commacount = 0;

		if (nameExist === 1) {
			sqlParams = "first_name = $(1)";
			commacount++;
		}

		if (priceExist === 1) {
			if (commacount === 0) {
				sqlParams = "last_name = $(1)";
			} else {
				if (commacount === 1) {
					sqlParams = ",last_name = $(2)";
				}
			}
			commacount++;
		}

		if (categoryExist === 1) {
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

		//comma count represent the number of params in update so it can be used
		const sql = `${sqlinit} ${sqlParams} WHERE id=$(${commacount});`;

		const result = await conn.query(sql, [product, id]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static delete = async (id: number) => {
		const conn = await client.connect();
		const sql = "DELETE FROM products WHERE id = ($1)";
		const result = await conn.query(sql, [id]);
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};
}
