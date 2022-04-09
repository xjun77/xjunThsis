<template>
	<div >
		<el-backtop style="display: none;" id="gotop"></el-backtop>
		<h1 class="empty" v-if="counts == 0">空空如也，快去发表文章吧 ~ </h1>
		<artCard v-for="(art,index) in arts" :key="index" :art="art"></artCard>
		<el-pagination
		   class="pages"
		   layout="prev, pager, next"
		   @current-change="handleCurrentChange"
		   background
		   :page-size="page_size"
		   :total="counts"
		   :current-page="current_page"
		   v-if="counts>0">
		</el-pagination>
	</div>
</template>

<script>
	import artCard from '../components/artCard.vue'
	// import('../css/pages.css')  //分页背景色、字体色
	export default {
		name: 'all_art',
		data() {
			return {
				page_size:5,
				counts:0,
				arts:[],
				current_page:1
			}
		},
		inject:['reload'],
		components: {
			artCard
		},
		beforeMount() {
			var that = this;
			// console.log(that.current_page)
			// console.log(that.page_size)
			let queryPage = that.$route.query.Page
			that.current_page = parseInt(queryPage)
			this.$http.get('/article',{params: {current_page:that.current_page,page_size:that.page_size}})
			.then(res=>{
				console.log(res.data.list)
				that.counts = res.data.count;
				that.arts = res.data.list;
			}).catch(error=>{
				console.log(error)
			})
		},
		beforeCreate() {
			
		},
		methods: {
			handleCurrentChange(val){
				// var that = this;
				// this.$http.get('/article',{params: {current_page:val,page_size:that.page_size}})
				// .then(res=>{
				// 	console.log(res.data)
				// 	const gotop = document.getElementById('gotop')
				// 	if(gotop){
				// 		gotop.click()
				// 	}
				// 	that.counts = res.data.count;
				// 	that.arts = res.data.list;
				// }).catch(error=>{
				// 	console.log(error)
				// })
				
				this.$router.push('/Article?Page='+val)
				this.reload()
			}
		}
	}
</script>

<style scoped>
	.pages{
		text-align: center;
	}
	.empty{
		text-align: center;
		color: #777A7F;
		margin-top: 10%;
	}
</style>
