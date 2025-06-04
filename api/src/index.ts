import { checkDatabaseConnection } from "./config/checkDbConnection";

if (process.env.NODE_ENV !== "production") {
    checkDatabaseConnection();
}
