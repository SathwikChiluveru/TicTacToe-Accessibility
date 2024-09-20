const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const { createServer } = require("http");
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
connectDB();
app.use(cors());


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000"
    }
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
