import client from "../../../Config/database";

export class productServices {
	//this fucntion returns the most popular based on the number it is ordered
	//in case of tie in numbers ordered quantity to order based on it
	static fiveMostPopular = async () => {
		const conn = await client.connect();

		const sql =
			"SELECT product_id,COUNT(product_id) AS times_ordered ,SUM(quantity) AS amount_order FROM products INNER JOIN order_products ON products.id = order_products.product_id GROUP BY product_id ORDER BY times_ordered DESC, amount_order DESC;";
		const result = await conn.query(sql);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};
}
