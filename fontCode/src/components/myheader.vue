<template>
	<div class="header">
		<div class="cotain">
			<div class="nameOfBlog" @click="$emit('toHome')">
				<p class="line"></p>
				<p>NuotaSuo</p>
				<p class="line"></p>
			</div>
			<div class="nav">
				<ul class="tabs">
					<li class="tab" v-for="tab in tabs" @click="selectTab(tab)">
						<i :class="tab.icon"></i>
						{{tab.name}}
					</li>
				</ul>
				<el-dropdown placement="bottom">
					<el-avatar :size="50" :src="user.avatar" :fit="fit" class="avatar"> user </el-avatar>
					<el-dropdown-menu slot="dropdown">
						<div class="username">{{user.username}}</div>
						<el-dropdown-item icon="el-icon-user" @click.native="$emit('toPersonal')">个人中心</el-dropdown-item>
						<el-dropdown-item icon="el-icon-plus" @click.native="$emit('toAddArticle')">写文章</el-dropdown-item>
						<el-dropdown-item icon="el-icon-chat-dot-round" @click.native="$emit('tochat')">消息</el-dropdown-item>
						<el-dropdown-item icon="el-icon-close" @click.native="loginOut()">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'myheader',
		data() {
			return {
				user: JSON.parse(sessionStorage.user) ,
				tabs: [{
						name: '首页',
						path: '/article?Page=1',
						icon: 'el-icon-s-home'
					},
					{
						name: '聊天室',
						path: '/chatromm',
						icon: 'el-icon-s-platform'
					},
					// {
					// 	name: '分类',
					// 	path: '/typeof',
					// 	icon: 'el-icon-s-fold'
					// },
					// {
					// 	name: '归档',
					// 	path: '/getsum',
					// 	icon: 'el-icon-s-claim'
					// },
					{
						name: '搜索',
						path: '/search',
						icon: 'el-icon-s-opportunity'
					}
				],
				fit: 'cover'
			}
		},
		inject: ['reload'],
		methods: {
			loginOut() {
				//该组件点击需要在后面添加 .native
				this.$store.commit('deleteRoomwx')
				this.$socket.disconnect()
				sessionStorage.clear();
				this.$router.push('/login')
			},
			selectTab(tab) {
				this.$router.push(tab.path)
				this.reload()
			}
		}
	}
</script>

<style scoped="scoped">
	.header {
		background-color: #E9EEF3;
	}

	.cotain {
		max-width: 1000px;
		min-width: 700px;
		height: 90px;
		margin: 0 auto;
		background-color: #E9EEF3;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.nameOfBlog {
		font-size: 20px;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 80px;
		width: 140px;
		/* background-color: #E9EEF3; */
		cursor: pointer;
		padding: 20px 0;
		box-sizing: border-box;
		animation: logo-name 1s;
	}

	.nav {
		height: 80px;
		width: 400px;
		/* background-color: greenyellow; */
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.avatar {
		cursor: pointer;
	}

	.username {
		cursor: default;
		margin: 5px 0;
		text-align: center;
		color: #66B1FF;
	}

	p {
		margin: 0;
	}

	.tabs {
		padding: 0;
	}

	.tab {
		/* width:50px ;
    height: 30px;
    line-height: 30px; */
		font-weight: 600;
		font-size: 15px;
		padding: 5px 10px;
		border-radius: 5px;
		display: inline-block;
		color: #262A30;
		/* background-color: white; */
		margin: auto 5px;
		transition: all .5s;
	}

	.tab:hover {
		cursor: pointer;
		color: white;
		background-color: #262A30;
	}

	.line {
		width: 70px;
		height: 2px;
		background-color: black;
		transition: width .3s;
		animation: logo-line 1s;
	}

	.nameOfBlog:hover .line {
		width: 0px;
	}

	@keyframes logo-name {
		from {
			margin-left: -60px;
			opacity: 0
		}

		to {
			margin-left: 0px;
			opacity: 1
		}
	}

	@keyframes logo-line {
		from {
			width: 0px;
		}

		to {
			width: 70px;
		}
	}
</style>
