import app from "../../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import { User } from "../../models/users/usersModel";
import { Order, order_status_type } from "../../models/orders/orderModel";
import { Product } from "../../models/products/productsModel";
import { OrdersProducts } from "../../models/order-products/order_productsModel";

// helper functions
const createUser = async (userTest: User): Promise<string | jwt.JwtPayload> => {
	const user = await supertest(app).post("/users").send(userTest);
	const activeTokenUser1 = user.body;
	return activeTokenUser1;
};

// helper functions
const createOrder = async (
	orderTest: Order,
	userId: number,
	token: string | jwt.JwtPayload,
): Promise<string | jwt.JwtPayload> => {
	const url = "/users/" + userId + "/order/";
	const user = await supertest(app)
		.post(url)
		.send(orderTest)
		.set("Authorization", `Bearer ${token}`);
	const activeTokenOrder1 = user.body;
	return activeTokenOrder1;
};

describe("order-products Handlers testbench \n", () => {
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

	//create two order-products to add and perform tests on
	const orderTest: Order = {
		user_id: 1,
		order_status: order_status_type.active,
	};

	const productOrderDetails: OrdersProducts = {
		order_id: 1,
		product_id: 1,
		quantity: 16,
	};

	const secProductOrderDetails: OrdersProducts = {
		order_id: 1,
		product_id: 2,
		quantity: 8,
	};

	const productTest: Product = {
		name: "Product 1",
		price: 10.65,
		category: "Home appliance",
	};
	const productTest2: Product = {
		name: "Product 2",
		price: 405.68,
		category: "Clothes",
	};

	//create user and get token
	let activeTokenUser1: string | jwt.JwtPayload;
	let activeTokenOrder1: string | jwt.JwtPayload;

	it("creates all test units", async () => {
		//////////////create test object////////////

		try {
			//create user for the rest of the tests
			activeTokenUser1 = await createUser(userTest);

			//create 2 products for the rest of the tests
			await supertest(app)
				.post("/products")
				.send(productTest)
				.set("Authorization", `Bearer ${activeTokenUser1}`);

			await supertest(app)
				.post("/products")
				.send(productTest2)
				.set("Authorization", `Bearer ${activeTokenUser1}`);
		} catch (error) {
			fail(error);
		}

		try {
			//create order for the rest of the tests
			activeTokenOrder1 = await createOrder(orderTest, 1, activeTokenUser1);

			//add products to order
			await supertest(app)
				.post("/users/1/addtocart")
				.send(productOrderDetails)
				.set("Authorization", `Bearer ${activeTokenOrder1}`);

			//add second product
			await supertest(app)
				.post("/users/1/addtocart")
				.send(secProductOrderDetails)
				.set("Authorization", `Bearer ${activeTokenOrder1}`);
		} catch (error) {
			fail(error);
		}
		////////////////start test//////////////////
		expect(200);
	});

	it("get active order products", async () => {
		try {
			await supertest(app)
				.get("/users/1/active")
				.send(productOrderDetails)
				.set("Authorization", `Bearer ${activeTokenUser1}`)
				.expect(200);
		} catch (error) {
			fail(error);
		}
	});

	it("get completed order products", async () => {
		try {
			await supertest(app)
				.get("/users/1/completed")
				.set("Authorization", `Bearer ${activeTokenUser1}`)
				.expect(404);
		} catch (error) {
			fail(error);
		}
	});

	it("get five most popular products", async () => {
		await supertest(app)
			.get("/Top5")
			.set("Authorization", `Bearer ${activeTokenUser1}`)
			.expect(200)
			.then(res => {
				expect(res.body[0].product_id).toEqual(1);
				expect(res.body[1].product_id).toEqual(2);
			})
			.catch(err => {
				if (err) {
					fail(err);
				}
			});
	});
});
