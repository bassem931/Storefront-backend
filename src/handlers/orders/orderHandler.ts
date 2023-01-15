import express, { Request, Response } from "express";
import {
	authenticate,
	authenticateOrder,
	authenticateUser,
	getToken,
} from "../../middlewares/authUser";
import { ordersClass, Order, order_status_type } from "../../models/orders/orderModel";
import jwt from "jsonwebtoken";
import { tokenPass } from "../../../Config/envConfig";

//handler fucntion
export const orderhandler = (app: express.Application) => {
	app.get("/order", authenticate, index); //should be admin
	app.get("/users/:userid/order/:orderid", authenticateOrder, show);
	app.post("/users/:userid/order/", authenticateUser, create);
	app.patch("/users/:userid/order/:orderid", authenticateOrder, update);
	app.delete("/users/:userid/order/:orderid", authenticateOrder, remove);
};

//helper functions
const numberChecker = async (
	num: string,
	property: string,
	res: Response,
): Promise<string | Response> => {
	//check number is defined
	if (num === undefined) {
		return res.status(404).json(`${property} is not defined`);
	}

	//check order id is a number
	if (Number.isNaN(parseInt(num))) {
		return res.status(400).json(`${property} is not a number`);
	}

	//check that order id number is not equal 0
	else if (parseInt(num) < 0) {
		return res.status(400).json(`${property} cannot be a negative number`);
	} else {
		return "number";
	}
};

const index = async (req: Request, res: Response): Promise<express.Response> => {
	try {
		const indexCall = await ordersClass.index();

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res.status(404).json("Orders not found in database ,database is probably empty");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const show = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.params.orderid;

	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	try {
		const showCall = await ordersClass.show(parseInt(orderId));

		//check output is not empty
		if (typeof showCall === "string") {
			if ((showCall as string) === "empty") {
				return res.status(404).json("order not found in database");
			}
		}

		return res.status(200).json(showCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

//only user id is needed and it will be passed as a param
const create = async (req: Request, res: Response): Promise<express.Response> => {
	const userId = req.params.userid;

	const checkUserId = await numberChecker(userId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	//create order object from query parameters
	const order: Order = {
		user_id: parseInt(userId),
		order_status: order_status_type.active,
	};

	try {
		const createCall = await ordersClass.create(order);

		//check output is not empty
		if (typeof createCall === "string") {
			if ((createCall as string) === "empty") {
				return res.status(404).json("order not found in database");
			}

			if ((createCall as string) === "user not found") {
				return res.status(404).json("The user id belongs to a user that does not exist");
			}
		}

		//create new token with order id to authenticate order belong to user
		const authToken = jwt.sign(
			{
				order_status: order_status_type.active,
				order_id: (createCall as Order).id,
				user_id: parseInt(userId),
				userType: "normal",
			},
			tokenPass as string,
		);

		return res.status(200).json(authToken);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const update = async (req: Request, res: Response): Promise<express.Response> => {
	let orderStatus: order_status_type = req.body.order_status;
	const orderId = req.params.orderid;

	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	//defined check will create value of complete status as this is the main use of the update
	if (orderStatus === undefined) {
		orderStatus = order_status_type.completed;
	}
	//check query params are strings
	if (typeof orderStatus !== "string") {
		return res.status(400).json("orderStatus is not a string");
	}

	try {
		const updateCall = await ordersClass.update(orderStatus, parseInt(orderId));

		//check output is not empty
		if (typeof updateCall === "string") {
			if ((updateCall as string) === "empty") {
				return res.status(404).json("order not found in database");
			}
			if ((updateCall as string) === "wrong input") {
				return res.status(404).json("wrong order status input");
			}
		}

		//verify old token to get back the user id
		const oldToken = await getToken(req);

		if (typeof oldToken === "string") {
			return res.status(401).json(`${oldToken}`);
		}

		const tokenUserID: number = oldToken.user_id;
		//create new token with order id to authenticate order belong to user
		const newToken = jwt.sign(
			{
				order_status: order_status_type.completed,
				order_id: (updateCall as Order).id,
				user_id: tokenUserID,
				userType: "normal",
			},
			tokenPass as string,
		);

		//pass updated token
		return res.status(200).json(newToken);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const remove = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.params.orderid;

	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	try {
		const indexCall = await ordersClass.delete(parseInt(orderId));

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res.status(404).json("order not found in orders database so it cannot be deleted");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};
