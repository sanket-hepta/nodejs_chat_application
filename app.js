const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require('./config/dbConfig');

const messageModel = require("./models/messagesModel");

const fs = require("fs");

dotenv.config();

//load the http module and create the server using express module reference.
const http = require("http");
const httpServer = http.Server(app);
//Create the reference of socket io and pass the reference of http usinf IIFE style.
const io = require("socket.io")(httpServer);

app.get("/", (request, response) => {
    response.sendFile(__dirname+'//index.html');
});

//------------------------------Database Connection------------------------
dbConnection.dbConnect();

//Connect to socket.io
io.on('connection', function(socket){

    // Create function to send status
    sendStatus = (s) => {
        socket.emit('status', s);
    }

    // Get chats from mongo collection
    messageModel.find().then((result) => {
        socket.emit('output', result);
    });

    // Handle input events
    socket.on('input', (data) => {
        let name = data.name;
        let message = data.message;

        // Check for name and message
        if(name == '' || message == ''){
            // Send error status
            sendStatus('Please enter a name and message');
        } else {
            let chatMessage = new messageModel({name: data.name, message: data.message});
            chatMessage.save().then(() => {
                io.emit('output', [data]);

                // Send status object
                sendStatus({
                    message: 'Message sent',
                    clear: true
                });
            });
        }
    });

    // Save data in json
    socket.on('download', function(data){
        //Save the chat data in joson file and download the data
        messageModel.find().then((result) => {
            fs.writeFileSync("chatLog.json",JSON.stringify(result));

            socket.emit('dowanloadFile', result);
        });
    });
});

//Run the application using http reference.
httpServer.listen(process.env.PORT, () => {
    console.log(`Backend Server is running on ${process.env.PORT}`);
});