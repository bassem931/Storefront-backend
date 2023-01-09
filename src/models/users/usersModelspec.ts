import { User, usersClass } from "./usersModel";

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
			// working
			// const obj = { ...user1 };
			// console.log(obj);
			//slice array to remove id which is the first item
			const cleanUser = Object.values(user1).slice(1);
			//compare all values to each other except id
			expect(cleanUser).toEqual(Object.values(userTest));
			// compare id
			expect((user1 as User).id).toEqual(1);
		});

		it("creates another user", async () => {
			const user2 = await usersClass.create(userSecTest);
			//use object.values to avoid key naming differences
			// working
			// const obj = { ...user1 };
			// console.log(obj);
			//slice array to remove id which is the first item
			const cleanUser = Object.values(user2).slice(1);
			//compare all values to each other except id
			expect(cleanUser).toEqual(Object.values(userSecTest));
			// compare id
			expect((user2 as User).id).toEqual(2);
		});

		//show test
		it("show user at id chosen which is 2", async () => {
			const user = await usersClass.show(2);
			expect((user as User).id).toEqual(2);
		});

		//update tests
		describe("Testing update model function with different combinations", () => {
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

				//slice array to remove id which is the first item
				const cleanUser = Object.values(user).slice(1);
				//compare all values to each other except id
				expect(cleanUser).toEqual(Object.values(userTest));
				// compare id
				expect((user as User).id).toEqual(2);
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

				//slice array to remove take only first name and last name
				const cleanUser = Object.values(user).slice(1, 3);
				//compare all values to each other except id
				expect(cleanUser).toEqual(Object.values(userTest));
				// compare id
				expect((user as User).id).toEqual(2);
			});

			it("should update username and password only", async () => {
				const userTest = {
					usename: "user7eta",
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

				//slice array to remove take only first name and last name
				const cleanUser = Object.values(user).slice(3);
				//compare all values to each other except id
				expect(cleanUser).toEqual(Object.values(userTest));
				// compare id
				expect((user as User).id).toEqual(1);
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

				//slice array to remove take only first name and last name
				//compare all values to each other except id
				// expect(first_name).toEqual(userTest.first_name);
				// expect(password).toEqual(userTest.password);
				// compare id
				expect((user as User).id).toEqual(1);
				expect((user as User).first_name).toEqual(userTest.first_name);
				expect((user as User).password).toEqual(userTest.password);
			});
		});

		it("should delete user", async () => {
			const user = await usersClass.delete(1);
			expect((user as User).id).toEqual(1);
		});
	});
});
