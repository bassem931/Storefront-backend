import { execSync } from "child_process";
import { Product, productsClass } from "./productsModel";

describe("Suite to test products model functions \n", () => {
	describe("Suite to test products model functions exist\n", () => {
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

	describe("Suite to test products model functions work as expected\n", () => {
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
			try {
				const res = await productsClass.index();
				expect(res).toEqual("empty");
			} catch (error) {
				fail(error);
			}
		});

		//two posts tests
		it("creates the first product", async () => {
			try {
				const product1 = await productsClass.create(productTest);

				expect(200);
				expect(product1).toEqual("product 1 has been created");
			} catch (error) {
				fail(error);
			}
		});

		it("creates another product", async () => {
			try {
				const product2 = await productsClass.create(productSecTest);

				expect(200);
				expect(product2).toEqual("product 2 has been created");
			} catch (error) {
				fail(error);
			}
		});

		//show test
		it("show product at id chosen which is 2", async () => {
			try {
				const product = await productsClass.show(2);
				expect((product as Product).id).toEqual(2);
			} catch (error) {
				fail(error);
			}
		});

		//update tests
		describe("Testing product update model function with different combinations\n", () => {
			it("should update product full data", async () => {
				const productTest: Product = {
					name: "new Product",
					price: 60.37,
					category: "sports equipment",
				};

				const [nameExist, priceExist, categoryExist] = [1, 1, 1];

				try {
					const product = await productsClass.update(
						nameExist,
						priceExist,
						categoryExist,
						productTest,
						2,
					);

					expect(product).toEqual("product 2 updated successfully with name ,price and category");
				} catch (error) {
					fail(error);
				}
			});

			it("should update product name and price only", async () => {
				const productTest = {
					name: "Edited again",
					price: 535854.36,
				};

				const [nameExist, priceExist, categoryExist] = [1, 1, 0];

				try {
					const product = await productsClass.update(
						nameExist,
						priceExist,
						categoryExist,
						productTest,
						2,
					);

					expect(product).toEqual("product 2 updated successfully with name and price");
				} catch (error) {
					fail(error);
				}
			});

			it("should update price and category only", async () => {
				const productTest = {
					price: 8.54,
					category: "CAT",
				};

				const [nameExist, priceExist, categoryExist] = [0, 1, 1];

				try {
					const product = await productsClass.update(
						nameExist,
						priceExist,
						categoryExist,
						productTest,
						1,
					);

					expect(product).toEqual("product 1 updated successfully with price and category");
				} catch (error) {
					fail(error);
				}
			});

			it("should update name and category only", async () => {
				const productTest = {
					name: "last edit ",
					category: "Plane fuel",
				};

				const [nameExist, priceExist, categoryExist] = [1, 0, 1];

				try {
					const product = await productsClass.update(
						nameExist,
						priceExist,
						categoryExist,
						productTest,
						1,
					);

					expect(product).toEqual("product 1 updated successfully with name and category");
				} catch (error) {
					fail(error);
				}
			});
		});

		it("should return products from one category", async () => {
			try {
				//value gotten from update tests
				const product = await productsClass.sortByCategory("Plane fuel");

				//should return one product with id 1
				expect((product[0] as Product).id).toEqual(1);
			} catch (error) {
				fail(error);
			}
		});

		it("should delete product", async () => {
			try {
				const product = await productsClass.delete(1);
				expect(product).toEqual("product 1 deleted successfully");
			} catch (error) {
				fail(error);
			}
		});
	});
});
