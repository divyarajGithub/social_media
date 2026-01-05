import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectToDB } from "./config/db";
import logger from "./config/logger";

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8000;

const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      logger.info(`🚀 Server started at port ${PORT}`);
    });
  } catch (err) {
    logger.error("something went wrong while starting server", err);
  }
};

startServer();
