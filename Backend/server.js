import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
await connectDB();
import app from "./src/app.js";

(async () => {

    if (!process.env.VERCEL) {

        // const { default: app } = await import("./src/app.js");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server is listening on 'http://localhost:${PORT}'`);
        });
    }

})()

export default app;