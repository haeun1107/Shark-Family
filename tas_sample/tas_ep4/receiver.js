// description : receive data from EP4
// usage :
// const receive = require('./receive');
// function receive_message_handler(EP4_message_object) { ... }
// receive.message_handler = receive_message_handler;
const inspection = require('./abnormal/inspection_list');
const mqtt = require('mqtt');
const sensors_info = require('./sensors_info');
const abnormal_detector = require('./abnormal/abnormal_detector');

const brokerIp = '210.94.199.225';
const brokerPort = 1919;
const brokerUrl = `mqtt://${brokerIp}:${brokerPort}`;

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${brokerUrl}`);

  for (const sensor_info of sensors_info) {
    // Subscribe to the topic
    client.subscribe(sensor_info.topic, (err) => {
      if (err) {
        console.error('Failed to subscribe to topic:', err);
      } else {
        console.log(`Subscribed to topic "${sensor_info.topic}"`);
      }
    });
  }
});

client.on('message', (receivedTopic, message) => {
  for (const sensor_info of sensors_info) {
    if (receivedTopic === sensor_info.topic) {
      try {
        // Convert square brackets to curly braces
        const preprocessedMessage = message.toString().replace(/\[(.*?)\]/, '{$1}');

        // Parse the corrected JSON
        const parsedMessage = JSON.parse(preprocessedMessage);
        
        // ✅ [1] 이상치 판단
        const sensor_data = parsedMessage.data; // 예: { nh4, ph, turbi, salt, do, temp }
        const result = abnormal_detector.is_abnormal(sensor_data);

        // ✅ [2] 이상이면 리스트에 추가
        if (result.is_abnormal) {
          inspection.add_inspection_data(receivedTopic, sensor_data);
        }

        // Access specific fields from the parsed JSON
        receiver.message_handler(parsedMessage);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    }
  }
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});

let receiver = {};

module.exports = receiver;
