import express, { Request, Response } from "express";
import { port } from "../Config/envConfig";
import bodyParser from "body-parser";

const app: express.Application = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Welcome to our store Backend");
});

app.listen(3000, () => {
	console.log(`starting app on: ${port}`);
});
