import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
    path: "./.env",
});

// Log environment variables to verify they are loaded
console.log("PORT:", process.env.PORT); // Should log 8000
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN); // Should log *

//const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello world');
// });

// app.listen(process.env.PORT, () => {
//     console.log(`Example app listening on port ${process.env.PORT}`);
// });

// Uncomment and use connectDB if needed
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Mongodb connection failed" + error);
    });
