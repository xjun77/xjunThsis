<template>
	<div>
		<div style="margin-top: 15px;width:800px;margin: 0 auto;">
			<el-input placeholder="请输入内容" v-model="input" class="input-with-select">
				<el-select v-model="select" slot="prepend" placeholder="请选择">
					<el-option label="标题" value="1"></el-option>
					<!-- <el-option label="内容" value="2"></el-option> -->
					<!-- <el-option label="标签" value="3"></el-option> -->
				</el-select>
				<el-button slot="append" icon="el-icon-search" @click="getarts()"></el-button>
			</el-input>
		</div>
		<el-card shadow="hover" v-for="(art,index) in arts" :key="index" class="box-card" style="width:1000px;margin: 30px auto;" >
			<div slot="header" class="clearfix">
				<span >{{art.title}}</span>
				<div style="float: right; padding: 3px 0" v-for="(tag,idx) in art.tag" :key="idx">
					<el-tag style="margin-right: 15px;" type="info">{{tag}}</el-tag>
				</div>
			</div>
			<el-image
			      style="height: 150px;width: 400px;background-color: #004444;"
			      :src="art.photo_url"
				  @click="toArticle(art.ID)"
			      >
			</el-image>
		</el-card>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				input: '',
				input2: '',
				input3: '',
				select: '1',
				arts:[]
			}
		},
		created() {

		},
		methods:{
			toArticle(aid) {
				console.log(1)
				console.log(aid)
				this.$router.push({
					path: 'toArticle',
					query: {
						id: aid
					}
				})
			},
			getarts(){
				let that =this
				this.$http.get('/article/all',{params: {title:this.input}})
				.then(res=>{
					console.log(res)
					// that.counts = res.data.count;
					that.arts = res.data.list;
				}).catch(error=>{
					console.log(error)
				})
			}
		}
	}
</script>

<style>
	.el-select {
		width: 130px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}
	.box-card:hover{
		cursor: pointer;
	}
</style>
