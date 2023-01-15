import client from "../../../Config/database";

export interface Product {
	id?: number;
	name: string;
	price: number;
	category: string;
}

export class productsClass {
	static index = async (): Promise<Product[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM products;";
		const result = await conn.query(sql);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number): Promise<Product | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM products WHERE id =($1);";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (product: Product): Promise<Product | string> => {
		const conn = await client.connect();
		const sql = "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *;";
		const result = await conn.query(sql, [product.name, product.price, product.category]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			//change string price to number
			const numString = (result.rows[0] as unknown as Product).price;
			const num = parseFloat(numString as unknown as string);
			(result.rows[0] as unknown as Product).price = num;

			return result.rows[0];
		}
	};

	static update = async (
		nameExist: number,
		priceExist: number,
		categoryExist: number,
		product: object,
		id: number,
	): Promise<Product | string> => {
		const conn = await client.connect();
		const sqlinit = "UPDATE products SET";

		let sqlParams;
		let commacount = 0;

		if (nameExist === 1) {
			sqlParams = "name=$1";
			commacount++;
		}

		if (priceExist === 1) {
			if (commacount === 0) {
				sqlParams = "price=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,price=$2";
				}
			}
			commacount++;
		}

		if (categoryExist === 1) {
			if (commacount === 0) {
				sqlParams = "category=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,category=$2";
				} else if (commacount === 2) {
					sqlParams = sqlParams + " ,category=$3";
				}
			}
			commacount++;
		}

		//to correctly place id placeholder value
		commacount++;

		const sql = `${sqlinit} ${sqlParams} WHERE id=$${commacount} RETURNING *;`;

		//spread operators
		const productSpread = { ...product, id };

		const result = await conn.query(sql, Object.values(productSpread));

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			//change string price to number
			const numString = (result.rows[0] as unknown as Product).price;
			const num = parseFloat(numString as unknown as string);
			(result.rows[0] as unknown as Product).price = num;

			return result.rows[0];
		}
	};

	static delete = async (id: number): Promise<Product | string> => {
		const conn = await client.connect();
		const sql = "DELETE FROM products WHERE id = ($1) RETURNING *";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static sortByCategory = async (category: string): Promise<Product[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM products WHERE category = $1;";
		const result = await conn.query(sql, [category]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};
}
