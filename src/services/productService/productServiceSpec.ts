import { execSync } from "child_process";
import {
	OrdersProducts,
	ordersProductsClass,
} from "../../models/order-products/order_productsModel";
import { Order, ordersClass, order_status_type } from "../../models/orders/orderModel";
import { Product, productsClass } from "../../models/products/productsModel";
import { User, usersClass } from "../../models/users/usersModel";
import { productServices } from "./productService";

describe("test order Services", () => {
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

	//create two active orders to add and perform tests on
	const orderTest: Order = {
		user_id: 1,
		order_status: order_status_type.active,
	};

	const orderTest2: Order = {
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
		name: "Product 2",
		price: 405.68,
		category: "Clothes",
	};

	const productThirdTest: Product = {
		name: "Product 3",
		price: 185,
		category: "sports",
	};

	const productFourthTest: Product = {
		name: "Product 4",
		price: 6.98,
		category: "laptops",
	};

	const productFifthTest: Product = {
		name: "Product 5",
		price: 5190,
		category: "ORM",
	};

	it("fiveMostPopular method defined", () => {
		expect(productServices.fiveMostPopular).toBeDefined;
	});

	it("get the five most popular products", async () => {
		//create user
		await usersClass.create(userTest);

		//create product
		await productsClass.create(productTest);

		//create second product
		await productsClass.create(productSecTest);

		//create third product
		await productsClass.create(productThirdTest);

		//create fourth product
		await productsClass.create(productFourthTest);

		//create fifth product
		await productsClass.create(productFifthTest);

		//create order
		await ordersClass.create(orderTest);

		//create second order
		await ordersClass.create(orderTest2);

		//order details for order 1 product 1
		const productOrderDetails: OrdersProducts = {
			order_id: 1,
			product_id: 1,
			quantity: 16,
		};

		//order details for order 1 product 2
		const secProductOrderDetails: OrdersProducts = {
			order_id: 1,
			product_id: 2,
			quantity: 8,
		};

		//order details for order 1 product 4
		const fourthProductOrderDetails: OrdersProducts = {
			order_id: 1,
			product_id: 4,
			quantity: 50,
		};

		//add products to first order
		//product id 1
		await ordersProductsClass.addProduct(productOrderDetails);

		//product id 2
		await ordersProductsClass.addProduct(secProductOrderDetails);

		//id product id 4
		await ordersProductsClass.addProduct(fourthProductOrderDetails);

		//order details for order 2 product 1
		const productSecOrderDetails: OrdersProducts = {
			order_id: 2,
			product_id: 1,
			quantity: 5,
		};

		//order details for order 2 product 2
		const secProductSecOrderDetails: OrdersProducts = {
			order_id: 2,
			product_id: 2,
			quantity: 18,
		};

		//order details for order 2 product 5
		const secProductFifthOrderDetails: OrdersProducts = {
			order_id: 2,
			product_id: 5,
			quantity: 1,
		};

		//add products to first order
		await ordersProductsClass.addProduct(productSecOrderDetails);
		await ordersProductsClass.addProduct(secProductSecOrderDetails);
		await ordersProductsClass.addProduct(secProductFifthOrderDetails);

		let fiveMostPopular;

		try {
			fiveMostPopular = await productServices.fiveMostPopular();
		} catch (error) {
			fail(error);
		}

		//these values were retrieved by manually testing and analyzing the results
		//this is because the data created here had several factors

		//2 is the most popular it was ordered in 2 orders with a quantity of 26
		expect((fiveMostPopular as string | any[])[0].product_id).toEqual(2);

		//1 is the second most popular it was ordered in 2 orders with a quantity of 21
		expect((fiveMostPopular as string | any[])[1].product_id).toEqual(1);
		//4 is the third most popular it was ordered in 1 order with a quantity of 50
		//although 50 is a relatively large quantity it does not reflect popularity always
		expect((fiveMostPopular as string | any[])[2].product_id).toEqual(4);
		//5 is the fourth most popular it was ordered in 1 order with a quantity of 1
		expect((fiveMostPopular as string | any[])[3].product_id).toEqual(5);
	});
});
