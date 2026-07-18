import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = process.env.VERCEL
    ? path.join("/tmp", "exports")
    : path.join(__dirname, "../../../", "public", "exports");

const clearExportsFolder = () => {

    // delete folder if exists
    if (fs.existsSync(EXPORT_DIR)) {
        console.log(" Deleting: ", EXPORT_DIR);
        fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
    }

    // create new folder if not exists
    if (!fs.existsSync(EXPORT_DIR)) {
        console.log(" Creating: ", EXPORT_DIR);
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }
}

clearExportsFolder();

export { EXPORT_DIR, clearExportsFolder };