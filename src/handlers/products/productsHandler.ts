import express, { Request, Response } from "express";
import { authenticate } from "../../middlewares/authUser";
import { productsClass, Product } from "../../models/products/productsModel";

//handler fucntion
export const producthandler = (app: express.Application) => {
	app.get("/products", index); //anyone
	app.get("/products/:id", show); //anyone
	app.post("/products", authenticate, create); //should be admin
	app.patch("/products/:id", authenticate, update); //should be admin
	app.delete("/products/:id", authenticate, remove); //should be admin
	app.get("/products/category/:category", sortByCategory); //anyone
};

const index = async (req: Request, res: Response): Promise<express.Response> => {
	try {
		const indexCall = await productsClass.index();

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res.status(404).json("Products not found in database ,database is probably empty");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const show = async (req: Request, res: Response): Promise<express.Response> => {
	const id = req.params.id;

	//check number is defined
	if (id === undefined) {
		return res.status(404).json("id is not defined");
	}
	//check id is a number
	if (Number.isNaN(parseInt(id))) {
		return res.status(400).json("id is not a number");

		//check that id number is not equal 0
	} else if (parseInt(id) < 0) {
		return res.status(400).json("id cannot be a negative number");
	} else {
		try {
			const showCall = await productsClass.show(parseInt(id));

			//check output is not empty
			if (typeof showCall === "string") {
				if ((showCall as string) === "empty") {
					return res.status(404).json("product not found in database");
				}
			}

			return res.status(200).json(showCall);
		} catch (err) {
			return res.status(500).send("database error" + err);
		}
	}
};

const create = async (req: Request, res: Response): Promise<express.Response> => {
	const { name, price, category } = req.body;

	//define checks
	if (name === undefined) {
		return res.status(404).json("name was not defined");
	}
	if (price === undefined) {
		return res.status(404).json("price was not defined");
	}
	if (category === undefined) {
		return res.status(404).json("category was not defined");
	}

	//check query params are strings
	if (typeof name !== "string") {
		return res.status(400).json("first name is not a string");
	}
	if (typeof price !== "number") {
		return res.status(400).json("price is not a number");
	}
	if (typeof category !== "string") {
		return res.status(400).json("productname is not a string");
	}

	//create product object from query parameters
	const product: Product = {
		name: name,
		price: price,
		category: category,
	};

	try {
		const createCall = await productsClass.create(product);

		//check output is not empty
		if (typeof createCall === "string") {
			if ((createCall as string) === "empty") {
				return res.status(404).json("product not found in database");
			}
			if ((createCall as string) === "hash error") {
				return res.status(500).json("error in hash library");
			}
		}

		return res.status(200).json(createCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const update = async (req: Request, res: Response): Promise<express.Response> => {
	const { name, price, category } = req.body;

	const id = req.params.id;

	let nameExist = 0;
	let priceExist = 0;
	let categoryExist = 0;

	let obj = {};

	//check id number is defined
	if (parseInt(id) === undefined) {
		return res.status(404).json("id is not defined");
	}

	//check id is a number
	if (Number.isNaN(parseInt(id))) {
		return res.status(400).json("id is not a number");

		//check that id number is not equal 0
	} else if (parseInt(id) < 0) {
		return res.status(400).json("id cannot be a negative number");
	}

	//define checks
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

	try {
		const updateCall = await productsClass.update(
			nameExist,
			priceExist,
			categoryExist,
			product,
			parseInt(id),
		);

		//check output is not empty
		if (typeof updateCall === "string") {
			if ((updateCall as string) === "empty") {
				return res.status(404).json("product not found in database");
			}
		}

		return res.status(200).json(updateCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const remove = async (req: Request, res: Response): Promise<express.Response> => {
	const id = req.params.id;

	//check id number is defined
	if (parseInt(id) === undefined) {
		return res.status(404).json("id is not defined");
	}
	//check id is a number
	if (Number.isNaN(parseInt(id))) {
		return res.status(400).json("id is not a number");

		//check that id number is not equal 0
	} else if (parseInt(id) < 0) {
		return res.status(400).json("id cannot be a negative number");
	}

	try {
		const indexCall = await productsClass.delete(parseInt(id));

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res
					.status(404)
					.json("product not found in products database so it cannot be deleted");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const sortByCategory = async (req: Request, res: Response): Promise<express.Response> => {
	const category = req.params.category;

	if (category === undefined) {
		return res.status(404).json("category is not defined");
	}

	if (category.toLowerCase() === category.toUpperCase()) {
		return res.status(400).json("category is not a string");
	}

	try {
		const indexCall = await productsClass.sortByCategory(category);

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res
					.status(404)
					.json("Products not found in database check category name is correct");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};
