# Chat_Room
Chat_Room for FSE Rampup Assignment

Key requirements and features (Client Side):
Multiple users can post and view chat messages in real time (With userID and Timestamp)
User can choose a unique name (Alphanumeric, max 14 characters)
User can enter the chat room with the unique name (Other users are notified)
Leave the chat room (Other users are notified)

Client Side: HTML, CSS, Javascript, socket.IO

Key requirements and features (Server Side):
A database to store all chat messages with timestamp and userID
Displays the last 50 saved messages when a new user logs in.
Receive message from a user and broadcasts it to everyone in real time
Authenticate unique names and add them when a user joins and notify everyone
Delete names when users leave and notify everyone

Server Side: Node.js, express, socket.IO

Database: MongoDB
