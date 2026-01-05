import mongoose from "mongoose";
import logger from "./logger";

export const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);

    logger.info("MongoDB database connected successfully");
  } catch (err) {
    logger.error("MongoDB database connection failed", err);
    process.exit(1);
  }
};
