import mongoose from 'mongoose';
import { logger } from './logger';

export const ConnectDB = async (mongoURL) => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB connected to ${mongoURL}`);
  } catch (e) {
    logger.error(`Error: ${e}, MONGO_URL: ${mongoURL}`);
  }
};
