import app from "../../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import { User } from "../../models/users/usersModel";

describe("users Handlers testbench \n", () => {
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

	const userTest2: User = {
		first_name: "soka",
		last_name: "tokaa",
		username: "toka84",
		password: "passwor",
	};

	let activeTokenUser1: string | jwt.JwtPayload;
	let activeTokenUser2: string | jwt.JwtPayload;

	it("test API endpoint base url", async () => {
		//test main route
		await supertest(app)
			.get("/")
			.expect(200)
			.expect("Welcome to our store Backend")
			.then(response => {
				// must be then, not a callback
				response.body.data !== undefined;
			})
			.catch(err => {
				fail(err);
			});
	});

	// it("get all users should return empty \n", async () => {
	// 	await supertest(app)
	// 		.get("/users")
	// 		.expect(404)
	// 		.catch(err => {
	// 			fail(err);
	// 		});
	// });

	it("create a user ", async () => {
		const user1 = await supertest(app).post("/users").send(userTest).expect(200);

		activeTokenUser1 = user1.body;
	});

	it("create a second user ", async () => {
		const user2 = await supertest(app).post("/users").send(userTest2).expect(200);

		activeTokenUser2 = user2.body;
	});

	it("gets user 1 data without token ", async () => {
		await supertest(app)
			.get("/users/1")
			.expect(401)
			.catch(err => {
				fail(err);
			});
	});

	// console.log(activeToken);

	it("gets user 1 data with token ", async () => {
		const user1 = await supertest(app)
			.get("/users/1")
			.set("Authorization", `Bearer ${activeTokenUser1}`)

			.expect(200);

		//slice array to remove id which is the first item
		const cleanUser = Object.values(user1.body).slice(1, 4);

		const { first_name, last_name, username } = userTest;

		//compare all values to each other except id
		expect(cleanUser).toEqual(Object.values({ first_name, last_name, username }));
		// compare id
		expect(user1.body.id).toEqual(1);
	});

	it("edits user 1 data with token ", async () => {
		const userEdit = {
			first_name: "salah",
			last_name: "dako",
		};

		const user1 = await supertest(app)
			.patch("/users/1")
			.set("Authorization", `Bearer ${activeTokenUser1}`)
			.send(userEdit)
			.expect(200);

		expect(user1.body).toEqual("user 1 updated successfully with first_name and last_name");
	});

	it("deletes user 1 data with token ", async () => {
		const user1 = await supertest(app)
			.delete("/users/1")
			.set("Authorization", `Bearer ${activeTokenUser1}`)
			.expect(200);

		expect(user1.body).toEqual("user 1 deleted successfully");
	});
});
