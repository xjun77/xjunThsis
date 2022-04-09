<template>
	<diV v-if="!is404">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<div class="left">
					<span class="title">{{title}}</span>
					<div class="date_tag">
						<div class="datetime">
							<span>作者：<span style="color: 	#1793ea;">{{username}}</span></span>
							<span>创建时间：{{createTime}}</span>
							<span>最后修改：{{updateTime}}</span>
							<!-- <span>创建时间：2021-05-02 10:21</span>
							<span>最后修改：2021-05-02 10:21</span> -->
						</div>
						<div class="tags">
							<el-tag
								v-for="(tag,index) in tags"
								class="tag"
								:key="index"
								:type="type[index%5]"
								effect="light"
								size="small"
								style="font-size: 16px;font-weight: bold"
								>
								{{tag}}
							  </el-tag>
						</div>
					</div>
				</div>
				<el-button class="back" type="text" @click="backone" >返回 ></el-button>
			</div>
			<div class="ql-container ql-snow">
				<div class="ql-editor" v-html="context">
				</div>
			</div>
		</el-card>
		<comments :artid="$route.query.id" :comments="comments" :title="title" style="width: 80%;margin: 0 auto;max-width: 1000px;min-width: 800px;"></comments>
	</diV>
	<h1 class="empty" v-else>你所请求的资源不存在~</h1>
</template>

<script scoped>
	import comments from './comments.vue'
	export default{
		name:'artDetail',
		components: {
			comments
		},
		data(){
			return{
				is404:false,
				title:'标题',
				username:'',
				createTime:'',
				updateTime:'',
				tags:[],
				context:'',
				type: ['', 'success', 'info', 'warning', 'danger'],
				comments:[]
			}
		},
		methods:{
			backone(){
				this.$router.go(-1)
			}
		},
		beforeCreate() {
			let that = this;
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			that.$http.get('/article/getArtdetail?aid='+that.$route.query.id)
			.then(res=>{
				// console.log(res);
				if(res){
					if(res.status == 200){
						// console.log(res)
						that.title = res.data.title;
						that.tags = res.data.tag;
						that.createTime = res.data.createTIME;
						that.updateTime = res.data.updateTIME;
						that.username = res.data.username,
						that.context = res.data.context;
					}else if(res.status == 404){
						that.is404 = true
					}else{
						return
					}
				}
			}).catch(error=>{
				console.log(error)
			});
			
			
			this.$http.get('/article/getComments?aid='+that.$route.query.id)
			.then(res=>{
				console.log(res.data.comments)
				that.comments = res.data.comments
			})
		}
	}
</script>

<style scoped>
	.empty{
		text-align: center;
		color: #777A7F;
		margin-top: 10%;
	}
	
	.box-card {
		width: 850px;
		margin: 10px auto;
	}
	.clearfix{
		position: relative;
	}
	.left{
		display: flex;
		flex-direction: column;
		justify-content: left;
	}
	.title{
		font-weight:bolder;
		font-size: 28px;
		margin-bottom: 10px;
	}
	.back{
		position: absolute;
		right: 10px;
		top: 0px;
		font-size: 18px;
		/* margin: auto 0; */
	}
	.date_tag{
		display: flex;
	}
	.tags{
		display: flex;
		align-items: flex-end;
	}
	.tag{
		cursor: pointer;
		margin-left: 15px;
		box-shadow: -1px 1px 2px #596270;
	}
	.tag:hover{
		box-shadow: -1px 1px 4px #596270;
	}
	.datetime{
		display: flex;
		flex-direction: column;
		font-size: 16px;
		color: #777A7F;
	}
	.datetime span{
		line-height: 25px;
	}
</style>
