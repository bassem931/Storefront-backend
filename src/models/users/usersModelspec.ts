import { User, usersClass } from "./usersModel";
import { execSync } from "child_process";

describe("Suite to test users model functions", () => {
	describe("Suite to test users model functions exist", () => {
		it("index method defined", () => {
			expect(usersClass.index).toBeDefined;
		});

		it("show method defined ", () => {
			expect(usersClass.show).toBeDefined;
		});

		it("create method defined", () => {
			expect(usersClass.create).toBeDefined;
		});

		it("update method defined", () => {
			expect(usersClass.update).toBeDefined;
		});

		it("delete method defined", () => {
			expect(usersClass.delete).toBeDefined;
		});
	});

	describe("Suite to test users model functions work as expected", () => {
		beforeAll(() => {
			//run reset command before starting
			execSync("yarn reset");
			console.log("database reset");
		});

		const userTest: User = {
			first_name: "firsttest",
			last_name: "lasttest",
			username: "usertest",
			password: "passtest",
		};
		const userSecTest: User = {
			first_name: "firstSectest",
			last_name: "lastSectest",
			username: "userSectest",
			password: "passSectest",
		};

		//empty index test
		it("checks array is empty using index", async () => {
			const res = await usersClass.index();
			expect(res).toEqual("empty");
		});

		//two posts tests
		it("creates the first user", async () => {
			const user1 = await usersClass.create(userTest);
			//use object.values to avoid key naming differences

			//slice array to remove id which is the first item
			const cleanUser = Object.values(user1).slice(1, 4);

			const { first_name, last_name, username } = userTest;

			//compare all values to each other except id
			expect(cleanUser).toEqual(Object.values({ first_name, last_name, username }));
			// compare id
			expect((user1 as User).id).toEqual(1);
		});

		it("creates another user", async () => {
			const user2 = await usersClass.create(userSecTest);
			//use object.values to avoid key naming differences

			//slice array to remove id which is the first item
			const cleanUser = Object.values(user2).slice(1, 4);

			const { first_name, last_name, username } = userSecTest;
			//compare all values to each other except id and password
			expect(cleanUser).toEqual(Object.values({ first_name, last_name, username }));
			// compare id
			expect((user2 as User).id).toEqual(2);
		});

		//show test
		it("show user at id chosen which is 2", async () => {
			const user = await usersClass.show(2);
			expect((user as User).id).toEqual(2);
		});

		//update tests
		describe("Testing user update model function with different combinations", () => {
			it("should update user full data", async () => {
				const userTest: User = {
					first_name: "first",
					last_name: "last",
					username: "user",
					password: "pass",
				};

				const [firstNameExist, lastNameExist, usernameExist, passwordExist] = [1, 1, 1, 1];

				const user = await usersClass.update(
					firstNameExist,
					lastNameExist,
					usernameExist,
					passwordExist,
					userTest,
					2,
				);

				expect(user).toEqual(
					"user 2 updated successfully with first_name ,last_name ,username and password",
				);
			});

			it("should update user first and last name only", async () => {
				const userTest = {
					first_name: "first7eta",
					last_name: "last7eta",
				};

				const [firstNameExist, lastNameExist, usernameExist, passwordExist] = [1, 1, 0, 0];

				const user = await usersClass.update(
					firstNameExist,
					lastNameExist,
					usernameExist,
					passwordExist,
					userTest,
					2,
				);

				expect(user).toEqual("user 2 updated successfully with first_name and last_name");
			});

			it("should update username and password only", async () => {
				const userTest = {
					username: "user7eta",
					password: "pass7eta",
				};

				const [firstNameExist, lastNameExist, usernameExist, passwordExist] = [0, 0, 1, 1];

				const user = await usersClass.update(
					firstNameExist,
					lastNameExist,
					usernameExist,
					passwordExist,
					userTest,
					1,
				);

				expect(user).toEqual("user 1 updated successfully with username and password");
			});

			it("should update firstname and password only", async () => {
				const userTest = {
					first_name: "firstbas",
					password: "passbas",
				};

				const [firstNameExist, lastNameExist, usernameExist, passwordExist] = [1, 0, 0, 1];

				const user = await usersClass.update(
					firstNameExist,
					lastNameExist,
					usernameExist,
					passwordExist,
					userTest,
					1,
				);

				expect(user).toEqual("user 1 updated successfully with first_name and password");
			});
		});

		it("should delete user", async () => {
			const user = await usersClass.delete(1);
			expect(user).toEqual("user 1 deleted successfully");
		});
	});
});
