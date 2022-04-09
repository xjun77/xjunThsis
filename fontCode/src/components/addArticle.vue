<template>
	<div>
		<h1>创建新资讯</h1>
		<el-card class="box-card" body-style="padding-bottom:12px">
			<el-input placeholder="请输入标题..." v-model="addArticle.title" class="title" clearable>
				<template slot="prepend">资讯标题</template>
			</el-input>
			<div class="tab-card">
				<div class="tabslot">标签：</div>
				<el-tag :key="index" effect="dark" v-for="(tag,index) in addArticle.tags" :type="type[index%5]" closable
				 :disable-transitions="false" @close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
				 @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
			</div>
			<quill-editor v-model="addArticle.context" ref="myQuillEditor" :options="editorOption"></quill-editor>
			<!-- <el-upload class="upload-demo" :action="qnLocation" :before-upload='beforeUpload' :data="uploadData" :on-success='upScuccess'
			 ref="upload" style="display:none"> -->
			<el-upload class="upload-demo" action="http://upload-z2.qiniup.com" :before-upload='beforeUpload' :data="uploadData"
			 :on-success='upScuccess' ref="upload" style="display:none">
				<el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading"
				 element-loading-text="插入中,请稍候">点击上传</el-button>
			</el-upload>
			<div class="image_fengmian" v-show="this.fengmianUrl">
			  <div class="demonstration">封</br>面</br>预</br>览</div>
			  <el-image 
			    style="width: 150px; height: 60px"
			    :src="fengmianUrl" 
			    :preview-src-list="fengmianSrcList">
			  </el-image>
			</div>
			<el-button type="primary" class="btn" @click="uploadArt()" plain>发表资讯</el-button>
			<el-upload class="btn" action="http://upload-z2.qiniup.com" :before-upload='beforeUploadFM' 
			 :on-success='upScuccessFM' ref="uploadFM" :multiple='false' :show-file-list='false' :data="uploadDataFM" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG">
				<el-button type="danger" plain v-loading.fullscreen.lock="fullscreenLoading"
			    element-loading-text="插入中,请稍候">上传封面</el-button>
			</el-upload>
			<el-button type="info" class="btn" @click="cancleArt()" plain>取消</el-button>
		</el-card>
	</div>
</template>

