import express from "express";
import routes from "../src/routes";

export function createTestApp() {
	const app = express();
	app.use(express.json());
	app.use("/", routes);
	return app;
}
