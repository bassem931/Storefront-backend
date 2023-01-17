import { execSync } from "child_process";
import { Order, ordersClass, order_status_type } from "../orders/orderModel";
import { Product, productsClass } from "../products/productsModel";
import { User, usersClass } from "../users/usersModel";
import { OrdersProducts, ordersProductsClass } from "./order_productsModel";

describe("Suite to test orders-products model functions \n", () => {
	describe("Suite to test orders-products model functions exist \n", () => {
		it("index method defined", () => {
			expect(ordersProductsClass.index).toBeDefined;
		});

		it("get order products method defined ", () => {
			expect(ordersProductsClass.getOrderProducts).toBeDefined;
		});

		it("add product method defined", () => {
			expect(ordersProductsClass.addProduct).toBeDefined;
		});

		it("update product method defined", () => {
			expect(ordersProductsClass.updateProduct).toBeDefined;
		});
		it("delete product method defined", () => {
			expect(ordersProductsClass.deleteProduct).toBeDefined;
		});
	});

	describe("Suite to test orders-products model functionality\n", () => {
		beforeAll(() => {
			//run reset command before starting
			execSync("yarn reset");
			console.log("database reset");
		});
		//users must be created first to link orders to
		const userTest: User = {
			first_name: "firsttest",
			last_name: "lasttest",
			username: "usertest",
			password: "passtest",
		};

		//create two orders to add and perform tests on
		const orderTest: Order = {
			user_id: 1,
			order_status: order_status_type.active,
		};

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

		it("gets all rows in order_products table", async () => {
			const res = await ordersProductsClass.index();
			expect(res).toEqual("empty");
		});

		it("add new product to order", async () => {
			//to add product to order an order and product must be created
			//to create an order a user must be created

			//create user
			await usersClass.create(userTest);

			//create product
			await productsClass.create(productTest);

			//create order
			await ordersClass.create(orderTest);

			//add product by calling addproduct function
			const prodOrder = await ordersProductsClass.addProduct(productOrderDetails);

			expect(prodOrder).toEqual("product number 1 created in order 1");
		});

		it("add another product to same order", async () => {
			//to add product to order an order and product must be created

			//order and user already created

			//create the second product
			await productsClass.create(productSecTest);

			//add product by calling addproduct function
			const prodOrder = await ordersProductsClass.addProduct(secProductOrderDetails);

			expect(prodOrder).toEqual("product number 2 created in order 1");
		});

		it("get all products in a order by order_id ", async () => {
			const productInOrder = await ordersProductsClass.getOrderProducts(1);

			//use object.values to avoid key naming differences
			//slice array to remove id which is the first item
			const cleanOrder = Object.values(productInOrder[0]).slice(1);
			//compare all values to each other except id
			expect(cleanOrder).toEqual(Object.values(productOrderDetails));
			// compare id
			expect((productInOrder[0] as OrdersProducts).id).toEqual(1);

			//use object.values to avoid key naming differences
			//slice array to remove id which is the first item
			const cleanOrder2 = Object.values(productInOrder[1]).slice(1);
			//compare all values to each other except id
			expect(cleanOrder2).toEqual(Object.values(secProductOrderDetails));
			// compare id
			expect((productInOrder[1] as OrdersProducts).id).toEqual(2);
		});

		it("add same order to test that it should update row ", async () => {
			//add product by calling addproduct function
			const prodOrder = await ordersProductsClass.addProduct(secProductOrderDetails);

			expect(prodOrder).toEqual("product updated");
		});

		// it("update first product quantity to 3", async () => {
		// 	const productupdated: OrdersProducts = {
		// 		order_id: 1,
		// 		product_id: 1,
		// 		quantity: 3,
		// 	};

		// 	const prodUpdate = await ordersProductsClass.updateProduct(productupdated);

		// 	expect((prodUpdate as OrdersProducts).quantity).toEqual(productupdated.quantity);
		// });

		it("delete second product", async () => {
			// call function to delete second product
			const prodDelete = await ordersProductsClass.deleteProduct(
				secProductOrderDetails.order_id,
				secProductOrderDetails.product_id,
			);

			expect(prodDelete).toEqual("product number 2 deleted from order 1");
		});
	});
});
