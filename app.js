//https://github.com/knolleary/pubsubclient/blob/master/examples/mqtt_esp8266/mqtt_esp8266.ino -- esp

const mqtt    = require('mqtt');
const client  = mqtt.connect('mqtt://localhost');
const blessed = require('blessed');
// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
});

const box = blessed.log({
  top: 'center',
  bottom: 1,
  width: '80%',
  height: '100%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  }
});
screen.append(box);


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

client.on('connect', function () {
  client.subscribe('oven');
  client.publish('oven', 'Hello mqtt');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  //client.end();
});
