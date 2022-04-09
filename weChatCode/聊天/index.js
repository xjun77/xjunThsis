const fs = require("fs");
const httpServer = require("https").createServer({
	key : fs.readFileSync("./2_chat.nuotasuo.com.key"),
	cert: fs.readFileSync("./1_chat.nuotasuo.com_bundle.crt")
});
const io = require("socket.io")(httpServer, {
	cors: true
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
	
  const sessionID = socket.handshake.auth.sessionID;
  console.log(sessionID)
	if (sessionID) {
		const session = sessionStore.findSession(sessionID);
		if (session) {

			console.log(1)
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			socket.img = session.img;
			return next();
		} else {
			//第一次登录
			console.log(2)
			const username = socket.handshake.auth.username;
			const img = socket.handshake.auth.img;
			const userID = sessionID //先这样
			socket.sessionID = sessionID;
			socket.userID = userID;
			socket.username = username;
			socket.img = img;
			next();
		}
	}
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
	img:socket.img,
    connected: true,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
	  img:session.img,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  console.log(users)
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
	img: socket.img,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to,time,day }) => {
    const message = {
      content,
	  time,
	  day,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
	  console.log('disconnect')
	  console.log(users)
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
		img: socket.img,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(3000, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
