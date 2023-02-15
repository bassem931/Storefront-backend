import express, { Request, Response } from "express";
import { authenticate } from "../../middlewares/authUser";
import { productsClass, Product } from "../../models/products/productsModel";

//handler function
export const producthandler = (app: express.Application) => {
	app.get("/products", index); //anyone
	app.get("/products/:productId", show); //anyone
	app.post("/products", authenticate, create); //should be admin
	app.patch("/products/:productId", authenticate, update); //should be admin
	app.delete("/products/:productId", authenticate, remove); //should be admin
	app.get("/products/category/:category", sortByCategory); //anyone
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

const stringChecker = async (str: string, property: string, res: Response) => {
	if (str === undefined) {
		return res.status(404).json(`${property} is not defined`);
	}

	if (typeof str !== "string") {
		return res.status(400).json(`${property} is not a string`);
	} else {
		return "string";
	}
};

const index = async (req: Request, res: Response): Promise<express.Response> => {
	let indexCall;

	//call model function
	try {
		indexCall = await productsClass.index();
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof indexCall === "string") {
		if ((indexCall as string) === "empty") {
			return res.status(404).json("Products not found in database ,database is probably empty");
		}
	}

	//return all products
	return res.status(200).json(indexCall);
};

const show = async (req: Request, res: Response): Promise<express.Response> => {
	//get product id from url
	const productId = req.params.productId;

	//check product id is a number
	const checkProductId = await numberChecker(productId, "product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}

	let showCall;

	//call model function
	try {
		showCall = await productsClass.show(parseInt(productId));
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof showCall === "string") {
		if ((showCall as string) === "empty") {
			return res.status(404).json("product not found in database");
		}
	}

	//return product
	return res.status(200).json(showCall);
};

const sortByCategory = async (req: Request, res: Response): Promise<express.Response> => {
	//get category from url
	const category = req.params.category;

	// check category is defined
	if (category === undefined) {
		return res.status(404).json("category is not defined");
	}

	// check category is a string
	if (category.toLowerCase() === category.toUpperCase()) {
		return res.status(400).json("category is not a string");
	}

	let categoryCall;
	//call model function
	try {
		categoryCall = await productsClass.sortByCategory(category);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof categoryCall === "string") {
		if ((categoryCall as string) === "empty") {
			return res.status(404).json("Products not found in database check category name is correct");
		}
	}

	//return products sorted by category
	return res.status(200).json(categoryCall);
};

const create = async (req: Request, res: Response): Promise<express.Response> => {
	//get request body
	const { name, price, category } = req.body;

	//check name is a string
	const checkNameId = await stringChecker(name, "name", res);
	if (checkNameId !== "string") {
		return checkNameId as Response;
	}

	//check price is a number
	const checkPrice = await numberChecker(price, "price", res);
	if (checkPrice !== "number") {
		return checkPrice as Response;
	}

	//check name is a string
	const checkCategoryId = await stringChecker(category, "category", res);
	if (checkCategoryId !== "string") {
		return checkCategoryId as Response;
	}

	//create product object from query parameters
	const product: Product = {
		name: name,
		price: price,
		category: category,
	};

	let createCall;

	//call model function
	try {
		createCall = await productsClass.create(product);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check product output
	if ((createCall as string) === "empty") {
		return res.status(404).json("product not found in database");
	}
	if ((createCall as string) === "hash error") {
		return res.status(500).json("error in hash library");
	}
	console.log(createCall);

	//return message from model
	return res.status(200).json(createCall);
};

const update = async (req: Request, res: Response): Promise<express.Response> => {
	//get request body
	const { name, price, category } = req.body;

	//if body is empty send error
	if (req.body === undefined) {
		return res.status(400).json("request body is empty");
	}

	//get product id from url
	const id = req.params.productId;

	//check product id is a number
	const checkProductId = await numberChecker(id, "product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}

	//flags for parameters existing
	let nameExist = 0;
	let priceExist = 0;
	let categoryExist = 0;

	let obj = {};

	//check id is a number

	//define checks and append existing parameters to object
	if (name !== undefined) {
		nameExist = 1;
		obj = { name: name };
	}
	if (price !== undefined) {
		priceExist = 1;
		obj = Object.assign(obj, { price: price });
	}
	if (category !== undefined) {
		categoryExist = 1;
		obj = Object.assign(obj, { category: category });
	}

	//check query params are strings
	if (typeof name !== "string" && nameExist === 1) {
		return res.status(400).json("first name is not a string");
	}
	if (typeof price !== "number" && priceExist === 1) {
		return res.status(400).json("price is not a number");
	}
	if (typeof category !== "string" && categoryExist === 1) {
		return res.status(400).json("category is not a string");
	}

	//create product object from query parameters
	const product: object = obj;

	let updateCall;

	//call model function
	try {
		updateCall = await productsClass.update(
			nameExist,
			priceExist,
			categoryExist,
			product,
			parseInt(id),
		);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//if request returned empty body response from model send empty response to user
	if (updateCall === "empty request body") {
		return res.status(404).json("product request body is empty");
	}

	//check output is not empty
	if (typeof updateCall === "string") {
		if ((updateCall as string) === "empty") {
			return res.status(404).json("product not found in database");
		}
	}

	//return update message
	return res.status(200).json(updateCall);
};

const remove = async (req: Request, res: Response): Promise<express.Response> => {
	//get product id from url
	const id = req.params.productId;

	//check product id is a number
	const checkProductId = await numberChecker(id, "product id", res);
	if (checkProductId !== "number") {
		return checkProductId as Response;
	}

	let indexCall;

	//call model function
	try {
		indexCall = await productsClass.delete(parseInt(id));
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	//check output is not empty
	if (typeof indexCall === "string") {
		if ((indexCall as string) === "empty") {
			return res.status(404).json("product not found in products database so it cannot be deleted");
		}
	}

	//return model message
	return res.status(200).json(indexCall);
};
