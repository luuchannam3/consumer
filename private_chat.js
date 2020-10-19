const mongoose =require('mongoose')
const { Schema} = mongoose;

const PrivateChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date , default: Date.now},
    isImage: { type: String , default: false},
    isSender: { type: String }
},
    {
        collection: 'Private_Chat',
        versionKey: false
    }
);
module.exports = mongoose.model('Private_Chat',PrivateChatSchema)
