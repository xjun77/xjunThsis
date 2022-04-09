<template>
	<div class="login_container">
		<transition name="slide-fade" mode="out-in">
			<div class="login" v-if="!isReg" v-loading="loading" key="loginIn" element-loading-text="处理中..."
			 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
				<div class="avater">登录</div>
				<el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" label-width="0" class="form_login">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input v-model="loginForm.password" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"></el-input>
					</el-form-item>
					<!-- <el-form-item class="cpitem" prop="captcha" :error="showcapWrong">
						<el-input v-model="loginForm.captcha" @keyup.enter.native="login" placeholder="请输入验证码" prefix-icon="el-icon-key"
						 class="captcha"></el-input>
						<div class="img" @click="changeCap">
							<img :src="imgURL" style="width: 100%;height: 100%;">
						</div>
					</el-form-item> -->
					<el-form-item class="btns">
						<el-button type="primary" @click="login" plain>登录</el-button>
						<el-button @click="resetLogin" plain>重置</el-button>
					</el-form-item>
					<el-link type="primary" class="goReg" @click="gotAnother">没有账号，去注册</el-link>
				</el-form>
			</div>
			<div class="login" v-else v-loading="regloading" key="register" element-loading-text="处理中..."
			 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
				<div class="avater" style="color: #596270;">注册页面</div>
				<el-form ref="regFormRef" :rules="regRules" :model="regForm" label-width="0" class="form_login">
					<el-form-item prop="usernameReg">
						<el-input v-model="regForm.usernameReg" ref="inputRef" placeholder="请输入用户名,长度在3-12个字符" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<el-form-item prop="passwordReg">
						<el-input v-model="regForm.passwordReg" placeholder="请输入密码,6-18个字符" show-password prefix-icon="el-icon-lock"></el-input>
					</el-form-item>
					<el-form-item prop="chkPassword">
						<el-input v-model="regForm.chkPassword" type="password" placeholder="请确认密码" prefix-icon="el-icon-lock"></el-input>
					</el-form-item>
					<el-form-item class="btns">
						<el-button type="primary" @click="regPost" plain>注册</el-button>
						<el-button @click="resetReg" plain>重置</el-button>
					</el-form-item>
					<el-link type="primary" class="goReg" @click="gotAnother">返回登录 →</el-link>
				</el-form>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'login_reg_page',
		data() {
			var validatePass1 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.regForm.chkPassword !== '') {
						this.$refs.regFormRef.validateField('chkPassword');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.regForm.passwordReg) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				isReg: false, //是否是注册页面
				loginForm: {
					username: 'Nuota',
					password: '123123',
					// captcha: ''
				},
				regForm: {
					usernameReg: '',
					passwordReg: '',
					chkPassword: ''
				},
				imgURL: 'http://localhost:80/blog/login/create_captcha.php',
				loginRules: {
					//el-form-item的prop属性里面
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
						}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					// captcha: [{
					// 	required: true,
					// 	message: '请输入验证码',
					// 	trigger: 'blur'
					// }]
				},
				regRules: {
					//el-form-item的prop属性里面
					usernameReg: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 12,
							message: '用户名长度为 3~12 个字符！'
						}
					],
					passwordReg: [{
							validator: validatePass1,
							trigger: 'change'
						},
						{
							min: 6,
							max: 18,
							message: '密码长度为 6~18 个字符！'
						}
					],
					chkPassword: [{
						validator: validatePass2,
						trigger: 'change'
					}]
				},
				showcapWrong: '',
				loading: false,
				regloading: false
			}
		},
		methods: {
			gotAnother() {
				this.isReg = !this.isReg
			},
			resetLogin() {
				// this.$refs.loginFormRef.resetFields();
				for (let key in this.loginForm) {
					this.loginForm[key] = ''
				}
			},
			resetReg() {
				// this.$refs.regFormRef.resetFields();
				for (let key in this.regForm) {
					this.regForm[key] = ''
				}
			},
			login() {
				let that = this;
				this.$refs.loginFormRef.validate(valid => {
					//表单校验，require属性等
					// console.log(valid)
					// const {data:res} = await this.$http.post("http://localhost:80/blog/login/test_cap.php");
					// console.log(res)
					if (!valid) {
						return;
					} else {
						// let postData = JSON.stringify(this.loginForm)
						// that.loading = true;
						
						//重写
						// var params = new URLSearchParams();
						// params.append('username', that.loginForm.username);
						// params.append('password', that.loginForm.password);
						// // params.append('captcha', that.loginForm.captcha);
						// // console.log(postData)
						// //axios调用后台验证  withCredentials携带凭证cookie
						// that.$http({ //'http://localhost:80/blog/login/test_cap.php',params,/*出错：withCredentials=true*/
						// 	method: 'post',
						// 	url: 'http://localhost:80/blog/login/test_cap.php',
						// 	data: params,
						// 	withCredentials: true
						// }).then(res => {
						// 	that.loading = false;
						// 	console.log(res);
						// 	if (res.data == "capWrong") {
						// 		//实现‘验证码错误’的重复提示
						// 		that.showcapWrong = "登录失败，验证码错误"
						// 		that.$nextTick(() => {
						// 			that.showcapWrong = "验证码错误"
						// 		})
						// 	} else {
						// 		if (res.data == 'uncorrect') {
						// 			that.$alert('账号或密码错误', '提示', {
						// 				type: 'warning',
						// 				confirmButtonText: '确定',
						// 				showClose: false
						// 			});
						// 		} else {
						// 			that.$message.success('登录成功');
									
						// 			//先不作验证（无安全策略），之后再改后端返回值和作安全token校验
						// 			window.sessionStorage.setItem('token', 'testToken');
						// 			window.sessionStorage.setItem('username',that.loginForm.username);
									
									
						// 			that.$router.push({
						// 				name: 'home',
						// 				// query: {
						// 				// 	username: ,
						// 				// }
						// 			})
						// 		}
						// 	}
						// }).catch(function(error) {
						// 	console.log(error);
						// })
						that.$http.post('/user/login',{username:that.loginForm.username,password:that.loginForm.password}).then(res=>{
							// that.$message.success(that.loginForm.username+'，登录成功');
							if(res){
								if(res.status == 200){
									// that.$message.success('登录成功');
									sessionStorage.setItem('elementToken','Bearer '+res.data.token)
									sessionStorage.setItem('user',JSON.stringify(res.data.user))
									const sessionID = res.data.user.sessionID
									const username = res.data.user.username
									const img = res.data.user.avatar
									if (sessionID && username) {
									  that.$socket.auth = { sessionID,username,img }
									  that.$socket.connect();
									  console.log(sessionID)
									  console.log(username)
									}
									that.$router.push('/Article?Page='+1)
								}
							}
						})
						
						
					}
				})
			},
			changeCap() {
				const num = Math.ceil(Math.random() * 10) // 生成一个随机数（防止缓存）
				this.imgURL = 'http://localhost:80/blog/login/create_captcha.php?' + num
			},
			regPost() {
				let that = this;
				this.$refs.regFormRef.validate(valid => {
					if (!valid) {
						return;
					} else {
						// this.regloading = true;
						
						// //重写
						// // let postData = JSON.stringify(this.loginForm)
						// var params = new URLSearchParams();
						// params.append('username', that.regForm.usernameReg);
						// params.append('password', that.regForm.passwordReg);
						// // console.log(postData)
						// //axios调用后台验证
						// that.$http.post('http://localhost:80/blog/login/test_reg.php', params).then(res => {
						// 	console.log(res);
						// 	this.regloading = false;
						// 	if (res.data == "username_repeat") {
						// 		that.$alert('用户名已存在，请重新输入', '提示', {
						// 			confirmButtonText: '确定',
						// 			showClose: false,
						// 			type: 'error',
						// 			callback: action => {
						// 				//自动聚焦到username上面
						// 				that.$refs.inputRef.$el.children[0].focus();
						// 			}
						// 		});
						// 	} else if (res.data == "insert_success") {
						// 		that.$alert('用户名：' + that.regForm.usernameReg + ' , 注册成功', '提示', {
						// 			confirmButtonText: '去登录',
						// 			type: 'success',
						// 			showClose: false,
						// 			callback: action => {
						// 				that.isReg = false;
						// 				this.resetReg();
						// 			}
						// 		});
						// 	} else {
						// 		that.$alert('错误：' + res.data + '，提示', {
						// 			confirmButtonText: '确认',
						// 			type: 'error',
						// 			showClose: true
						// 		});
						// 	}
						// }).catch(function(error) {
						// 	console.log(error);
						// })
						this.$http.post('/user/register',{username:that.regForm.usernameReg,password:that.regForm.passwordReg}).then(res=>{
							// console.log(res)
							// that.$message.success('注册成功');
							// that.regloading = false;
							if(res){
								if(res.status == 200){
									// that.$message.success('注册成功');
									that.isReg = false;
									that.resetReg();
								}
							}
							
							// if (res.data == "username_repeat") {
							// 	that.$alert('用户名已存在，请重新输入', '提示', {
							// 		confirmButtonText: '确定',
							// 		showClose: false,
							// 		type: 'error',
							// 		callback: action => {
							// 			//自动聚焦到username上面
							// 			that.$refs.inputRef.$el.children[0].focus();
							// 		}
							// 	});
							// } else if (res.data == "insert_success") {
							// 	that.$alert('用户名：' + that.regForm.usernameReg + ' , 注册成功', '提示', {
							// 		confirmButtonText: '去登录',
							// 		type: 'success',
							// 		showClose: false,
							// 		callback: action => {
							// 			that.isReg = false;
							// 			this.resetReg();
							// 		}
							// 	});
							// } else {
							// 	that.$alert('错误：' + res.data + '，提示', {
							// 		confirmButtonText: '确认',
							// 		type: 'error',
							// 		showClose: true
							// 	});
							// }
						}).catch(function(error) {
							console.log(error);
						})
						
						
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.login_container {
		height: 100vh;
		width: 100vw;
		background-color: #9c97a7;
	}

	.login {
		width: 500px;
		height: 360px;
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #FFF;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		box-shadow: 1px 1px 8px #596270;
		animation: ;
	}

	.avater {
		width: 150px;
		line-height: 50px;
		font-size: 25px;
		font-weight: bold;
		margin: 15px auto;
		text-align: center;
		color: #66B1FF;
	}

	.form_login {
		width: 60%;
		height: 68%;
		margin: 20px auto;
		margin-bottom: 0;
	}

	/* 	.cpitem{
		display: flex;
		flex-direction:row;
		flex-wrap: nowrap;
	} */
	.captcha {
		width: 50%;
	}

	.img {
		float: right;
		margin-top: 6px;
		margin-right: 15px;
		border: 1px solid #262A30;
		width: 100px;
		height: 30px;
		background-color: #596270;
	}

	.btns {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 15px;
	}

	.goReg {
		float: right;
	}

	/* transition */
	.slide-fade-enter-active {
		transition: all .3s ease;
	}

	.slide-fade-leave-active {
		transition: all .3s ease;
	}

	.slide-fade-enter,
	.slide-fade-leave-to

	/* .slide-fade-leave-active for below version 2.1.8 */
		{
		transform: translate(10px, 0px);
		opacity: 0;
	}
</style>
