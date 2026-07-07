import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.resolve(projectRoot, ".env") });
dotenv.config({ path: path.resolve(__dirname, "config.env") });

const connectDB = async () => {
    try {
        const dbType = process.env.DB_TYPE?.trim().toLowerCase() || "local";
        const uri =
            (dbType === "atlas"
                ? process.env.MONGO_ATLAS_URI || process.env.MONGO_URI || process.env.MONGODB_URI
                : process.env.MONGO_LOCAL_URI || process.env.MONGO_URI || process.env.MONGODB_URI
            );

        if (!uri) {
            throw new Error(`Missing MongoDB URI for DB_TYPE=${dbType}`);
        }
        console.log(`Connecting to MongoDB (${dbType})...`,uri);
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log(`MongoDB Connected (${dbType})`);
    } catch (error) {
        if (error?.code === 8000 || error?.message?.includes("bad auth")) {
            console.error("Atlas authentication failed. Please verify the username and password in .env and ensure your Atlas database user is enabled.");
        } else {
            console.error("MongoDB connection error:", error);
        }
        process.exit(1);
    }
};

export default connectDB;
