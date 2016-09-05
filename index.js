/*                          Index.js
This file contains the scripts for handlind server side functionality. It integrates the
express.js web developement framework and the MongoDB database with the server.

It contains the functions to handle saving chat messages, usernames and timestamps to the database,
and sending them to a new user, and adding and removing users as they connect and disconnect from
the server.
*/

//add all required modules (express, http, socket.io, mondoDB)
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require ('mongoose');
var userNames = [];

//add support for handling static files
app.use(express.static(__dirname));
mongoose.Promise = global.Promise;

//connect to mongoDB
mongoose.connect('mongodb://localhost/chat', function(err){
  if (err){
    console.log(err);
  } else {
    console.log('Connected to mongoDB');
  }
});

//create a mongoDB schema
var chatSchema = mongoose.Schema({
  user: String,
  messageData: String,
  created: {type: Date, default: Date.now}
});

//constructor for the schema
var Chat = mongoose.model('Message', chatSchema);

//deliver the HTML file to the client side
app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

io.on('connection', function(socket){
  //on establishing a connection, send the chats stored in DB to the user
  var query1= Chat.find({});
  //sort the last 50 messages by time created
  query1.sort('-created').limit(50).exec(function(err, docs){
    if(err) throw err;
    console.log('Sending old messages');
    socket.emit('load old messages', docs);
  });

  //when a new user joins, check if the username is unique and not NULL,and broadcast username to all
  socket.on('new user', function(data,callback){
    if (userNames.indexOf(data) != -1 || data == ''){
      callback(false);
    } else{
      callback(true);
      socket.username = data;
      var sockId = socket.id;
      userNames.push(socket.username);
      io.to(sockId).emit('all usernames',userNames);
      io.emit('username', socket.username);
    }
  });

  //on getting a new message, save the message and broadcasr to all
  socket.on('chat message', function(msg){
    var newMsg = new Chat({messageData: msg, user: socket.username});
    newMsg.save(function(err){
      if(err) throw err;
      io.emit('send message', {messageData: msg, user: socket.username});
  });
});

  //when a user disconnects, remove name from array, and broadcast to everyone that user left
  socket.on('disconnect', function(data){
    if (!socket.username)
      return;
    userNames.splice(userNames.indexOf(socket.username),1);
    io.emit('user disconnect',socket.username);
  });

});

//listen for any connection requests on port 3000
http.listen(3000, function(){
  console.log('Chat Room listening on port 3000');
});
