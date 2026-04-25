import "dotenv/config";
import { connectDB } from "../config/db.js";
import { createDefaultAdmin } from "../utils/createDefaultAdmin.js";

await connectDB();
await createDefaultAdmin();
process.exit(0);
