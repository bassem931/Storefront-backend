import app from "../../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import { User } from "../../models/users/usersModel";
import { Order, order_status_type } from "../../models/orders/orderModel";

// helper functions
const createUser = async (userTest: User): Promise<string | jwt.JwtPayload> => {
	const user = await supertest(app).post("/users").send(userTest);
	const activeTokenUser1 = user.body;
	return activeTokenUser1;
};

describe("orders Handlers testbench \n", () => {
	beforeAll(() => {
		//run reset command before starting
		execSync("yarn reset");
		console.log("database reset");
	});

	const userTest: User = {
		first_name: "baod",
		last_name: "bask",
		username: "kioa",
		password: "nsoad",
	};

	//create two orders to add and perform tests on
	const orderTest: Order = {
		user_id: 1,
		order_status: order_status_type.active,
	};

	//create user and get token
	let activeTokenUser1: string | jwt.JwtPayload;
	let activeTokenOrder1: string | jwt.JwtPayload;
	let activeTokenOrder2: string | jwt.JwtPayload;

	it("get all orders should return empty \n", async () => {
		//create user for the rest of the tests
		activeTokenUser1 = await createUser(userTest);

		//call supertest to fetch url
		const order = await supertest(app)
			.get("/orders")
			.expect(404)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(order.body).toEqual("Orders not found in database ,database is probably empty");
	});

	it("create first order \n", async () => {
		const order = await supertest(app)
			.post("/users/1/order/")
			.send(orderTest)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);

		activeTokenOrder1 = order.body;

		console.log(activeTokenOrder1);

		//jwt always start with those three letters
		expect((order.body as string).charAt(0)).toEqual("e");
		expect((order.body as string).charAt(1)).toEqual("y");
		expect((order.body as string).charAt(2)).toEqual("J");
	});

	it("create second order \n", async () => {
		const order = await supertest(app)
			.post("/users/1/order/")
			.send(orderTest)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);

		activeTokenOrder2 = order.body;

		console.log(activeTokenOrder2);

		//jwt always start with those three letters
		expect((order.body as string).charAt(0)).toEqual("e");
		expect((order.body as string).charAt(1)).toEqual("y");
		expect((order.body as string).charAt(2)).toEqual("J");
	});

	it("get second order \n", async () => {
		const order = await supertest(app)
			.get("/users/1/order/2")
			.set("Authorization", `Bearer ${activeTokenOrder2}`);

		expect(200);
		expect((order.body as Order).id).toEqual(2);
	});

	it("edit second order \n", async () => {
		const orderEdit = {
			order_status: order_status_type.active,
		};

		const order = await supertest(app)
			.patch("/users/1/order/2")
			.send(orderEdit)
			.set("Authorization", `Bearer ${activeTokenOrder2}`);

		expect(200);

		//jwt always start with those three letters
		expect((order.body as string).charAt(0)).toEqual("e");
		expect((order.body as string).charAt(1)).toEqual("y");
		expect((order.body as string).charAt(2)).toEqual("J");
	});

	it("delete first order \n", async () => {
		const order = await supertest(app)
			.delete("/users/1/order/1")
			.set("Authorization", `Bearer ${activeTokenOrder1}`);

		expect(200);
		expect(order.body).toEqual("order 1 deleted successfully for user 1");
	});
});
