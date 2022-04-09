<template>
	<div class="chat-box">
		<header>聊天室人数：{{count}}</header>
		<div class="msg-box" ref="msg-box">
			<div v-for="(i,index) in list" :key="index" class="msg" :style="i.username == user.username?'flex-direction:row-reverse':''">
				<div style="font-size: 10px;color:#8a98ad;margin: 0 5px;">{{i.username}}</br><span style="line-height: 30px;">{{i.time}}</span></div>
				<div class="user-head">
					<el-avatar shape="square" :size="35" :src="i.userAvater"></el-avatar>
				</div>
				<div class="user-msg">
					<span :style="i.username == user.username?' float: right;':''" :class="i.username == user.username?'right':'left'">{{i.content}}</span>
				</div>
			</div>
		</div>
		<div class="input-box">
			<input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
			<div class="btn" :class="{['btn-active']:contentText}" @click="sendText()">发送</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				ws: null,
				count: 0,
				user: JSON.parse(sessionStorage.user) ,
				list: [], //聊天记录的数组
				contentText: "" //input输入的值
			};
		},
		created() {

		},
		mounted() {
			this.initWebSocket()
		},
		destroyed() {
			this.$store.commit('deleteRoomwx')
			this.ws.close()
			console.log('销毁')
		},
		methods: {
			//滚动条到底部
			scrollBottm() {
				let el = this.$refs["msg-box"];
				if (el) {
					el.scrollTop = el.scrollHeight;
				}
			},
			//发送聊天信息
			sendText() {
				let _this = this;
				let datenow = new Date();
				let hours = datenow.getHours();
				let minutes = datenow.getMinutes();
				_this.$refs["sendMsg"].focus();
				if (!_this.contentText) {
					return;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				let params = {
					username: _this.user.username,
					msg: _this.contentText,
					time: hours + ":" + minutes,
					userAvater: this.user.avatar
				};
				console.log(JSON.stringify(params))
				_this.ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
				_this.contentText = "";
				setTimeout(() => {
					_this.scrollBottm();
				}, 0);
			},
			//进入页面创建websocket连接
			initWebSocket() {
				let _this = this;
				//判断页面有没有存在websocket连接
				console.log(this.$store.state.hasRoomws)
				if (!this.$store.state.hasRoomws) {
					this.$store.commit('createRoomws')
					_this.ws = new WebSocket("wss://chat.nuotasuo.com:3001");
					console.log(_this.ws)
					_this.ws.onopen = function(e) {
						console.log("服务器连接成功");
					};
					_this.ws.onclose = function(e) {
						console.log("服务器连接关闭");
					};
					_this.ws.onerror = function() {
						console.log("服务器连接出错");
					};
					_this.ws.onmessage = function(e) {
						//接收服务器返回的数据
						let resData = JSON.parse(e.data);
						if (resData.funName == "userCount") {
							_this.count = resData.users;
							if(_this.list.length < 20){
								_this.list = resData.chat;
							}
							setTimeout(() => {
								_this.scrollBottm();
							})
							// console.log(resData.chat);
						} else {
							_this.list = [
								..._this.list,
								{
									username: resData.username,
									content: resData.msg,
									time: resData.time,
									userAvater: resData.userAvater
								}
							];
							setTimeout(() => {
								_this.scrollBottm();
							})
						}
					};
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;

		::-webkit-scrollbar {
			width: 0 !important;
		}

		::-webkit-scrollbar {
			width: 0 !important;
			height: 0;
		}
	}

	.chat-box {
		background: #fafafa;
		position: absolute;
		width: 50%;
		height: 78%;
		max-width: 1000px;
		max-height: 800px;
		min-width: 500px;
		min-height: 400px;
		left: 50%;
		transform: translateX(-50%);

		header {
			position: absolute;
			width: 100%;
			height: 3rem;
			background: #409eff;
			max-width: 1000px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			color: white;
			font-size: 1rem;
		}

		.msg-box {
			position: absolute;
			height: calc(100% - 6.5rem);
			width: 100%;
			margin-top: 3rem;
			overflow-y: scroll;

			.msg {
				width: 95%;
				min-height: 2.5rem;
				margin: 1rem 0.5rem;
				position: relative;
				display: flex;
				justify-content: flex-start !important;

				.user-head {
					min-width: 2.5rem;
					width: 20%;
					width: 2.5rem;
					height: 2.5rem;
					display: flex;
					justify-content: center;
					align-items: center;
					// position: absolute;
				}

				.user-msg {
					width: 80%;
					// position: absolute;
					word-break: break-all;
					position: relative;
					z-index: 5;

					span {
						display: inline-block;
						padding: 0.5rem 0.7rem;
						border-radius: 0.5rem;
						margin: 0 10px;
						margin-top: 0.2rem;
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
			}
		}

		.input-box {
			padding: 0 0.5rem;
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 3.5rem;
			background: #fafafa;
			box-shadow: 0 0 5px #ccc;
			display: flex;
			justify-content: space-between;
			align-items: center;

			input {
				height: 2.3rem;
				display: inline-block;
				width: 100%;
				padding: 0.5rem;
				border: none;
				border-radius: 0.2rem;
				font-size: 0.88rem;
			}

			.btn {
				height: 2.3rem;
				min-width: 4rem;
				background: #e0e0e0;
				padding: 0.5rem;
				font-size: 0.88rem;
				color: white;
				text-align: center;
				border-radius: 0.2rem;
				margin-left: 0.5rem;
				transition: 0.5s;
			}

			.btn-active {
				background: #409eff;
			}
		}
	}
</style>
