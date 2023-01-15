import { execSync } from "child_process";
import {
	OrdersProducts,
	ordersProductsClass,
} from "../../models/order-products/order_productsModel";
import { Order, ordersClass, order_status_type } from "../../models/orders/orderModel";
import { Product, productsClass } from "../../models/products/productsModel";
import { User, usersClass } from "../../models/users/usersModel";
import { orderServices } from "./orderService";

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

	//create two orders to add and perform tests on
	const orderTest: Order = {
		user_id: 1,
		order_status: order_status_type.active,
	};

	const orderTest2: Order = {
		user_id: 1,
		order_status: order_status_type.completed,
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

	it("activeOrders method defined", () => {
		expect(orderServices.activeOrders).toBeDefined;
	});

	it("completedOrders method defined ", () => {
		expect(orderServices.completedOrders).toBeDefined;
	});

	it("get active orders for user 1", async () => {
		//create user
		await usersClass.create(userTest);

		//create product
		await productsClass.create(productTest);

		//create second product
		await productsClass.create(productSecTest);

		//create order
		await ordersClass.create(orderTest);

		//add products to order
		await ordersProductsClass.addProduct(productOrderDetails);
		await ordersProductsClass.addProduct(secProductOrderDetails);

		const activeOrders = await orderServices.activeOrders(1);

		expect(activeOrders[0].product_id).toEqual(1);
		expect(activeOrders[0].quantity).toEqual(16);
		expect(activeOrders[1].product_id).toEqual(2);
		expect(activeOrders[1].quantity).toEqual(8);
	});

	it("get completed orders for user 1", async () => {
		//first set order created order to completed
		await ordersClass.update(order_status_type.completed, 1);

		const completedOrders = await orderServices.completedOrders(1);

		expect(completedOrders[0].product_id).toEqual(1);
		expect(completedOrders[0].quantity).toEqual(16);
		expect(completedOrders[1].product_id).toEqual(2);
		expect(completedOrders[1].quantity).toEqual(8);
	});
});
