<template>
  <div>
    <el-container class="container">
      <el-aside width="200px" class="userAside">
        <user
          v-for="user in users"
          :key="user.userID"
          :user="user"
          :selected="selectedUser === user"
          @select="onSelectUser(user)"
        />
        <div>{{input}}</div>
      </el-aside>
      <el-container
        style="border: 1px solid rgb(79, 87, 100);border-radius: 5px;"
        v-if="selectedUser"
      >
        <el-header height="60px" class="chatheader">
          <status-icon :connected="selectedUser.connected" />
          {{selectedUser.username}}
        </el-header>
        <div class="elmainDiv" ref="msg-box">
          <el-main class="chatMain">
            <div v-for="(message, index) in selectedUser.messages" :key="index" class="msgdiv">
              <div
                style="display: flex;justify-content: center;margin-bottom: 10px;"
                v-if="displaySender(message, index)"
              >
                <el-tag type="info" size="small" effect="plain">{{ message.day }}</el-tag>
              </div>
              <div :class="message.fromSelf?'msg-reflex':'msg'">
                <div>
                  <el-avatar
                    shape="square"
                    size="medium"
                    :src="message.fromSelf?currentUser.avatar:selectedUser.img"
                  ></el-avatar>
                  <div class="time">{{message.time}}</div>
                </div>
                <div class="user-msg">
                  <span :class="message.fromSelf?'right':'left'" v-html="message.content"></span>
                </div>
              </div>
            </div>
          </el-main>
        </div>
        <el-footer height="100px" class="chatfooter">
          <textarea
            v-model.trim="input"
            placeholder="输入消息..."
            class="input"
            ref="sendMsg"
            @keyup="handleKeyCode($event)"
          />
          <el-tooltip effect="dark" content="Crtl+Enter 发送" placement="bottom-start">
            <button :disabled="!isValid" @click="tosend()" class="send-button">发送</button>
          </el-tooltip>
        </el-footer>
      </el-container>
      <el-image v-else class="chatdefault" :src="require('../../public/image/chatbacket.jpg')"></el-image>
    </el-container>
    <!-- <div class="left-panel">
			<user v-for="user in users" :key="user.userID" :user="user" :selected="selectedUser === user" @select="onSelectUser(user)" />
		</div>
		<message-panel v-if="selectedUser" :user="selectedUser" @input="onMessage" class="right-panel" />
    -->
  </div>
</template>

<script>
import User from "./User";
import MessagePanel from "./MessagePanel";
import StatusIcon from "./StatusIcon";
export default {
  name: "Chat",
  components: {
    User,
    MessagePanel,
    StatusIcon
  },
  data() {
    return {
      currentUser: JSON.parse(sessionStorage.user),
      selectedUser: null,
      users: [],
      input: ""
    };
  },
  methods: {
    sortUser() {
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.connected > b.connected) return -1;
        if (a.connected < b.connected) return 1;
        if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
        return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : 0;
      });
    },
    //回车与ctrl回车监听
    handleKeyCode(event) {
      if (event.keyCode == 13) {
        if (event.ctrlKey) {
          event.preventDefault();
          if (this.isValid) {
            this.tosend();
          }
        }
      }
    },
    displaySender(message, index) {
      return (
        index === 0 ||
        this.selectedUser.messages[index - 1].day !==
          this.selectedUser.messages[index].day
      );
    },
    //格式化时间
    dateStrTime(date) {
      var date = new Date(parseInt(date));
      let hours = date.getHours(),
        mins = date.getMinutes();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (mins < 10) {
        mins = "0" + mins;
      }
      return hours + ":" + mins;
    },
    dateStrDay(date) {
      var date = new Date(parseInt(date));
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日 "
      );
    },
    //滚动条到底部
    scrollBottm() {
      let el = this.$refs["msg-box"];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },
    tosend() {
      //回车显示
      let content = this.input.replace(/\n/g, "<br/>");
      //空格显示
      content = content.replace(/ /g, " &nbsp");
      console.log(content);
      let timeNow = new Date().getTime();
      let time = this.dateStrTime(timeNow);
      let day = this.dateStrDay(timeNow);
      console.log(time);
      this.$socket.emit("private message", {
        content,
        day,
        time,
        to: this.selectedUser.userID
      });
      this.selectedUser.messages.push({
        time,
        day,
        content,
        fromSelf: true
      });
      this.input = "";
      this.$refs["sendMsg"].focus();
      let that = this;
      this.$nextTick(function() {
        that.$refs["msg-box"].scrollTop = 50000;
      });
    },
    // onMessage(content) {
    // 	if (this.selectedUser) {
    // 		this.$socket.emit("private message", {
    // 			content,
    // 			to: this.selectedUser.userID,
    // 		});
    // 		this.selectedUser.messages.push({
    // 			content,
    // 			fromSelf: true,
    // 		});
    // 	}
    // },
    onSelectUser(user) {
      console.log("1111");
      console.log(user);
      console.log("1111");
      this.selectedUser = user;
      user.hasNewMessages = false;
      let that = this;
      this.$nextTick(function() {
        that.$refs["msg-box"].scrollTop = 50000;
      });
    }
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    }
  },
  created() {
    this.$socket.disconnect();
    this.$socket.connect();
    // this.$socket.on("connect", () => {
    // 	this.users.forEach((user) => {
    // 		if (user.self) {
    // 			user.connected = true;
    // 		}
    // 	});
    // });

    // this.$socket.on("disconnect", () => {
    // 	this.users.forEach((user) => {
    // 		if (user.self) {
    // 			user.connected = false;
    // 		}
    // 	});
    // });
    console.log(this.$socket);
    const initReactiveProperties = user => {
      user.hasNewMessages = false;
    };

    this.$socket.on("users", users => {
      users.forEach(user => {
        user.messages.forEach(message => {
          message.fromSelf = message.from === this.currentUser.userID;
        });
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === this.currentUser.userID;
        initReactiveProperties(user);
        this.users.push(user);
        console.log("22222");
        console.log(this.users);
        console.log("22222");
      });
      // put the current user first, and sort by username
      // this.users.sort((a, b) => {
      // 	if (a.self) return -1;
      // 	if (b.self) return 1;
      // 	if (a.connected > b.connected) return -1;
      // 	if (a.connected < b.connected) return 1;
      // 	if (a.username < b.username) return -1;
      // 	return a.username > b.username ? 1 : 0;
      // });
      this.sortUser();
    });

    this.$socket.on("user connected", user => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          this.sortUser();
          return;
        }
      }
      //不存在则添加
      initReactiveProperties(user);
      this.users.push(user);
      this.sortUser();
    });

    this.$socket.on("user disconnected", id => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
      this.sortUser();
    });

    this.$socket.on("private message", ({ content, time, day, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = this.currentUser.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            time,
            day,
            fromSelf
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          } else {
            let that = this;
            this.$nextTick(function() {
              that.$refs["msg-box"].scrollTop = 50000;
            });
          }
          break;
        }
      }
    });
  },

  destroyed() {
    this.$socket.off("connect");
    this.$socket.off("disconnect");
    this.$socket.off("users");
    this.$socket.off("user connected");
    this.$socket.off("user disconnected");
    this.$socket.off("private message");
  }
};
</script>

