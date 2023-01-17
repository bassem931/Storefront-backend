import app from "../../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import { Product } from "../../models/products/productsModel";
import { User } from "../../models/users/usersModel";

// helper functions
const createUser = async (userTest: User): Promise<string | jwt.JwtPayload> => {
	const user = await supertest(app).post("/users").send(userTest);
	const activeTokenUser1 = user.body;
	return activeTokenUser1;
};

describe("products Handlers testbench \n", () => {
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

	it("get all products should return empty ", async () => {
		//create user for the rest of the tests
		activeTokenUser1 = await createUser(userTest);

		//call supertest to fetch url
		const product1 = await supertest(app).get("/products").expect(404);

		expect(product1.body as unknown as string).toEqual(
			"Products not found in database ,database is probably empty",
		);
	});

	it("create first product ", async () => {
		//call supertest to fetch url
		const product = await supertest(app)
			.post("/products")
			.send(productTest)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);
		expect(product.body).toEqual("product 1 has been created");
	});

	it("create second product", async () => {
		//call supertest to fetch url
		const product = await supertest(app)
			.post("/products")
			.send(productTest2)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);
		expect(product.body).toEqual("product 2 has been created");
	});

	it("get second product ", async () => {
		//call supertest to fetch url
		const product = await supertest(app)
			.get("/products/2")
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);
		expect((product.body as Product).id).toEqual(2);
	});

	it("edit second product ", async () => {
		//object with updated parameters
		const productEdit = {
			name: "3adel",
			price: 1851,
		};

		//call supertest to fetch url
		const product = await supertest(app)
			.patch("/products/2")
			.send(productEdit)
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);
		expect(product.body).toEqual("product 2 updated successfully with name and price");
	});

	it("delete first product ", async () => {
		//call supertest to fetch url
		const product = await supertest(app)
			.delete("/products/1")
			.set("Authorization", `Bearer ${activeTokenUser1}`);

		expect(200);
		expect(product.body).toEqual("product 1 deleted successfully");
	});
});
