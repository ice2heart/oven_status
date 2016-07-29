//https://github.com/knolleary/pubsubclient/blob/master/examples/mqtt_esp8266/mqtt_esp8266.ino -- esp

const mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
const client = mqtt.connect('mqtt://localhost');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
// Create a screen object.
const screen = blessed.screen({
    smartCSR: true
});

const box = blessed.log({
    top: 0,
    bottom: 1,
    width: '100%',
    height: '30%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    }
});
screen.append(box);

const line = contrib.line({
    top: 1,
    bottom: 0,
    width: '100%',
    height: '70%',
    style: {
        line: "yellow",
        text: "green",
        baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: false, //true=do not show fraction in y axis
    label: 'Title'
});
var series1 = {
    title: 'apples',
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5]
};
screen.append(line); //must append before setting data
line.setData([series1]);


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

client.on('connect', function() {
    client.subscribe('oven');
    client.publish('oven', 'Hello mqtt');
});

client.on('message', function(topic, message) {
    // message is Buffer
    box.add(`{bold}${topic.toString()}{/bold}: ${message.toString()}`);
    screen.render();
    //console.log(message.toString());
    //client.end();
});
screen.render();
