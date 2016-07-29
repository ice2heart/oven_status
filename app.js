//https://github.com/knolleary/pubsubclient/blob/master/examples/mqtt_esp8266/mqtt_esp8266.ino -- esp

const mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
const client = mqtt.connect('mqtt://localhost');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
// Create a screen object.
const screen = blessed.screen({
    smartCSR: true
});
const grid = new contrib.grid({
    rows: 5,
    cols: 1,
    screen: screen
});

const line = grid.set(0, 0, 4, 1, contrib.line, {
    style: {
        line: "yellow",
        text: "green",
        baseline: "black"
    },
    //xLabelPadding: 3,
    //xPadding: 5,
    minY: 30,
    maxY: 90,
    showLegend: true,
    //wholeNumbersOnly: false, //true=do not show fraction in y axis
    label: 'Data'
});
var series = {
    title: 'Ampers',
    x: [],
    y: []
};
const box = grid.set(4, 0, 1, 1, blessed.log, {
    label: 'Log',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    }
});

/*conter = 0;
setInterval(()=>{
    client.publish('oven', 'Hello 10');
}, 1000);*/

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

client.on('connect', function() {
    client.subscribe('oven');

    client.publish('oven', 'Hello 10');
});

client.on('message', function(topic, message) {
    var rx = /(\S+)\s(\d+)/g;
    var data = rx.exec(message.toString());
    var date = new Date(Date.now());
    series.y.push(data[2]);
    series.x.push(date.toLocaleString());
    line.setData([series]);
    box.add(`{bold}${topic.toString()}{/bold}: ${message.toString()}`);
    screen.render();
    //client.end();
});
screen.render();
