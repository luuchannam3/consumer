import { Kafka } from 'kafkajs';

import { keys, ConnectDB, logger } from './config';
import * as MessageController from './controllers/message';
import * as ConversationController from './controllers/conversation';

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: ['10.0.0.116:9092'],
});

const consumer = kafka.consumer({ groupId: keys.KAFKA_GROUP });

const StartConsumer = async () => {
  await ConnectDB(keys.MONGO_URI);
  await consumer.connect();

  await consumer.subscribe({ topic: keys.KAFKA_TOPIC_MESSAGE });
  await consumer.subscribe({ topic: keys.KAFKA_TOPIC_CONVERSATION });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, message }) => {
      const { value, key } = message;

      logger.info(`key: ${key.toString()}, value: ${value.toString()}`);

      if (topic === keys.KAFKA_TOPIC_MESSAGE) {
        await MessageController.SaveMessage(value.toString());
      }

      if (topic === keys.KAFKA_TOPIC_CONVERSATION) {
        await ConversationController.saveConversation(key.toString(), value.toString());
      }
    },
  });
};

StartConsumer();
