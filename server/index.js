// Import the Express module and Create a new instance of Express
const app = require('express')();

// Create a Node.js based http server
const http = require('http').createServer(app);

// Create a Socket.IO server and attach it to the http server
const io = require("socket.io")(http, {
	cors: {
		origins: [
			"http://localhost:4200",
		],
	},
});

// Import the TypeFaster game events file.
var gamePlay = require('./gameEvents');

// User Middleware Auth Token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  next();
});

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.on('connection', (socket) => {
  console.log('a user connected');
  gamePlay.initializeGame(io,socket)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Listen on port 3000
http.listen(3000, () => {
  console.log('listening on port :3000');
});