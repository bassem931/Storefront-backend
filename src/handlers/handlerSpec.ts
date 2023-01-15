import app from "./../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import { User } from "../models/users/usersModel";

describe("API Handlers testbench", () => {
	beforeAll(() => {
		//run reset command before starting
		execSync("yarn reset");
		console.log("database reset");
	});

	let activeToken: jwt.JwtPayload;

	it("test API endpoint base url", () => {
		//test main route
		supertest(app)
			.get("/")
			.expect(200)
			.expect("Welcome to our store Backend")
			.end(err => {
				if (err) {
					fail("test API endpoint base url: " + err);
				}
			});
	});

	it("create a user", () => {
		supertest(app)
			.post("/users")
			.send({ first_name: "baod", last_name: "bask", username: "kioa", password: "nsoad" })
			.expect(400)
			.responseType("jwt.JwtPayload")
			.end((err, res) => {
				if (err) {
					fail("create a user " + err);
				} else {
					//set token to be response value
					activeToken = res.body;
					console.log(activeToken);
				}
			});
	});

	//localhost:3000/image?filename=foxdxfkl
	it("gets user 1 data", () => {
		supertest(app)
			.get("/users/1")
			// .set("Authorization", "Bearer " + activeToken)
			.expect(200)
			.expect(res => {
				(res as unknown as User).first_name === "baod";
				console.log(res);
			})
			.end(err => {
				if (err) {
					fail(err);
				}
			});
	});

	// it("test API with string width", () => {
	// 	//test
	// 	supertest(app)
	// 		.get("/image?filename=fjord&width=fkf")
	// 		.expect(400)
	// 		.expect("please enter a number for the width")
	// 		.end(err => {
	// 			if (err) {
	// 				fail(err);
	// 			}
	// 		});
	// });

	// it("test API with string height", () => {
	// 	//test
	// 	supertest(app)
	// 		.get("/image?filename=fjord&height=fkf")
	// 		.expect(400)
	// 		.expect("please enter a number for the height")
	// 		.end(err => {
	// 			if (err) {
	// 				fail(err);
	// 			}
	// 		});
	// });

	// it("test API with negative width", () => {
	// 	//test
	// 	supertest(app)
	// 		.get("/image?filename=fjord&width=-200")
	// 		.expect(400)
	// 		.expect("please provide a positive width")
	// 		.end(err => {
	// 			if (err) {
	// 				fail(err);
	// 			}
	// 		});
	// });

	// it("test API with negative height", () => {
	// 	//test
	// 	supertest(app)
	// 		.get("/image?filename=fjord&height=-200")
	// 		.expect(400)
	// 		.expect("please provide a positive height")
	// 		.end(err => {
	// 			if (err) {
	// 				fail(err);
	// 			}
	// 		});
	// });
});
