import express from "express";
import cors from "cors";
import path from "path";
import engine from "ejs-mate";
import mongoose from "mongoose";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

let allowedOrigins = null;

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins === null) {
            allowedOrigins = (process.env.FRONTEND_URLS || "").split(",").map(s => s.trim());
        }
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS blocked: ${origin}`);
            callback(new Error("Not allowed by CORS"))
        }
    }
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));


app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, '../public')));

app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    if (mongoose.connection.readyState === 2) {
        await new Promise((resolve, reject) => {
            mongoose.connection.once("connected", resolve);
            mongoose.connection.once("error", reject);
        });
        return next();
    }

    try {
        await connectDB();
        return next();
    } catch (err) {
        return res.status(503).json({
            success: false,
            error: "Database connection failed"
        });
    }
});


// Routes

// root Route
app.get("/", (req, res) => {
    // return res.sendFile(path.join(__dirname, '../../Frontend', "index.html"));
    return res.render("pages/importFile");
});


// contacts Route
app.use("/contacts", contactRoutes);


// unkown Route
app.use("/", (req, res) => {
    return res.status(404).render("pages/pageNotFound");
});


// deep server error occured
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ error: "Not allowed by CORS" });
    }

    console.error("Internal ERROR: ", err);

    return res.status(500).json({
        error: "internal server error"
    });
});


export default app;