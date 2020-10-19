const kafka = require('kafka-node');
const privateChat = require('./private_chat');
const groupChat = require('./group_chat');
const mongoose = require('mongoose');
const type = require('./type');
const converstion = require('./conversation');
const config = require('./config');

// RetryConnection :

(async () => {
  function RetryConnection() {
    mongoose.connect(config.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  mongoose.connection.on('error', err => {
    if(err) throw(err);
    setTimeout(RetryConnection, 5000);
  });

  mongoose.connection.on('connected', async () => {
    console.log("database connected");
  });

  mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
  const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'consumer-client', kafkaClientOptions);

  const topics = [
    { topic: 'room' }
  ];

  const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
  };
  const kafkaConsumer = new kafka.HighLevelConsumer(kafkaClient, topics, options);

  kafkaConsumer.on('message', async function (message) {
    console.log("consumer");
    console.log('Message received:', message);
    const messageBuffer = new Buffer.from(message.value, 'binary');
    const decodedMessage = type.fromBuffer(messageBuffer.slice(0));
    console.log('Decoded Message:', typeof decodedMessage, decodedMessage);

    // phan biet message text hay image 
    var isImage;
    var file_extension = decodedMessage.Content.split('.');
    if (file_extension.length == 2) {
      if (file_extension[1] == 'png' || file_extension[1] == 'jpg' || file_extension[1] == 'psd' || file_extension[1] == 'tiff') isImage = true;
      else isImage = false;
    }
    else isImage = false;
    // phan biet group_chat va private_chat dua vao id
    function distinguish(str) {
      var res = str.split('-');
      if (res.length != 2) return false;
      else {
        var str1 = res[0].substring(2, res[0].length);
        var str2 = res[1].substring(2, res[1].length);
        var reg = new RegExp(/^[0-9]*$/);
        if (reg.test(str1) == true && reg.test(str2) == true) return true;
        else return false;
      }
    }
    var result = distinguish(decodedMessage.conversation_id);
    var message1;
    if (result == true) {
      message1 = new privateChat({
        id_Conversation: decodedMessage.conversation_id,
        Content: decodedMessage.Content,
        isSender: decodedMessage.isSender,
        isImage: isImage
      });
    }
    else {
      message1 = new groupChat({
        id_Conversation: decodedMessage.conversation_id,
        Content: decodedMessage.Content,
        isSender: decodedMessage.isSender,
        isImage: isImage
      });
    }
    message1.save((err) => {
      if (err) console.log(err);
    });
    // cap nhat last message, updateAt trong conversation
    converstion.update({ _id: decodedMessage.conversation_id }, {
      lm: decodedMessage.Content,
      updateAt: Date.now()
    }, function (err, affected, resp) {
      console.log(resp);
    });
    
  });
  kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
  kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
})().catch(e => {
  console.error(e);
});