import express from "express";
import ServerlessHttp from "serverless-http";
import mongoose from "mongoose";
import env from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./src/routes/user.js"
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";

env.config();

const uri = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose.connect(uri, () => console.log("API Connected to MongoDB"));
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});


const app = express();
const PORT = 3004;
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.json());
app.use(cors());




let connectedUsers = {};
const io = new Server(process.env.PORT || server)

io.on("connection", (socket)=>{  
 

console.log("Connected & Socket Id is" , socket.id);
  // Assign the first user as mentor
  if (Object.keys(connectedUsers).length === 0) {
    connectedUsers[socket.id] = true;
    socket.emit("mentor", { isMentor: true });
    console.log("is mentor");
  } else {
    connectedUsers[socket.id] = false;
    socket.emit("mentor", { isMentor: false });
    console.log("is student");
  }
  //Emit the number of connected users
  io.emit("usersConnected", { usersConnected: Object.keys(connectedUsers).length 
  });

  socket.on('new-operatios', (code) => {
    io.emit('new-remote-operatios', code);
  });

  socket.on("disconnect", () => {
    delete connectedUsers[socket.id];
    io.emit("usersConnected", { usersConnected: Object.keys(connectedUsers).length });
  });
})

app.use("/user",userRouter);
server.listen(process.env.PORT || PORT, () => {
  console.log(`API Server Started at http://localhost:${PORT}/`);
});