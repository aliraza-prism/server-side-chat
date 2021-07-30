const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
//! Specify Port Number
const port = process.env.PORT || 4000;

// Array of Objects
const users = [{}];

//! Pass cors
app.use(cors());

//! First Route
app.get("/", (req, res) => {
  res.send("Backend side working");
});

//! Setup Socket.io with Server
const io = socketIO(server);

//! Socket.io Connection (io 1 pura circut he || or socket aleg aleg users hein) || (emit ka matlab data send krna aur on ka mtlb data reveive krna)
io.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {user:"Admin", message:`${users[socket.id]} has joined`});
    socket.emit("welcome", {user:"Admin", message:`Welcome to the chat ${users[socket.id]}`});
    console.log("User From Chat Res", user);
  });
  // For messaging
  socket.on("message", ({message,id})=>{
    //sender aur receiver dono ko message show is lye ham, io(complete circut) ka use krain gy insted of socket
    io.emit('sendMessage',{user: users[id], message, id})
  })

  socket.on('disconnect',()=>{
    socket.broadcast.emit('leave', {user:'Admin', message:`${users[socket.id]} has left`});
    console.log("User left");
  })
});

//! Server Connection
server.listen(port, () => {
  console.log(`Server Working on Port ${port}`);
});
