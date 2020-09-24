const moment = require('moment');
const kafka = require('kafka-node');
const privateChat = require('./private_chat');
const groupChat = require('./group_chat');
const mongoose = require('mongoose');
const type = require('./type');

// RetryConnection :

(async () => {
  function RetryConnection() {
    console.log("1")
    mongoose.connect('mongodb://mongodb:27017/Medical', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  
  mongoose.connection.on('error', err => {
    console.log("2")
    setTimeout(RetryConnection, 5000);
  });
  
  mongoose.connection.on('connected', async () => {
    console.log("3")
    console.log("database connected")
  });
  
  mongoose.connect('mongodb://mongodb:27017/Medical', {
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
  
  kafkaConsumer.on('message', async function(message) {
    console.log("12121")
    console.log('Message received:', message);
    const messageBuffer = new Buffer(message.value, 'binary');

    const decodedMessage = type.fromBuffer(messageBuffer.slice(0));
    console.log('Decoded Message:', typeof decodedMessage, decodedMessage);

    const message1 = new privateChat({
      id_Conversation: decodedMessage.conversation_id,
      Content: decodedMessage.Content,
      isSender: decodedMessage.isSender,
    });
    message1.save((err) => {
      if (err) console.log(err)
    })

  });
  
  kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
  kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
})().catch(e =>{
  console.error(e)
});