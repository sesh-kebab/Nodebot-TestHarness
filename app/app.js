var socket = io();

function toggleLED() {
	socket.emit('toggle', 'GPIO4');
}