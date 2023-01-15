import express, { Request, Response } from "express";
import { authenticate, authenticateOrderProduct } from "../../middlewares/authUser";
import {
	ordersProductsClass,
	OrdersProducts,
} from "../../models/order-products/order_productsModel";

//handler fucntion
export const order_productshandler = (app: express.Application) => {
	app.get("/myOrder/products", authenticate, index); //should be admin
	app.get("/myOrder/products/:orderid", authenticate, getOrderProducts); //should be admin
	app.post("/users/:userid/addtocart", authenticateOrderProduct, addProduct);
	app.patch("/users/:userid/editcart", authenticateOrderProduct, updateProduct);
	app.delete("/users/:userid/deletecart", authenticateOrderProduct, deleteProduct);
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
		const indexCall = await ordersProductsClass.index();

		//check output is not empty
		if (typeof indexCall === "string") {
			return res.status(404).json("all orders still empty");
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const getOrderProducts = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.params.orderid;

	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}

	try {
		const showCall = await ordersProductsClass.getOrderProducts(parseInt(orderId));

		//check output is not empty
		if (typeof showCall === "string") {
			return res.status(404).json("no order found with this id");
		}

		return res.status(200).json(showCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

//only user id is needed and it will be passed as a param
const addProduct = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.body.order_id;
	const productId = req.body.product_id;
	const quantity = req.body.quantity;

	//check for values to be numbers
	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}
	const checkProductId = await numberChecker(productId, "Product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}
	const checkquantity = await numberChecker(quantity, "quantity", res);
	if (checkquantity !== "number") {
		return checkquantity as Response;
	}

	//create order object from query parameters
	const orderDetails: OrdersProducts = {
		order_id: orderId,
		product_id: productId,
		quantity: quantity,
	};

	try {
		const addProcCall = await ordersProductsClass.addProduct(orderDetails);

		//check output is not empty
		if (typeof addProcCall === "string" && addProcCall === "empty") {
			return res.status(404).json(addProcCall);
		}

		return res.status(200).json(addProcCall);
	} catch (err) {
		return res.status(500).send("database " + err);
	}
};

const updateProduct = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.body.order_id;
	const productId = req.body.product_id;
	const quantity = req.body.quantity;

	//check for values to be numbers
	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}
	const checkProductId = await numberChecker(productId, "Product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}
	const checkquantity = await numberChecker(quantity, "quantity", res);
	if (checkquantity !== "number") {
		return checkquantity as Response;
	}

	const orderDetails: OrdersProducts = {
		order_id: orderId,
		product_id: productId,
		quantity: quantity,
	};

	try {
		const updateCall = await ordersProductsClass.updateProduct(orderDetails);

		//check output is not empty
		if (typeof updateCall === "string") {
			return res.status(404).json(updateCall);
		}

		return res.status(200).json(updateCall);
	} catch (err) {
		return res.status(500).send("database " + err);
	}
};

const deleteProduct = async (req: Request, res: Response): Promise<express.Response> => {
	const orderId = req.body.order_id;
	const productId = req.body.product_id;

	//check for values to be numbers
	const checkOrderId = await numberChecker(orderId, "order id", res);
	if (checkOrderId !== "number") {
		return checkOrderId as Response;
	}
	const checkProductId = await numberChecker(productId, "Product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}

	try {
		const deleteCall = await ordersProductsClass.deleteProduct(orderId, productId);

		//check output is not empty
		if (typeof deleteCall === "string") {
			return res.status(404).json(deleteCall);
		}

		return res.status(200).json(deleteCall);
	} catch (err) {
		return res.status(500).send("database " + err);
	}
};

// const activeOrders = async (req: Request, res: Response): Promise<express.Response> => {
// 	const userId = req.params.userid;

// 	if (userId === undefined) {
// 		return res.status(404).json("user id is not defined");
// 	}

// 	//check user id is a number
// 	if (Number.isNaN(parseInt(userId))) {
// 		return res.status(400).json("user id is not a number");
// 	}

// 	//check that id number is not equal 0
// 	else if (parseInt(userId) < 0) {
// 		return res.status(400).json("user id cannot be a negative number");
// 	}

// 	try {
// 		const indexCall = await ordersClass.activeOrders(parseInt(userId));

// 		//check output is not empty
// 		if (typeof indexCall === "string") {
// 			if ((indexCall as string) === "empty") {
// 				return res.status(404).json("no active orders found for user  + userId");
// 			}
// 		}

// 		return res.status(200).json(indexCall);
// 	} catch (err) {
// 		return res.status(500).send("database error" + err);
// 	}
// };

// const completedOrders = async (req: Request, res: Response): Promise<express.Response> => {
// 	const userId = req.params.userid;

// 	if (userId === undefined) {
// 		return res.status(404).json("user id is not defined");
// 	}

// 	//check user id is a number
// 	if (Number.isNaN(parseInt(userId))) {
// 		return res.status(400).json("user id is not a number");
// 	}

// 	//check that id number is not equal 0
// 	else if (parseInt(userId) < 0) {
// 		return res.status(400).json("user id cannot be a negative number");
// 	}

// 	try {
// 		const indexCall = await ordersClass.completedOrders(parseInt(userId));

// 		//check output is not empty
// 		if (typeof indexCall === "string") {
// 			if ((indexCall as string) === "empty") {
// 				return res.status(404).json("no completed orders found for user " + userId);
// 			}
// 		}

// 		return res.status(200).json(indexCall);
// 	} catch (err) {
// 		return res.status(500).send("database error" + err);
// 	}
// };
