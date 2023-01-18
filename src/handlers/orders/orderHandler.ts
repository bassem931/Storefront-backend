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
	app.get("/orders", authenticate, index); //should be admin
	app.get("/users/:userId/order/:orderId", authenticateOrder, show);
	app.post("/users/:userId/order/", authenticateUser, create);
	app.patch("/users/:userId/order/:orderId", authenticateOrder, update);
	app.delete("/users/:userId/order/:orderId", authenticateOrder, remove);
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
	let indexCall;

	// all model function
	try {
		indexCall = await ordersClass.index();
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof indexCall === "string") {
		if ((indexCall as string) === "empty") {
			return res.status(404).json("Orders not found in database ,database is probably empty");
		}
	}

	return res.status(200).json(indexCall);
};

const show = async (req: Request, res: Response): Promise<express.Response> => {
	//get order id from url
	const orderId = req.params.orderId;

	//check order id is a number
	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	let showCall;

	//call model function
	try {
		showCall = await ordersClass.show(parseInt(orderId));
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof showCall === "string") {
		if ((showCall as string) === "empty") {
			return res.status(404).json("order not found in database");
		}
	}

	return res.status(200).json(showCall);
};

//only user id is needed and it will be passed as a param
const create = async (req: Request, res: Response): Promise<express.Response> => {
	//get user id from url
	const userId = req.params.userId;

	//check user id
	const checkUserId = await numberChecker(userId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	//create order object from query parameters
	const order: Order = {
		user_id: parseInt(userId),
		order_status: order_status_type.active,
	};

	let createCall;

	//call model function
	try {
		createCall = await ordersClass.create(order);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if ((createCall as string) === "empty") {
		return res.status(404).json("order not found in database");
	}

	if ((createCall as string) === "user not found") {
		return res.status(404).json("The user id belongs to a user that does not exist");
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

	//return token
	return res.status(200).json(authToken);
};

const update = async (req: Request, res: Response): Promise<express.Response> => {
	//get order status from body and order id from url
	let orderStatus: order_status_type = req.body.order_status;
	const orderId = req.params.orderId;

	//check order id is a number
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

	let updateCall;

	//call model function
	try {
		updateCall = await ordersClass.update(orderStatus, parseInt(orderId));
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if ((updateCall as string) === "empty") {
		return res.status(404).json("order not found in database");
	}
	if ((updateCall as string) === "wrong input") {
		return res.status(404).json("wrong order status input");
	}

	//verify old token to get back the user id
	const oldToken = await getToken(req);

	//if string and not jwt.payload then return error
	if (typeof oldToken === "string") {
		return res.status(401).json(`${oldToken}`);
	}

	//get user id from decoded
	const tokenUserID: number = oldToken.user_id;

	//create new token with order id to authenticate order belong to user
	const newToken = jwt.sign(
		{
			order_status: orderStatus,
			order_id: (updateCall as Order).id,
			user_id: tokenUserID,
			userType: "normal",
		},
		tokenPass as string,
	);

	//pass updated token
	return res.status(200).json(newToken);
};

const remove = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.params.orderId;

	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	try {
		//call model function
		const indexCall = await ordersClass.delete(parseInt(orderId));

		//check output is not empty
		if ((indexCall as string) === "empty") {
			return res.status(404).json("order not found in orders database so it cannot be deleted");
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};
