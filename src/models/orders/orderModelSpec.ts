import { execSync } from "child_process";
import { User, usersClass } from "../users/usersModel";
import { Order, ordersClass, order_status_type } from "./orderModel";

describe("Suite to test orders model functions", () => {
	describe("Suite to test orders model functions exist", () => {
		it("index method defined", () => {
			expect(ordersClass.index).toBeDefined;
		});

		it("show method defined ", () => {
			expect(ordersClass.show).toBeDefined;
		});

		it("create method defined", () => {
			expect(ordersClass.create).toBeDefined;
		});

		it("update method defined", () => {
			expect(ordersClass.update).toBeDefined;
		});

		it("delete method defined", () => {
			expect(ordersClass.delete).toBeDefined;
		});
	});

	describe("Suite to test orders model functions work as expected", () => {
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
		const userSecTest: User = {
			first_name: "firstSectest",
			last_name: "lastSectest",
			username: "userSectest",
			password: "passSectest",
		};

		//create two orders to add and perform tests on
		const orderTest: Order = {
			user_id: 1,
			order_status: order_status_type.active,
		};

		const orderSecTest: Order = {
			user_id: 2,
			order_status: order_status_type.completed,
		};

		//empty index test should return empty
		it("checks array is empty using index", async () => {
			const res = await ordersClass.index();
			expect(res).toEqual("empty");
		});

		//two posts tests
		it("creates the first order", async () => {
			//user must exist before creating order
			await usersClass.create(userTest);
			const order1 = await ordersClass.create(orderTest);

			//use object.values to avoid key naming differences
			//slice array to remove id which is the first item
			const cleanOrder = Object.values(order1).slice(1);
			//compare all values to each other except id
			expect(cleanOrder).toEqual(Object.values(orderTest));
			// compare id
			expect((order1 as Order).id).toEqual(1);
		});

		it("creates another order", async () => {
			//user must exist before creating order
			await usersClass.create(userSecTest);
			const order2 = await ordersClass.create(orderSecTest);

			//use object.values to avoid key naming differences
			//slice array to remove id which is the first item
			const cleanOrder = Object.values(order2).slice(1);
			//compare all values to each other except id
			expect(cleanOrder).toEqual(Object.values(orderSecTest));
			// compare id
			expect((order2 as Order).id).toEqual(2);
		});

		//show test
		it("show order at id chosen which is 2", async () => {
			const order = await ordersClass.show(2);
			expect((order as Order).id).toEqual(2);
		});

		//update tests
		it("should update order 2 to active", async () => {
			const order = await ordersClass.update(order_status_type.active, 2);

			//compare order status
			expect((order as Order).order_status).toEqual(order_status_type.active);
			// compare id
			expect((order as Order).id).toEqual(2);
		});

		it("should update order 1 to completed", async () => {
			const order = await ordersClass.update(order_status_type.completed, 1);

			//compare order status
			expect((order as Order).order_status).toEqual(order_status_type.completed);
			// compare id
			expect((order as Order).id).toEqual(1);
		});

		it("should delete order", async () => {
			const order = await ordersClass.delete(1);
			expect(order).toEqual(`order 1 deleted successfully for user 1`);
		});
	});
});
