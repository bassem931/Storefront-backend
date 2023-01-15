import client from "../../../Config/database";
// import { Order } from "../../orders/orderModel";
// import { OrdersProducts } from "../order-products/order_productsModel";

export class orderServices {
	static activeOrders = async (userId: number) => {
		const conn = await client.connect();
		const sql =
			"SELECT order_id,product_id,quantity FROM orders INNER JOIN order_products ON orders.id = order_products.order_id WHERE order_status= 'active' AND user_id=$1 ORDER BY product_id ASC;";
		const result = await conn.query(sql, [userId]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static completedOrders = async (userId: number) => {
		const conn = await client.connect();
		const sql =
			"SELECT order_id,product_id,quantity FROM orders INNER JOIN order_products ON orders.id = order_products.order_id WHERE order_status= 'completed' AND user_id=$1 ORDER BY product_id ASC;";
		const result = await conn.query(sql, [userId]);

		conn.release();

		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};
}