<script>
	import Quill from 'quill'
	const STATICDOMAIN = 'http://cdn.xjun.cloud/' // 图片服务器的域名，展示时使用
	//const STATVIDEO = 'http://nuotasuo.com/'//视频服务器的域名，展示时使用
	//require style
	import 'quill/dist/quill.core.css' // import styles
	import 'quill/dist/quill.snow.css' // for snow theme
	import 'quill/dist/quill.bubble.css' // for bubble theme
	// //注册图片可改变大小组件
	import ImageResize from 'quill-image-resize-module'
	Quill.register('modules/imageResize', ImageResize)

	export default {
		name: 'addArticle',
		data() {
			return {
				addArticle: {
					//文章标题
					title: '',
					//标签
					tags: [],
					//文章内容
					context: ''
				},
				//封面地址
				fengmianUrl:'',
				fengmianSrcList:[],
				uploadDataFM:{},
				user:JSON.parse(sessionStorage.user),
				inputVisible: false,
				inputValue: '',
				type: ['', 'success', 'info', 'warning', 'danger'],
				editorOption: {
					placeholder: '请输入内容',
					modules:{
						imageResize: {   //添加
							displayStyles: {   //添加
							  backgroundColor: 'black',
							  border: 'none',
							  color: 'white'
							},
							modules: ['Resize', 'DisplaySize', 'Toolbar']   //添加
					    },
						toolbar: [
						            ['bold', 'italic', 'underline', 'strike'],
						            ['formula', 'clean'],
						            ['blockquote', 'code-block'],
						            [{'list': 'ordered'}, {'list': 'bullet'}],
						            [{'script': 'sub'}, {'script': 'super'}],
						            [{'size': ['small', false, 'large', 'huge']}],
						            [{ 'font': [] }],
						            [{'header': [1, 2, 3, 4, 5, 6, false]}],
						            [{ 'color': [] }, { 'background': [] }],
						            [{ 'align': [] }],
						            [{'direction': 'rtl'}],
									['video', 'image']
						          ]
					},
				},

				addRange: [],
				uploadData: {},
				photoUrl: '', //上传图片地址
				uploadType: '',
				fullscreenLoading: false,

				$refs: {
					myQuillEditor: HTMLInputElement,
					imgInput: HTMLInputElement
				}
			}
		},
		methods: {
			dateStr(date){
			        var date= new Date(parseInt(date));
					let hours=date.getHours(),mins=date.getMinutes()
					if(hours<10){
						hours = '0'+hours
					}
					if(mins<10){
						mins = '0'+mins
					}
			        return date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日 "+hours+":"+mins;
			},
			handleClose(tag) {
				this.addArticle.tags.splice(this.addArticle.tags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.addArticle.tags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},

			// computed: {
			// 	// 上传七牛的actiond地址，http 和 https 不一样
			// 	qnLocation: {
			// 		get: function() {
			// 			return window.location.protocol === 'http:' ? 'http://upload.qiniu.com' : 'https://up.qbox.me'
			// 		}
			// 	}
			// },
			// 图片上传之前调取的函数
			//封面图片
			beforeUploadFM(file){
				// const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
				let isPhoto = false
				console.log(file.type)
				if(file.type === 'image/jpeg'){
					isPhoto = true
				}else if(file.type === 'image/png'){
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
			upScuccessFM(response, file, fileList){
				this.fullscreenLoading = false
				let url = STATICDOMAIN + response.key;
				// console.log(url)
				if (url != null && url.length > 0){
					this.fengmianUrl = url
					this.fengmianSrcList = [url]
				}
			},
			
			// 这个钩子还支持 promise
			beforeUpload(file) {
				return this.qnUpload(file)
			},
			
			// 点击图片ICON触发事件`
			imgHandler(state) {
				this.addRange = this.$refs.myQuillEditor.quill.getSelection()
				if (state) {
					let fileInput = document.getElementById('imgInput')
					fileInput.click() // 加一个触发事件
				}
				this.uploadType = 'image'
			},
			
			// 点击视频ICON触发事件
			videoHandler(state) {
				this.addRange = this.$refs.myQuillEditor.quill.getSelection()
				if (state) {
					let fileInput = document.getElementById('imgInput')
					fileInput.click() // 加一个触发事件
				}
				this.uploadType = 'video'
			},
			// 图片上传前获得数据token数据
			qnUpload(file) {
				this.fullscreenLoading = true
				const suffix = file.name.split('.')
				const ext = suffix.splice(suffix.length - 1, 1)[0]
				console.log(this.uploadType)
				if (this.uploadType === 'image') { // 如果是点击插入图片
					// TODO 图片格式/大小限制
					return this.$http.get('/article/upload').then(res => {
						this.uploadData = {
							key: `image/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
							token: res.data
						}
					})
				} else if (this.uploadType === 'video') { // 如果是点击插入视频
					return this.$http.get('/article/upload').then(res => {
						this.uploadData = {
							key: `video/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
							token: res.data
						}
					})
				}
			},
			// 图片上传成功回调   插入到编辑器中
			upScuccess(e, file, fileList) {
				console.log(e)
				this.fullscreenLoading = false
				let that = this
				let url = STATICDOMAIN + e.key;
				// if (this.uploadType === 'image') { // 获得文件上传后的URL地址
				// 	url = STATICDOMAIN + e.key
				// } else if (this.uploadType === 'video') {
				// 	url = STATVIDEO + e.key
				// }
				if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
					let value = url
					// API: https://segmentfault.com/q/1010000008951906
					// this.$refs.myTextEditor.quillEditor.getSelection();
					// 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
					that.addRange = that.$refs.myQuillEditor.quill.getSelection()
					value = value.indexOf('http') !== -1 ? value : 'http:' + value
					that.$refs.myQuillEditor.quill.insertEmbed(that.addRange !== null ? that.addRange.index : 0, that.uploadType,
						value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
				} else {
					this.$message.error(`${that.uploadType}插入失败`)
				}
				this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
			},


			//取消
			cancleArt() {
				if (this.addArticle.context != '' || this.addArticle.tags.length != 0 || this.addArticle.title != '') {
					this.$confirm('是否确定退出?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//用户点击确定
						this.addArticle = {
							//文章标题
							title: '',
							//标签
							tags: [],
							//文章内容
							context: ''
						};
						this.$router.push('Article')
					}).catch(() => {
						//用户点击取消

					});
				} else {
					this.$router.push('Article')
				}
			},
			//上传封面
			upPhoto(){
				let that = this;
			},
			//上传文章
			uploadArt() {
				let that = this;
				// let params = JSON.stringify(that.addArticle)
				that.fullscreenLoading = true;
				//标题为空
				if(that.addArticle.title === ''){
					that.fullscreenLoading = false;
					return this.$message.error('请输入文章标题!');
				}
				let timeNow = new Date().getTime();
				let time= that.dateStr(timeNow);
				that.$http({
					method: 'post',
					url: '/article/uploadArt',
					data: {
						// username: window.sessionStorage.getItem('username')
						ID:'aid_'+(Math.random().toString().substr(3,10) + Date.now()).toString(36),
						username:that.user.username,
						avatar:that.user.avatar,
						title:that.addArticle.title,
						tag:that.addArticle.tags,
						context:that.addArticle.context,
						photo_url:that.fengmianUrl,
						updateTIME:time,
						createTIME:time,
					}
				}).then(res => {
					if (res.status == 200) {
						that.fullscreenLoading = false;
						console.log(res.data)
						this.$alert('文章提交成功', '提示', {
							confirmButtonText: '确定',
							showClose: false,
							type:'success',
							callback: action => {
								this.addArticle = {
									//文章标题
									title: '',
									//标签
									tags: [],
									//文章内容
									context: ''
								};
								this.$router.push({
										path:'toArticle',
										query:{ id: res.data}
									})
								
							}
						});
					} else {
						this.$message.error('something error happen !');
					}
				}).catch(function(error) {
					console.log(error);
				})
			}
		},
		// 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
		mounted() {
			// 为图片ICON绑定事件  getModule 为编辑器的内部属性
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler) // 为视频ICON绑定事件
		}
	}
</script>

<style scoped="scoped">
	h1 {
		margin-top: 0;
		margin-bottom: 20px;
		text-align: center;
	}

	.title {
		margin-bottom: 10px;
		font-size: 15px;
	}

	.tab-card {
		width: 808px;
		padding: 5px;
		margin-bottom: 10px;
	}

	.tabslot {
		display: inline-block;
		color: #777a7f;
		box-sizing: border-box;
	}

	.box-card {
		width: 850px;
		margin: 10px auto;
	}

	.btn {
		float: right;
		margin: 20px 5px;
		margin-bottom: 20px;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	
	.image_fengmian{
		display: inline-block;
		margin-top: 13px;
	}
	
	.demonstration{
		display: inline-block;
		font-size: 10px;
		color: indianred;
		margin-right: 10px;
	}
</style>
