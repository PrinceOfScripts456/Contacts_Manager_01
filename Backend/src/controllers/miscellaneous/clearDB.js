import Contact from "../../models/contact.js";

const deleteAllContacts = async (req, res) => {

    try {

        if (req.body.token === process.env.DELETE_Token) {

            const result = await Contact.deleteMany({});

            console.log("deleteAllContacts():", result);

            return res.status(200).json({
                success: true,
                deleted: result.deletedCount
            });
        }
        else {
            console.log("deleteAllContacts(): Access Denied, invalid token");

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

    } catch (err) {
        console.error("deleteAllContacts(): ", err);

        return res.status(500).json({
            success: false,
            message: "internal error"
        });
    }
}

export default deleteAllContacts;