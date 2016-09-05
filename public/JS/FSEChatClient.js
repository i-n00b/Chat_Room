/*                           FSEChatClient.js
This file is simply an external javascript file for handling all Javascript functionality
on the Client Side. Its contains the functions to manage the client side features such as
loading old messages stored in the database, displaying chat messages received from server,
and notifying if any user joins or disconnects from the chat

It also contains the functions to send chat messages and the username of  a new user to
the server.

Along with this it has helping functions for the bove features.
*/

//Function to check if the Username is Alphanumeric
function checkAlpha(){
  var $userN = $('#Username');
  var userNLast = $userN.val().slice(-1);
  var alphaN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890";
  var pos = alphaN.indexOf(userNLast);
  //If name is not alphanumeric, display an error message
  if (pos == -1){
    $('#UsernameError').html('Please enter a username with only alphanumeric values and spaces');
    setTimeout(function(){
      $('#Username').val('');
      $('#UsernameError').html('');
    },1000);
  }
}


var socket = io();
var $userName = $('#Username');

//function to login a new user
$('#form1').submit(function(e){
  e.preventDefault();
  //if the callback function authenticates username, hide the login element and display chat element
  socket.emit('new user', $userName.val(),function(data){
    if(data){
      $('#loginPage').hide();
      $('#chatPage').show();
    }
    //else display error message
    else{
      $('#UsernameError').html('This username already taken');
      setTimeout(function(){
        $('#UsernameError').html(''); //clear error display after waiting a second
      },1000);
    }
  });
  $userName.val(''); //clear username box
});

//function to send a chat message to the server
$('#form2').submit(function(e){
  e.preventDefault();
  socket.emit('chat message', $('#m').val());
  $('#m').val(''); //clear message box
  return false;
});

//display all current online users in the chat to a new user
socket.on('all usernames', function(msg){
  for (var i=0; i<msg.length - 1; i++){
    $('#messages').append('<span id = "joinName">' + msg[i] + ' joined</span>' );
  }
});

//display message to everyone that a user has joined
socket.on('username', function(msg){
  $('#messages').append('<span id = "joinName">' + msg + ' has joined</span>' );
});

//display message to everyone that a user left
socket.on('user disconnect',function(msg){
  $('#messages').append('<span id = "leftName">' + msg + ' has left</span>' );
});

//load the messasges on the database with timestamps and userIDs for a new user
socket.on('load old messages', function(docs){
  for (var i = docs.length - 1; i >= 0; i--){
    var currDate = docs[i].created;
    var onlyDate = currDate.slice(0,10);
    var onlyTime = currDate.slice(11,16);
    $('#messages').append('<span id = "NameTime"><span id = "username"><b>' +
    docs[i].user + '</b></span> <span id = "timestamp">' + onlyDate + '      ' +
    onlyTime + '</span></span><span id = "textm">' + docs[i].messageData + "</span>" );
  }
});

//display a real time message with userID and timestamp to all users
socket.on('send message', function(msg){
  var dd1 = new Date();
  var n = dd1.toISOString();
  var nonlyDate = n.slice(0,10);
  var nonlyTime = n.slice(11,16);
  $('#messages').append('<span id = "NameTime1"><span id = "username1"><b>' +
  msg.user + '</b></span> <span id = "timestamp1">' + nonlyDate + '      ' +
  nonlyTime + '</span></span><span id = "textm1">' + msg.messageData + "</span>" );
});
