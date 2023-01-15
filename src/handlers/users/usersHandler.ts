import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenPass } from "../../../Config/envConfig";
import { authenticate, authenticateUser } from "../../middlewares/authUser";
import { User, usersClass } from "../../models/users/usersModel";

//handler function
export const userhandler = (app: express.Application) => {
	app.get("/users", authenticate, index); //should be admin
	app.get("/users/:userid", authenticateUser, show);
	app.post("/users", create); //anyone
	app.patch("/users/:userid", authenticateUser, update);
	app.delete("/users/:userid", authenticateUser, remove);
	app.get("/signin", signInUser); //anyone
};

const index = async (req: Request, res: Response): Promise<express.Response> => {
	try {
		const indexCall = await usersClass.index();

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res.status(404).json("Users not found in database ,database is probably empty");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const show = async (req: Request, res: Response): Promise<express.Response> => {
	const id = req.params.userid;

	try {
		const showCall = await usersClass.show(parseInt(id));

		//check output is not empty
		if (typeof showCall === "string") {
			if ((showCall as string) === "empty") {
				return res.status(404).json("user not found in database");
			}
		}

		return res.status(200).json(showCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const create = async (req: Request, res: Response): Promise<express.Response> => {
	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const username = req.body.username;
	const password = req.body.password;

	//define checks
	if (firstName === undefined) {
		return res.status(404).json("first name was not defined");
	}
	if (lastName === undefined) {
		return res.status(404).json("last name was not defined");
	}
	if (username === undefined) {
		return res.status(404).json("username was not defined");
	}
	if (password === undefined) {
		return res.status(404).json("password was not defined");
	}

	//check query params are strings
	if (typeof firstName !== "string") {
		return res.status(400).json("first name is not a string");
	}
	if (typeof lastName !== "string") {
		return res.status(400).json("last name is not a string");
	}
	if (typeof username !== "string") {
		return res.status(400).json("username is not a string");
	}
	if (typeof password !== "string") {
		return res.status(400).json("password is not a string");
	}

	//create user object from query parameters
	const user: User = {
		first_name: firstName,
		last_name: lastName,
		username: username,
		password: password,
	};

	try {
		const createCall = await usersClass.create(user);

		//check output is not empty
		if (typeof createCall === "string") {
			if ((createCall as string) === "empty") {
				return res.status(404).json("user not found in database");
			}
			if ((createCall as string) === "hash error") {
				return res.status(500).json("error in hash library");
			}
		}

		//create jwt token
		const authToken = jwt.sign(
			{ user_id: (createCall as User).id, userType: "normal" },
			tokenPass as string,
		);

		return res.status(200).json(authToken);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const update = async (req: Request, res: Response): Promise<express.Response> => {
	const firstName: string = req.body.first_name;
	const lastName: string = req.body.last_name;
	const usernameReq: string = req.body.username;
	const passwordReq: string = req.body.password;
	const id = req.params.userid;

	let firstNameExist = 0;
	let lastNameExist = 0;
	let usernameExist = 0;
	let passwordExist = 0;

	let obj = {};

	//define checks
	if (firstName !== undefined) {
		firstNameExist = 1;
		obj = { first_name: firstName };
	}
	if (lastName !== undefined) {
		lastNameExist = 1;
		obj = Object.assign(obj, { last_name: lastName });
	}
	if (usernameReq !== undefined) {
		usernameExist = 1;
		obj = Object.assign(obj, { username: usernameReq });
	}
	if (passwordReq !== undefined) {
		passwordExist = 1;
		obj = Object.assign(obj, { password: passwordReq });
	}

	//check query params are strings
	if (typeof firstName !== "string" && firstNameExist === 1) {
		return res.status(400).json("first name is not a string");
	}
	if (typeof lastName !== "string" && lastNameExist === 1) {
		return res.status(400).json("last name is not a string");
	}
	if (typeof usernameReq !== "string" && usernameExist === 1) {
		return res.status(400).json("username is not a string");
	}
	if (typeof passwordReq !== "string" && passwordExist === 1) {
		return res.status(400).json("password is not a string");
	}

	//create user object from query parameters
	const user: object = obj;

	try {
		const updateCall = await usersClass.update(
			firstNameExist,
			lastNameExist,
			usernameExist,
			passwordExist,
			user,
			parseInt(id),
		);

		//check output is not empty
		if (typeof updateCall === "string") {
			if ((updateCall as string) === "empty") {
				return res.status(404).json("user not found in database");
			}
		}

		return res.status(200).json(updateCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const remove = async (req: Request, res: Response): Promise<express.Response> => {
	const id = req.params.userid;

	try {
		const indexCall = await usersClass.delete(parseInt(id));

		//check output is not empty
		if (typeof indexCall === "string") {
			if ((indexCall as string) === "empty") {
				return res.status(404).json("user not found in users database so it cannot be deleted");
			}
		}

		return res.status(200).json(indexCall);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}
};

const signInUser = async (req: Request, res: Response): Promise<express.Response> => {
	const { username, password } = req.body;

	//check username and password is defined
	if (username === undefined) {
		return res.status(404).json("username is not entered");
	}
	if (password === undefined) {
		return res.status(404).json("password is not entered");
	}

	//check username and password is of type string
	if (typeof username !== "string") {
		return res.status(400).json("username is not a string");
	}
	if (typeof password !== "string") {
		return res.status(400).json("password is not a string");
	}

	let signInCall;

	try {
		signInCall = await usersClass.signInUser(username, password);
	} catch (err) {
		return res.status(500).send("database error" + err);
	}

	if (typeof signInCall === "string") {
		if (signInCall === "no user with such username") {
			return res.status(404).json("no user with such username was found");
		} else if (signInCall === "password incorrect") {
			return res.status(400).json("the password entered is incorrect please try again");
		}
	}
	// correct password create and send token in header
	const authToken = jwt.sign(
		{ user_id: (signInCall as User).id as number, userType: "normal" },
		tokenPass as string,
	);

	//if here then all is correct
	return res.status(200).json(authToken);
};
