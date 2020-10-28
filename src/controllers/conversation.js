import { Conversation } from 'models-common';

export const saveConversation = async (data) => {
  const parseData = data.map((mess) => {
    const { key, value } = mess;
    const { _id, lm, newUserId } = value;
    let res;
    switch (key) {
      case 'update_lm_conversation':
        res = {
          updateOne: {
            filter: { _id },
            update: { lm },
          },
        };
        break;

      case 'add_user_to_group':
        res = {
          updateOne: {
            filter: { _id },
            update: { $push: newUserId },
          },
        };
        break;

      case 'add_friend':
      default:
        res = {
          insertOne: {
            document: value,
          },
        };
    }

    return res;
  });

  await Conversation.bulkWrite(parseData);
};
