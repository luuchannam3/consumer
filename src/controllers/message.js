import { Message } from 'models-common';

export const SaveMessage = async (data) => {
  const parseData = data.map((mess) => {
    const res = {
      insertOne: {
        document: mess.value,
      },
    };

    return res;
  });

  await Message.bulkWrite(parseData);
};
