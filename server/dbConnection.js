//imports
import dotenv from "dotenv";
import pg from "pg";

//config dotenv
dotenv.config();

//create a pool with pg
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
