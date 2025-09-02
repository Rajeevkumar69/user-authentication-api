import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import helmet from "helmet";
import apiRouter from "./routes/api.route.js";
const arg = process.argv;

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
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

app.get("/", (req, res) => {
     res.send('Hello World!');
});


app.listen(arg[2], () => {
     console.log(`Server running on ${arg[2]}`);
});