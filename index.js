const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
// const { Server } = require("socket.io");
// const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:1212",
		methods: ["GET", "POST"],
	},
});
app.use(cors()); // Add cors middleware

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", {
			signal: data.signalData,
			from: data.from,
			name: data.name,
		});
	});

	socket.on("answerCall", (data) =>
		io.to(data.to).emit("callAccepted", data.signal)
	);

	socket.on("disconnect", () => {
		socket.broadcast.emit("Call Ended");
	});
});

server.listen(4000, () => "Server is running on port 4000");
