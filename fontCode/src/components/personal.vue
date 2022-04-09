<template>
	<el-container class="container">
		<el-aside class="aside">
			<el-menu default-active="1" class="el-menu-vertical" @select="selectIndex">
				<el-menu-item index="1">
					<i class="el-icon-user-solid"></i>
					<span slot="title">个人资料</span>
				</el-menu-item>
				<el-menu-item index="2">
					<i class="el-icon-menu"></i>
					<span slot="title">资讯管理</span>
				</el-menu-item>
				<el-menu-item index="3">
					<i class="el-icon-s-tools"></i>
					<span slot="title">修改密码</span>
				</el-menu-item>
			</el-menu>
		</el-aside>
		<el-main class="elmain">
			<div v-show="indexItem == 1">
				<el-form ref="FormRef1" :model="loginForm" label-width="0" class="form_login">
					<el-form-item>
						<span>邮箱：</span>
						<el-input v-model="loginForm.email" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item>
						<span>手机号：</span>
						<el-input v-model="loginForm.phone" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item>
						<span>个性签名:</span>
						<el-input v-model="loginForm.slog" placeholder="编辑个性签名" prefix-icon="el-icon-edit-outline"></el-input>
					</el-form-item>
					<el-form-item>
						<span>头像:</span>
						<el-upload action="http://upload-z2.qiniup.com" :before-upload='beforeUploadFM' :on-success='upScuccessFM' ref="uploadFM"
						 :multiple='false' :show-file-list='false' :data="uploadDataFM" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG">
							<img v-if="loginForm.avatar" :src="loginForm.avatar" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item class="btn">
						<el-button type="primary" @click="submit0" plain>提交</el-button>
					</el-form-item>

				</el-form>
			</div>
			<div v-show="indexItem == 2">
				<span>资讯列表</span>
				<div style="margin: 5px;font-size: 15px;">共<span style="margin: 0 2px;">{{counts}}</span>篇</div>
				<el-card class="art-card" v-for="(art,index) in arts">
					<div slot="header" class="clearfix">
						<span>标题： {{art.title}}</span>
						<el-button style="float: right; padding: 3px 0;color: red;" type="text" @click="todelete(index,art.ID)">删除</el-button>
						<el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="text" @click="toupdate(art.ID)">编辑</el-button>
					</div>
					<span>{{art.createTIME}}</span>
					<span style="float: right;">
						<el-tag style="margin: 0 8px;" v-for="tag in art.tag">{{tag}}</el-tag>
					</span>
				</el-card>
			</div>
			<div v-show="indexItem == 3">
				<el-form ref="FormRef2" :model="loginForm1" label-width="0" class="form_login">
					<el-form-item>
						<span>原密码：</span>
						<el-input type="password" v-model="loginForm1.password" placeholder="请输入原密码" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item>
						<span>修改密码：</span>
						<el-input type="password" v-model="loginForm1.password" placeholder="请输入密码" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item prop="personal">
						<span>确定密码:</span>
						<el-input type="password" v-model="loginForm1.regpassword" placeholder="请确定密码" prefix-icon="el-icon-edit-outline"></el-input>
					</el-form-item>
					<el-form-item class="btn">
						<el-button type="primary" @click="submit1" plain>提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	const STATICDOMAIN = 'http://nuotasuo.com/' // 图片服务器的域名，展示时使用
	export default {
		data() {
			return {
				user: JSON.parse(sessionStorage.user),
				indexItem: 1,
				uploadDataFM: {},
				counts: 0,
				arts: [],
				loginForm: {},
				loginForm1: {
					password:'',
					regpassword:''
				}
			}
		},
		methods: {
			todelete(index,aid){
				this.$confirm("确定要删除吗？", "提示", {
						type: "warning"
					})
					.then(() => {
						this.$http.post('/article/delart',{ID:aid}).then(res =>{
							// this.$message.success("删除成功");
							if(res.status == 200){
								this.arts.splice(index, 1);
								this.counts = this.counts - 1;
							}
						})
					})
					.catch(() => {});
				
			},
			toupdate(aid){
				this.$router.push({
					path: 'updateArt',
					query: {
						id: aid
					}
				})
			},
			beforeUploadFM(file) {
				// const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
				let isPhoto = false
				console.log(file.type)
				if (file.type === 'image/jpeg') {
					isPhoto = true
				} else if (file.type === 'image/png') {
					isPhoto = true
				}
				if (!isPhoto) {
					this.$message.error('只能是 JPG 、PNG格式!');
					return
				}

				this.fullscreenLoading = true
				const suffix = file.name.split('.')
				const ext = suffix.splice(suffix.length - 1, 1)[0]
				return this.$http.get('/article/upload').then(res => {
					// console.log(res.data)
					this.uploadDataFM = {
						key: `image/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
						token: res.data
					}
				})
			},
			upScuccessFM(response, file, fileList) {
				this.fullscreenLoading = false
				let url = STATICDOMAIN + response.key;
				this.loginForm.avatar = url;
				// console.log(url)
				// if (url != null && url.length > 0){
				// 	this.fengmianUrl = url
				// 	this.fengmianSrcList = [url]
				// }
			},
			submit0() {
				console.log(1)
				let that = this
				this.$http.post('/user/detail', {
					username: that.user.username,
					email: that.loginForm.email,
					phone: that.loginForm.phone,
					slog: that.loginForm.slog,
					sex: that.loginForm.sex,
					avatar: that.loginForm.avatar
				})
			},
			submit1() {
				let that = this
				if(this.loginForm1.password == '' || this.loginForm1.regpassword == ''){
					this.$message.error('不能为空')
					return
				}
				if(this.loginForm1.password.length<6 || this.loginForm1.regpassword.length<6){
					this.$message.error('密码应大于6位')
					return
				}
				if(this.loginForm1.password != this.loginForm1.regpassword){
					this.$message.error('两次输入不一致')
					return
				}
				this.$http.post('/user/password', {
					username: that.user.username,
					password: that.loginForm1.password
				})
			},
			selectIndex(index) {
				this.indexItem = index
			},
		},
		created() {
			let that = this
			this.$http.get('/user/getdetail?username=' + that.user.username).then(res => {
				that.loginForm = res.data
			}).catch(error => {
				console.log(error)
			})
			this.$http.get('/article/current', {
					params: {
						username: that.user.username
					}
				})
				.then(res => {
					console.log(res)
					that.arts = res.data.list;
					that.counts = res.data.list.length;
				}).catch(error => {
					console.log(error)
				})
		}
	}
</script>

<style scoped="scoped">
	.container {
		max-width: 1300px;
		min-width: 1000px;
		width: 70%;
		margin: 20px auto;
		/* background-color: #55AA7F; */
		border: 2px solid #7d7d7d;
		border-radius: 10px;
	}

	.aside {
		/* background-color: #c57274; */
		border-radius: 10px;
	}

	.elmain {
		height: 800px;
		background-color: #eceaff;
	}

	.el-menu-vertical .el-menu-item {
		margin-bottom: 5px;
		border-bottom: 1px solid saddlebrown;
	}

	.btn {
		margin: 30px auto;
	}

	.art-card {
		margin: 15px auto;
		margin-bottom: 30px;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 128px;
		height: 128px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 128px;
		height: 128px;
		display: block;
	}
</style>
