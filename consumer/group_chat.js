// import { Schema, model } from 'mongoose';
const mongoose =require('mongoose')
const { Schema, Model} = mongoose;

const GroupChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date , default: Date.now},
    isImage: { type: Boolean, default: false },
    isSender: { type: String }
},
    {
        collection: 'Group_Chat',
        versionKey: false
    }
);
module.exports = mongoose.model('Group_Chat',GroupChatSchema)
// export default model('Private_Chat', PrivateChatSchema);
