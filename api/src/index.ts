import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { checkDatabaseConnection } from "./config/checkDbConnection";
import menuRoutes from "./routes/menuRoutes";

if (process.env.NODE_ENV !== "production") {
    checkDatabaseConnection();
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});