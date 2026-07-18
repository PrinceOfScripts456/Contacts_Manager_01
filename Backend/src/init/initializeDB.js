import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import mongoose from "mongoose";
import connectDB from "../config/db.js";


(async () => {

    try {

        await connectDB();

        const { default: Contact } = await import("../models/contact.js");

        const { default: contactSchema } = await import("../schema/contact.js");
        const { default: validateData } = await import("../controllers/contacts/validateData.js");
        const { default: contacts } = await import("./data.js");

        let isValid = true;

        for (let contact of contacts) {
            contact = validateData(contactSchema, contact, "silent");

            if (contact == false) {
                isValid = false;
                break;
            }
        }

        if (isValid == false) {
            return console.error("  fun(): invalid data");
        }

        // Create new if _id does not exist or update if exist
        const createdContacts = await Contact.bulkWrite(
            contacts.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id || new mongoose.Types.ObjectId() },
                    update: { $set: doc },
                    upsert: true,
                }
            }))
        );

        if (!createdContacts) {
            console.error("  fun(): initialization failed due to DB error");
        }

        console.log(" fun(): initialization successful");
        console.log(`  Updated: ${createdContacts.modifiedCount}`);
        console.log(`  Created: ${createdContacts.upsertedCount}`);

    } catch (err) {

        console.error("Error: ", err);

    } finally {

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

    }

})()

// Mongo Connection States
// 0 Disconnected
// 1 Connected
// 2 Connecting
// 3 Disconnecting