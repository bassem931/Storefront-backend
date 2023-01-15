import { PoolClient } from "pg";
import client from "../../../Config/database";

export interface OrdersProducts {
	id?: number;
	order_id: number;
	product_id: number;
	quantity: number;
}

//helper functions

//update from addproduct that adds quantities
const updateFromAdd = async (orderDetails: OrdersProducts, conn: PoolClient): Promise<string> => {
	const sql =
		"UPDATE order_products SET quantity = quantity + $1 WHERE order_id =$2 AND product_id =$3 ;";

	const result = await conn.query(sql, [
		orderDetails.quantity,
		orderDetails.order_id,
		orderDetails.product_id,
	]);

	//check for empty result
	if (result.rowCount === 0) {
		return "not found create it";
	} else {
		return "product found";
	}
};

//order_products class
export class ordersProductsClass {
	static index = async (): Promise<OrdersProducts[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM order_products;";
		const result = await conn.query(sql);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	//return all products in an order
	static getOrderProducts = async (order_id: number): Promise<OrdersProducts[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM order_products WHERE order_id =($1);";
		const result = await conn.query(sql, [order_id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static addProduct = async (orderDetails: OrdersProducts) => {
		const conn = await client.connect();

		const ifUpdate = await updateFromAdd(orderDetails, conn);

		//if result not empty add quantities
		if (ifUpdate === "product found") {
			return `product updated`;
		} else {
			//insert new product to order
			const sql =
				"INSERT INTO order_products (order_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *;";

			const result = await conn.query(sql, [
				orderDetails.order_id,
				orderDetails.product_id,
				orderDetails.quantity,
			]);

			conn.release();

			//check for empty result
			if (result.rowCount === 0) {
				return "empty";
			} else {
				return `product number ${result.rows[0].product_id} created in order ${result.rows[0].order_id}`;
			}
		}
	};

	static updateProduct = async (orderDetails: OrdersProducts): Promise<OrdersProducts | string> => {
		const conn = await client.connect();
		const sql =
			"UPDATE order_products SET quantity = $1 WHERE order_id =$2 AND product_id =$3 RETURNING *;";

		const result = await conn.query(sql, [
			orderDetails.quantity,
			orderDetails.order_id,
			orderDetails.product_id,
		]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "order not found in database";
		} else {
			return `product number ${result.rows[0].product_id} updated in order ${result.rows[0].order_id}`;
		}
	};

	static deleteProduct = async (
		order_id: number,
		product_id: number,
	): Promise<OrdersProducts | string> => {
		const conn = await client.connect();
		const sql = "DELETE FROM order_products WHERE order_id =$1 AND product_id =$2 RETURNING *;";

		const result = await conn.query(sql, [order_id, product_id]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "order not found in database";
		} else {
			return `product number ${result.rows[0].product_id} deleted from order ${result.rows[0].order_id}`;
		}
	};

	// static showProduct = async (product_id: number): Promise<OrdersProducts[] | string> => {
	// 	const conn = await client.connect();
	// const sqlinit = "SELECT id FROM orders_products WHERE order_id =($1) AND product_id =$2 ;";
	// const resGet = await conn.query(sqlinit, [orderDetails.order_id, orderDetails.product_id]);
	// 	//check for empty result
	// 	if (result.rowCount === 0) {
	// 		return "empty";
	// 	} else {
	// 		return result.rows;
	// 	}
	// };

	// static showProductTotal = async (product_id: number): Promise<OrdersProducts | string> => {
	// 	const conn = await client.connect();
	// 	const sql =
	// 		'SELECT product_id,(SUM(quantity)) AS "Total quantity"  FROM orders_products WHERE product_id =($1);';
	// 	const result = await conn.query(sql, [product_id]);
	// 	//check for empty result
	// 	if (result.rowCount === 0) {
	// 		return "empty";
	// 	} else {
	// 		return result.rows[0];
	// 	}
	// };
}
