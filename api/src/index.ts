import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { checkDatabaseConnection } from "./config/checkDbConnection";
import routes from "./routes";

if (process.env.NODE_ENV !== "production") {
    checkDatabaseConnection();
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL;

app.use(cors({
	origin: allowedOrigins,
	credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});