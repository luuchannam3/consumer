import { Message } from 'models-common';

export const SaveMessage = async (data) => {
  const parseData = JSON.parse(data);

  await Message.bulkWrite([
    {
      insertOne: {
        document: parseData,
      },
    },
  ]);
};
