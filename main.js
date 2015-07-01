var express = require('express'); 
var app = express(); 
var server = require('http').createServer(app); 
var path = require('path');

var raspi = require('raspi-io');
var five = require('johnny-five');

var board = new five.Board({
	io: new raspi()
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/node_modules', express.static('node_modules'));
app.use('/app', express.static('app'));

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Nodebot - Test Harness listening at http://%s:%s', host, port);
});

var led = undefined;
var ledState = false;
board.on("ready", function() {
	led = new five.Led('P1-8');
	led.off();

	initalisePins();
});


function initalisePins() {
	var pin7 = new five.Pin(7);
	pin7.query(function(state) {
	  console.log(state);
	  console.log('state.value' + state.value);
	});
	
	var pin10 = new five.Pin(10);
	pin10.query(function(state) {
	  console.log(state);
	  console.log('state.value' + state.value);
	});
	
	var ignoreState = false;
	var timer = new Date();
	pin7.read(function(error, value) {
		if (ignoreState === true)
			return;
		
		if (error !== undefined && error !== null)
			console.log('Error:' + error);
		else{
			if (value == 0)		//only output when value is high
				return;
			
			console.log(value);
			console.log('Response recieved in :' + (new Date() - timer));	
		}
			
		timer = new Date();
	});
	
	setInterval(function() {
		ignoreState = true;
		timer = new Date();
		pin7.high();
		console.log('set pin10 high');
		
		setTimeout(function() {
			pin7.low();
			ignoreState = false;
			
			console.log('set pin10 low - ' + (new Date() - timer));
			timer = new Date();
		}, 10);
		
	}, 1000);
}

var io = require('socket.io')(server);
io.on('connection', function(socket) { 
	console.log('user connected');
  
	socket.on('toggle', function() {
		console.log('toggle called');
		
		if (led !== undefined) {
			console.log('ledState: ' + ledState);
			ledState === true ? led.off() : led.on();
			ledState = !ledState;      
		}
	});
});
