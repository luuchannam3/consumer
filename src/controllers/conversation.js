import { Conversation } from 'models-common';

export const saveConversation = async (key, value) => {
  const parseData = JSON.parse(value);
  const { _id, lm, newUserId } = parseData;

  switch (key) {
    case 'update_lm_conversation':
      await Conversation.bulkWrite([
        {
          updateOne: {
            filter: { _id },
            update: { lm },
          },
        },
      ]);
      break;

    case 'add_user_to_group':
      await Conversation.findByIdAndUpdate(
        { _id },
        { $push: { members: newUserId } },
        { new: true },
      );
      break;

    case 'add_friend':
    default:
      await Conversation.bulkWrite([
        {
          insertOne: {
            document: parseData,
          },
        },
      ]);
  }
};
