import client from "../../../Config/database";

export enum order_status_type {
	active = "active",
	completed = "completed",
}

Object.freeze(order_status_type);

export interface Order {
	id?: number;
	user_id: number;
	order_status: order_status_type;
}

export class ordersClass {
	static index = async (): Promise<Order[] | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM orders;";
		const result = await conn.query(sql);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows;
		}
	};

	static show = async (id: number): Promise<Order | string> => {
		const conn = await client.connect();
		const sql = "SELECT * FROM orders WHERE id =($1);";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static create = async (order: Order): Promise<Order | string> => {
		//connect to database
		const conn = await client.connect();

		//search for user by using user_id in order
		const maxIdRes = await conn.query("SELECT * FROM users WHERE id=$1;", [order.user_id]);

		if (maxIdRes.rowCount === 0) {
			return "user not found";
		}

		const sql = "INSERT INTO orders (user_id,order_status) VALUES ($1,$2) RETURNING * ;";

		const result = await conn.query(sql, [order.user_id, order.order_status]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	//update order changes status from active to completed or vice versa
	static update = async (order_status: order_status_type, id: number): Promise<Order | string> => {
		const conn = await client.connect();

		if (
			!(order_status === order_status_type.active || order_status === order_status_type.completed)
		) {
			return "wrong input";
		}

		const sql = "UPDATE orders SET order_status=$1 WHERE id=$2 RETURNING *;";

		const result = await conn.query(sql, [order_status, id]);

		conn.release();

		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	static delete = async (id: number): Promise<Order | string> => {
		const conn = await client.connect();
		const sql = "DELETE FROM orders WHERE id = ($1) RETURNING *";
		const result = await conn.query(sql, [id]);

		conn.release();
		//check for empty result
		if (result.rowCount === 0) {
			return "empty";
		} else {
			return result.rows[0];
		}
	};

	// if ((result.rows[0] as string).includes("violates foreign key constraint")) {
	// }
}
