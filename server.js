// Express connection
const express = require("express");

const app = express();

//Random Id generator
const { v4: uuidv4 } = require("uuid");

// Cereating a Server
const server = require("http").Server(app);

// Socket connections
const io = require("socket.io")(server);

// Peer server
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

// Setting up the view engine
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Routing
app.get("/", (req, res) => {
  var roomId = uuidv4();
  res.redirect(`/${roomId}`);
});

app.get("/:id", (req, res) => {
  res.render("Room.ejs", { roomId: req.params.id });
});

// Socket Events ....

io.on("connection", (socket) => {
  // Names of users

  // When joined the room

  socket.on("joined", (Data) => {
    socket.join(Data.RoomId);
    socket.broadcast.to(Data.RoomId).emit("user-connected", Data);

    socket.on("NameSent", (Messages) => {
      socket.join(Data.RoomId);
      io.to(Data.RoomId).emit("NameSent", Messages);
    });
    // When disconnected.....

    socket.on("disconnect", () => {
      socket.broadcast.to(Data.RoomId).emit("user-disconnected", Data);
    });
  });
});

server.listen(3000);
