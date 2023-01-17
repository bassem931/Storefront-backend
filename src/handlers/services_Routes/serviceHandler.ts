import express, { Request, Response } from "express";
import { authenticate, authenticateUser } from "../../middlewares/authUser";
import { orderServices } from "../../services/orderService/orderService";
import { productServices } from "../../services/productService/productService";

//handler fucntion
export const servicesHandler = (app: express.Application) => {
	app.get("/users/:userId/active", authenticateUser, activeOrders);
	app.get("/users/:userId/completed", authenticateUser, completedOrders);
	app.get("/Top5", authenticate, fiveMostPopular); //should be admin
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

const activeOrders = async (req: Request, res: Response): Promise<express.Response> => {
	const userId = req.params.userId;

	const checkUserId = await numberChecker(userId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	try {
		const activeOrder = await orderServices.activeOrders(parseInt(userId));

		//check output is not empty
		if (typeof activeOrder === "string") {
			return res.status(404).json("no orders are active");
		}

		return res.status(200).json(activeOrder);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const completedOrders = async (req: Request, res: Response): Promise<express.Response> => {
	const userId = req.params.userId;

	const checkUserId = await numberChecker(userId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	try {
		const completedOrder = await orderServices.completedOrders(parseInt(userId));

		//check output is not empty
		if (typeof completedOrder === "string") {
			return res.status(404).json("no completed orders found");
		}

		return res.status(200).json(completedOrder);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const fiveMostPopular = async (req: Request, res: Response): Promise<express.Response> => {
	try {
		const top5 = await productServices.fiveMostPopular();

		if (top5 === "empty") {
			return res.status(404).json("no products found to show top 5");
		}

		return res.status(200).json(top5);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

//should be endpoint tested