<style lang="scss" scoped>
.box {
  margin: 10px auto;
  width: 80vw;
  height: 60vw;
  min-width: 800px;
  min-height: 600px;
  display: flex;
}

.left-panel {
  /* position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  color: white; */
  background-color: #3f0e40;
}

.right-panel {
}
.container {
  height: 75vh;
  width: 70vw;
  min-height: 600px;
  min-width: 700px;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 10px;
}
.userAside {
  border-radius: 10px;
  background-color: rgb(79, 87, 100);
}
.chatMain {
  background-color: rgb(248, 249, 250);
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: calc(75vh - (162px));
}
.chatheader {
  color: black;
  font-weight: bold;
  background-color: rgb(230, 230, 231);
  line-height: 60px;
  border-bottom: 1px solid rgb(79, 87, 100);
  border-radius: 5px;
}
.chatfooter {
  background-color: rgb(230, 230, 231);
  border-top: 1px solid rgb(79, 87, 100);
  border-radius: 5px;
}
.input {
  width: 83%;
  height: 68px;
  margin-top: 5px;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  font-size: 15px;
  border-radius: 5px;
  border: 1px solid #000;
}
.send-button {
  width: 10%;
  height: 30px;
  margin-top: 65px;
  vertical-align: top;
}

.msg {
  display: flex;
}
.msg-reflex {
  display: flex;
  flex-direction: row-reverse;
}
.msg:first-child {
  margin-top: 0;
}
.elmainDiv {
  overflow-y: scroll;
  // scroll-behavior:smooth;
}
.user-msg {
  width: 65%;
  word-break: break-all;
  position: relative;
  z-index: 5;

  span {
    display: inline-block;
    padding: 0.5rem 0.7rem;
    border-radius: 0.5rem;
    margin: 0 10px;
    font-size: 0.88rem;
  }

  .left {
    background: #4b99e7;
    color: white;
    animation: toLeft 0.5s ease both 1;
  }

  .right {
    color: balck;
    background: #a9f09c;
    float: right;
    animation: toright 0.5s ease both 1;
  }

  @keyframes toLeft {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }

    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }

  @keyframes toright {
    0% {
      opacity: 0;
      transform: translateX(10px);
    }

    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
}
.chatdefault {
  border: 1px solid rgb(79, 87, 100);
  border-radius: 5px;
  min-width: 700px;
  background-color: white;
}
.time {
  font-size: 12px;
  color: #596270;
  text-align: center;
}
.msgdiv {
  margin-bottom: 20px;
}
.msgdiv:last-child {
  margin-bottom: 0px;
}
</style>
