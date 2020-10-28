export * from './db';
export * from './logger';

export const keys = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Medical',
  LOG_WINSTON: process.env.LOG_WINSTON || 'debug',
  KAFKA_HOST: process.env.KAFKA_HOST || 'kafka:9092',
  KAFKA_GROUP: process.env.KAFKA_GROUP || 'save_data',
  KAFKA_TOPIC_MESSAGE: process.env.KAFKA_TOPIC_MESSAGE || 'topic_message',
  KAFKA_TOPIC_CONVERSATION: process.env.KAFKA_TOPIC_CONVERSATION || 'topic_conversation',
};
