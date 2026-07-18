import Contact from "../../models/contact.js";
import contactSchema from "../../schema/contact.js";
import validateData from "./validateData.js";

async function updateContact(req, res) {

    try {

        let data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phones: req.body.phones || [],
            emails: req.body.emails || [],
            dates: req.body.dates || [],
            note: req.body.note,
            avatar: req.body.avatar,
            website: req.body.website,
            address: req.body.address,
            company: req.body.company,
            jobTitle: req.body.jobTitle,
            modified_at: Date.now(),
        };

        data = validateData(contactSchema, data);

        if (data === false) {
            console.error("  updateContact(): validation failed");

            return res.status(400).json({
                success: false,
                message: "validation failed"
            });
        }

        const editedContact = await Contact.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });

        if (!editedContact) {
            console.log("  updateContact(): contact not found");

            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        console.log("  updateContact(): contact updated");

        return res.status(200).json({
            success: true,
            message: "Contact edited successfully",
            contact: editedContact
        });

    } catch (err) {
        console.error(" updateContact(): ", err);

        return res.status(500).json({
            success: false,
            message: "error occurred while updating contact."
        });
    }
}

export { updateContact };