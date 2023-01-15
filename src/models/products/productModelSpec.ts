import { execSync } from "child_process";
import { Product, productsClass } from "./productsModel";

describe("Suite to test products model functions", () => {
	describe("Suite to test products model functions exist", () => {
		it("index method defined", () => {
			expect(productsClass.index).toBeDefined;
		});

		it("show method defined ", () => {
			expect(productsClass.show).toBeDefined;
		});

		it("create method defined", () => {
			expect(productsClass.create).toBeDefined;
		});

		it("update method defined", () => {
			expect(productsClass.update).toBeDefined;
		});

		it("delete method defined", () => {
			expect(productsClass.delete).toBeDefined;
		});
	});

	describe("Suite to test products model functions work as expected", () => {
		beforeAll(() => {
			//run reset command before starting
			execSync("yarn reset");
			console.log("database reset");
		});

		//create two products to add and perform tests on
		const productTest: Product = {
			name: "Product 1",
			price: 10.65,
			category: "Home appliance",
		};
		const productSecTest: Product = {
			name: "Product 1",
			price: 405.68,
			category: "Clothes",
		};

		//empty index test should return empty
		it("checks array is empty using index", async () => {
			const res = await productsClass.index();
			expect(res).toEqual("empty");
		});

		//two posts tests
		it("creates the first product", async () => {
			const product1 = await productsClass.create(productTest);
			const cleanProduct = Object.values(product1).slice(1);
			//compare all values to each other except id
			expect(cleanProduct).toEqual(Object.values(productTest));
			// compare id
			expect((product1 as Product).id).toEqual(1);
		});

		it("creates another product", async () => {
			const product2 = await productsClass.create(productSecTest);

			const cleanProduct = Object.values(product2).slice(1);
			//compare all values to each other except id
			expect(cleanProduct).toEqual(Object.values(productSecTest));
			// compare id
			expect((product2 as Product).id).toEqual(2);
		});

		//show test
		it("show product at id chosen which is 2", async () => {
			const product = await productsClass.show(2);
			expect((product as Product).id).toEqual(2);
		});

		//update tests
		describe("Testing product update model function with different combinations", () => {
			it("should update product full data", async () => {
				const productTest: Product = {
					name: "new Product",
					price: 60.37,
					category: "sports equipment",
				};

				const [nameExist, priceExist, categoryExist] = [1, 1, 1];

				const product = await productsClass.update(
					nameExist,
					priceExist,
					categoryExist,
					productTest,
					2,
				);

				//slice array to remove id which is the first item
				const cleanProduct = Object.values(product).slice(1);
				//compare all values to each other except id
				expect(cleanProduct).toEqual(Object.values(productTest));
				// compare id
				expect((product as Product).id).toEqual(2);
			});

			it("should update product name and price only", async () => {
				const productTest = {
					name: "Edited again",
					price: 535854.36,
				};

				const [nameExist, priceExist, categoryExist] = [1, 1, 0];

				const product = await productsClass.update(
					nameExist,
					priceExist,
					categoryExist,
					productTest,
					2,
				);

				//slice array to remove take only first name and last name
				const cleanProduct = Object.values(product).slice(1, 3);
				//compare all values to each other except id
				expect(cleanProduct).toEqual(Object.values(productTest));
				// compare id
				expect((product as Product).id).toEqual(2);
			});

			it("should update price and category only", async () => {
				const productTest = {
					price: 8.54,
					category: "CAT",
				};

				const [nameExist, priceExist, categoryExist] = [0, 1, 1];

				const product = await productsClass.update(
					nameExist,
					priceExist,
					categoryExist,
					productTest,
					1,
				);

				//slice array to remove take only first name and last name
				const cleanProduct = Object.values(product).slice(2);
				//compare all values to each other except id
				expect(cleanProduct).toEqual(Object.values(productTest));
				// compare id
				expect((product as Product).id).toEqual(1);
			});

			it("should update name and category only", async () => {
				const productTest = {
					name: "last edit ",
					category: "Plane fuel",
				};

				const [nameExist, priceExist, categoryExist] = [1, 0, 1];

				const product = await productsClass.update(
					nameExist,
					priceExist,
					categoryExist,
					productTest,
					1,
				);

				//slice array to remove take only first name and last name
				//compare all values to each other except id
				// expect(name).toEqual(productTest.name);
				// expect(password).toEqual(productTest.password);
				// compare id
				expect((product as Product).id).toEqual(1);
				expect((product as Product).name).toEqual(productTest.name);
				expect((product as Product).category).toEqual(productTest.category);
			});
		});

		it("should return products from one category", async () => {
			//value gotten from update tests
			const product = await productsClass.sortByCategory("Plane fuel");

			//should return one product with id 1
			expect((product[0] as Product).id).toEqual(1);
		});

		it("should delete product", async () => {
			const product = await productsClass.delete(1);
			expect((product as Product).id).toEqual(1);
		});
	});
});
