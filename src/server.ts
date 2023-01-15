import express, { Request, Response } from "express";
import { port } from "../Config/envConfig";
import bodyParser from "body-parser";
import cors from "cors";
import { userhandler } from "./handlers/users/usersHandler";
import { producthandler } from "./handlers/products/productsHandler";
import { orderhandler } from "./handlers/orders/orderHandler";
import { order_productshandler } from "./handlers/order_products/order-productsHandler";
import { servicesHandler } from "./handlers/services_Routes/serviceHandler";

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200,
};

// create server instance
const app: express.Application = express();

//use cors for whole app
app.use(cors(corsOptions));

//body parser used for whole app
app.use(bodyParser.json());

//call users handler
userhandler(app);

//call products handler
producthandler(app);

//call orders handler
orderhandler(app);

//call handler for products order
order_productshandler(app);

//call handler for services. this can be broken to several handlers in the future
servicesHandler(app);

//get request for health checking
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Welcome to our store Backend");
});

let portUse: number;

if (port === undefined) {
	portUse = 3000;
} else {
	portUse = parseInt(port);
}

//start server
app.listen(portUse, () => {
	console.log(`starting app on: ${port}`);
});

export default app;
