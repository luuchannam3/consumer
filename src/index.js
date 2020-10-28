import { Kafka } from 'kafkajs';

import { keys, ConnectDB, logger } from './config';
import * as MessageController from './controllers/message';
import * as ConversationController from './controllers/conversation';

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: [keys.KAFKA_HOST],
});

const consumer = kafka.consumer({ groupId: keys.KAFKA_GROUP });

const StartConsumer = async () => {
  await ConnectDB(keys.MONGO_URI);
  await consumer.connect();

  await consumer.subscribe({ topic: keys.KAFKA_TOPIC_MESSAGE });
  await consumer.subscribe({ topic: keys.KAFKA_TOPIC_CONVERSATION });

  await consumer.run({
    autoCommit: true,
    eachBatch: async ({ batch }) => {
      const typeMessages = [];
      const typeConversation = [];
      const kafkaMessages = batch.messages.map((message) => {
        const kafkaMessage = {
          key: message.key.toString(),
          value: JSON.parse(message.value.toString()),
        };

        return kafkaMessage;
      });

      for (let i = 0; i < kafkaMessages.length; i++) {
        logger.info(`key: ${kafkaMessages[i].key}, value: ${kafkaMessages[i].value}`);

        if (kafkaMessages[i].key === '') {
          typeMessages.push(kafkaMessages[i]);
        } else {
          typeConversation.push(kafkaMessages[i]);
        }
      }

      const promises = [
        MessageController.SaveMessage(typeMessages),
        ConversationController.saveConversation(typeConversation),
      ];

      await Promise.all(promises);
    },
  });
};

StartConsumer();
