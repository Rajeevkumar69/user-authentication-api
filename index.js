import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import apiRouter from "./routes/api.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
const arg = process.argv;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(helmet());

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

try {
     await mongoose.connect(`${dbUrl}/${dbName}`);
     console.log("Connected to Database");
} catch (error) {
     console.error("Database Connection Failed");
     process.exit(1);
}

app.use("/api", apiRouter);
app.use("/", authRouter);

app.get("/", (req, res) => {
     res.send("Hello World!");
});

app.listen(arg[2], () => {
     console.log(`Server running on ${arg[2]}`);
});
