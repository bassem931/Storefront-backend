import client from "../../../Config/database";

export interface Product {
	id?: number;
	name: string;
	price: number;
	category: string;
}

//will be used to optimize perfomance later add product
const productspres = [];

export class productsClass {
	static index = async (): Promise<Product[] | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql query to database
		const sql = "SELECT * FROM products;";
		const result = await conn.query(sql);

		// release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number): Promise<Product | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql query to database
		const sql = "SELECT * FROM products WHERE id =($1);";
		const result = await conn.query(sql, [id]);

		// release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static sortByCategory = async (category: string): Promise<Product[] | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql query to database
		const sql = "SELECT * FROM products WHERE category = $1;";
		const result = await conn.query(sql, [category]);

		// release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static create = async (product: Product): Promise<string> => {
		//connect to database
		const conn = await client.connect();

		//send sql query to database
		const sql = "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *;";
		const result = await conn.query(sql, [product.name, product.price, product.category]);

		// release connection
		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			//change string price to number
			const numString = (result.rows[0] as unknown as Product).price;
			const num = parseFloat(numString as unknown as string);
			(result.rows[0] as unknown as Product).price = num;

			//send back product creation message
			return `product ${(result.rows[0] as unknown as Product).id} has been created`;
		}
	};

	static update = async (
		nameExist: number,
		priceExist: number,
		categoryExist: number,
		product: object,
		id: number,
	): Promise<Product | string> => {
		//connect to database
		const conn = await client.connect();

		//create sql string that will be concatenated based on request body defined parameters
		let sqlParams = "UPDATE products SET ";

		//updated message to send detailed response to user based on updated parameters
		let updateMessage = "";

		//commacount to track the number of parameters
		let commacount = 0;

		//check for name and add according to availability
		if (nameExist === 1) {
			sqlParams = sqlParams + "name=$1";
			updateMessage = updateMessage + "name ";
			commacount++;
		}

		//check for price and add according to availability
		if (priceExist === 1) {
			updateMessage = updateMessage + "price ";
			if (commacount === 0) {
				sqlParams = sqlParams + "price=$1";
			} else {
				if (commacount === 1) {
					sqlParams = sqlParams + " ,price=$2";
				}
			}
			commacount++;
		}

		//check for price and add according to availability
		if (categoryExist === 1) {
			updateMessage = updateMessage + "category ";
			if (commacount === 0) {
				sqlParams = sqlParams + "category=$1";
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

		//check request is not empty
		if (nameExist + priceExist + categoryExist === 0) {
			return "empty request body";
		}

		//concatenate to get correct sql query
		const sql = `${sqlParams} WHERE id=$${commacount} RETURNING *;`;

		//use spread operator to add id
		const productSpread = { ...product, id };

		//send sql query to database
		const result = await conn.query(sql, Object.values(productSpread));

		//release connection
		conn.release();

		//trim to remove extra space at end
		updateMessage = updateMessage.trim();

		//add commas to string and second replace to add and instead of comma using regex
		updateMessage = updateMessage.replace(/ /g, " ,").replace(/ ,(?=[^,]*$)/g, " and ");

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			// //change string price to number
			// const numString = (result.rows[0] as unknown as Product).price;
			// const num = parseFloat(numString as unknown as string);
			// (result.rows[0] as unknown as Product).price = num;

			// return result.rows[0];
			return `product ${id} updated successfully with ${updateMessage}`;
		}
	};

	static delete = async (id: number): Promise<Product | string> => {
		//connect to database
		const conn = await client.connect();

		//send sql query to database
		const sql = "DELETE FROM products WHERE id = ($1) RETURNING *";
		const result = await conn.query(sql, [id]);

		//release connection
		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return "product 1 deleted successfully";
		}
	};
}
