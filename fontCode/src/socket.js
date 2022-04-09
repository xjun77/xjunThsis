import { io } from "socket.io-client";

const URL = "https://chat.nuotasuo.com:3000";
// const URL = 'https://xjun'
const socket = io(URL, { autoConnect: false });
const user = window.sessionStorage.user;
if (user) {
  let userjson = JSON.parse(user);
  console.log(userjson);
  let sessionID = userjson.sessionID;
  let username = userjson.username;
  let img = userjson.avatar;
  socket.auth = { sessionID, username, img };
  socket.userID = sessionID;
  socket.connect();
  console.log(socket);
}

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
