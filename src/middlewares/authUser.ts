import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenPass } from "../../Config/envConfig";
import { order_status_type } from "../models/orders/orderModel";

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

//this function to authenticate the token is valid
const getToken = async (req: Request): Promise<string | jwt.JwtPayload> => {
	//verify token exists
	if (req.headers.authorization === undefined) {
		return "authorization invalid no token is sent";
	} else {
		//get token from auth part in header
		const userToken = req.headers.authorization.split(" ")[1];
		const tokenInfo = jwt.verify(userToken, tokenPass as string);
		//returns string or jwt.Payload if string an error has occured
		if (typeof tokenInfo !== "string") {
			return tokenInfo;
		} else {
			return "authentication failed: " + tokenInfo;
		}
	}
};

//this function to authenticate the token is valid
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	//get token from helper
	let token;
	try {
		token = await getToken(req);
	} catch (err) {
		res.status(400).send(token);
	}
	if (typeof token === "string") {
		return res.status(401).json(`${token}`);
	}
	//if here then token is correct so call next
	next();
};

//this function to authenticate the token is valid and user id is the same
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
	//verify token exists
	let tokenInfo;
	try {
		tokenInfo = await getToken(req);
	} catch (err) {
		res.status(400).send(tokenInfo);
	}

	if (typeof tokenInfo === "string") {
		return res.status(401).json(`${tokenInfo}`);
	}

	//get user id from  request and check it is a number
	const reqUserId = req.params.userId;

	//check user id is a number
	const checkUserId = await numberChecker(reqUserId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	//check user id in token
	if ((tokenInfo as jwt.JwtPayload).user_id === undefined) {
		return res.status(404).json("user id not found in token");
	}

	const tokenUserID = (tokenInfo as jwt.JwtPayload).user_id;

	//check user is same user id
	if (reqUserId == tokenUserID) {
		next();
	} else {
		return res.status(401).json("cannot access or edit other user data");
	}
};

//this function to authenticate the token is valid and user id is the same
const authenticateOrder = async (req: Request, res: Response, next: NextFunction) => {
	//verify token exists
	let tokenInfo;
	try {
		tokenInfo = await getToken(req);
	} catch (err) {
		res.status(400).send(tokenInfo);
	}

	if (typeof tokenInfo === "string") {
		return res.status(401).json(`${tokenInfo}`);
	}

	//get user id from request and check it is a number
	const reqUserId = req.params.userId;

	//check user id is a number
	const checkUserId = await numberChecker(reqUserId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	//get order id from request and check it is a number
	const reqOrderId = req.params.orderId;

	const checkOrderId = await numberChecker(reqOrderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	//get user id from token
	if ((tokenInfo as jwt.JwtPayload).user_id === undefined) {
		return res.status(404).json("user id not found in token");
	}
	const tokenUserID = (tokenInfo as jwt.JwtPayload).user_id;

	//get order id from token
	if ((tokenInfo as jwt.JwtPayload).order_id === undefined) {
		//creating active order so pass
		next();
	}
	const tokenOrderid = (tokenInfo as jwt.JwtPayload).order_id;

	//order id defined so order status must be defined
	const orderStatus: order_status_type = (tokenInfo as jwt.JwtPayload).order_status;

	//check user is same user id
	if (parseInt(reqUserId) === tokenUserID) {
		//same user check order id to make sure no active orders are present
		if (parseInt(reqOrderId) === tokenOrderid) {
			if (req.method === "POST") {
				return res.status(400).json(`order ${tokenOrderid} already created`);
			} else {
				// get delete or patch and they must match order id in token with no need to check status
				next();
			}
		} else {
			//check if complete allow new orders
			if (orderStatus === order_status_type.completed) {
				// token is probably so user can create a new order
				next();
			} else {
				if (req.method === "POST") {
					return res
						.status(400)
						.json(
							`cannot create 2 active orders at the same time use order number ${tokenOrderid}`,
						);
				} else {
					return res.status(400).json(`cannot view or edit other users orders`);
				}
			}
		}
	} else {
		return res.status(401).json("cannot access or edit other user data");
	}
};

// similar to authenticateOrder but with less conditions
const authenticateOrderProduct = async (req: Request, res: Response, next: NextFunction) => {
	//verify token exists
	let tokenInfo;
	try {
		tokenInfo = await getToken(req);
	} catch (err) {
		res.status(400).send(tokenInfo);
	}

	if (typeof tokenInfo === "string") {
		return res.status(401).json(`${tokenInfo}`);
	}

	//get user id from request and check it is a number
	const reqUserId = req.params.userId;

	const checkUserId = await numberChecker(reqUserId, "user id", res);
	if (checkUserId !== "number") {
		return checkUserId as Response;
	}

	//get order id from body and check it is a number
	const reqOrderId = req.body.order_id;

	const checkOrderId = await numberChecker(reqOrderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	if ((tokenInfo as jwt.JwtPayload).user_id === undefined) {
		return res.status(404).json("user id not found in token");
	}

	const tokenUserID = (tokenInfo as jwt.JwtPayload).user_id;

	if ((tokenInfo as jwt.JwtPayload).order_id === undefined) {
		//no order id create order first
		return res.status(404).json("an order must be created first");
	}
	const tokenOrderid = (tokenInfo as jwt.JwtPayload).order_id;

	//order id defined so order status must be defined
	const orderStatus: order_status_type = (tokenInfo as jwt.JwtPayload).order_status;

	//check user is same user id
	if (parseInt(reqUserId) === tokenUserID) {
		//same user check order id to make sure user has an active order
		if (parseInt(reqOrderId) === tokenOrderid) {
			if (orderStatus === order_status_type.completed) {
				return res.status(400).json(`cannot change completed orders`);
			} else {
				// token is active so user can edit products
				next();
			}
		} else {
			return res.status(400).json(`cannot edit order as order id is incorrect`);
		}
	} else {
		return res.status(401).json("cannot access or edit other user data");
	}
};

export { authenticate, authenticateUser, authenticateOrder, getToken, authenticateOrderProduct };
