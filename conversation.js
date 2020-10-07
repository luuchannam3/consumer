const mongoose = require('mongoose')
const { Schema, Model } = mongoose;

const ConversationSchema = new Schema({
    _id: { type: String },
    lm: { type: String },
    url: { type: String },
    type: { type: Number },
    name: { type: String },
    updateAt: { type: Date, default: Date.now },
    listviewer: { type: Array },
    members: { type: Array }
},
    {
        collection: 'Conversation',
        versionKey: false
    }
);
module.exports = mongoose.model('Conversation', ConversationSchema)
