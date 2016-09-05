function checkAlpha(){
  var $userN = $('#Username');
  var userNLast = $userN.val().slice(-1);
  var alphaN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890";
  var pos = alphaN.indexOf(userNLast);
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
var $usernameError = $('#UsernameError');
var d = new Date();
var dd = d.getDate();
var mm = d.getMonth() + 1;

$('#form1').submit(function(e){
  e.preventDefault();
  socket.emit('new user', $userName.val(),function(data){
    if(data){
      $('#loginPage').hide();
      $('#chatPage').show();
    } else{
      $usernameError.html('This username already taken');
      setTimeout(function(){
        $('#UsernameError').html('');
      },1000);
    }
  });
  $userName.val('');
})
$('#form2').submit(function(e){
  e.preventDefault();
  socket.emit('chat message', $('#m').val());
  $('#m').val(''); //clear message box
  return false;
});

socket.on('all usernames', function(msg){
  for (var i=0; i<msg.length - 1; i++){
    $('#messages').append('<span id = "joinName">' + msg[i] + ' joined</span>' );
  }
});
socket.on('username', function(msg){
  $('#messages').append('<span id = "joinName">' + msg + ' has joined</span>' );
});
socket.on('user disconnect',function(msg){
  $('#messages').append('<span id = "leftName">' + msg + ' has left</span>' );
});
socket.on('load old messages', function(docs){
  for (var i = docs.length - 1; i >= 0; i--){
    var currDate = docs[i].created;
    var onlyDate = currDate.slice(0,10);
    var onlyTime = currDate.slice(11,16);
    $('#messages').append('<span id = "NameTime"><span id = "username"><b>' + docs[i].user + '</b></span> <span id = "timestamp">' + onlyDate + '      ' + onlyTime + '</span></span><span id = "textm">' + docs[i].data1 + "</span>" );
  }
});
socket.on('send message', function(msg){
  var dd1 = new Date();
  var n = dd1.toISOString();
  var nonlyDate = n.slice(0,10);
  var nonlyTime = n.slice(11,16);
  $('#messages').append('<span id = "NameTime1"><span id = "username1"><b>' + msg.user + '</b></span> <span id = "timestamp1">' + nonlyDate + '      ' + nonlyTime + '</span></span><span id = "textm1">' + msg.data1 + "</span>" );
});
