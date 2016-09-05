var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require ('mongoose');
var userNames = [];

app.use(express.static(__dirname));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/chat', function(err){
  if (err){
    console.log(err);
  } else {
    console.log('Connected to mongoDB');
  }
});

var chatSchema = mongoose.Schema({
  user: String,
  data1: String,
  created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});

io.on('connection', function(socket){
  var query1= Chat.find({});
  query1.sort('-created').limit(50).exec(function(err, docs){
    if(err) throw err;
    console.log('Sending old messages');
    socket.emit('load old messages', docs);
  });
  socket.on('new user', function(data,callback){
    if (userNames.indexOf(data) != -1 || data == ''){
      callback(false);
    } else{
      callback(true);
      socket.username = data;
      var sockID = socket.id;
      userNames.push(socket.username);
      io.to(sockID).emit('all usernames',userNames);
      io.emit('username', socket.username);
    }
  });
  socket.on('chat message', function(msg){
    var newMsg = new Chat({data1: msg, user: socket.username});
    newMsg.save(function(err){
      if(err) throw err;
      io.emit('send message', {data1: msg, user: socket.username});
  });
});

  socket.on('disconnect', function(data){
    if (!socket.username)
      return;
    userNames.splice(userNames.indexOf(socket.username),1);
    io.emit('user disconnect',socket.username);
  });

});

http.listen(3000, function(){
  console.log('Chat Room listening on port 3000');
});
