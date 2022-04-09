<template>
	<div class="about">
		<el-container>
			<myheader 
			v-on:toAddArticle="toAddArticle" 
			v-on:toHome="tohome"
			v-on:toPersonal="toPersonal" 
			v-on:tochat="tochat">
			</myheader>
			<el-main>
				<router-view></router-view>
			</el-main>
			<el-footer height='93px'>
				<myfooter></myfooter>
			</el-footer>
		</el-container>
	</div>
</template>

<script>
	import myheader from '../components/myheader.vue'
	import myfooter from '../components/myfooter.vue'
	export default {
		name: 'hd',
		data() {
			return {
			}
		},
		inject:['reload'],
		components: {
			myheader,
			myfooter
		},
		methods: {
			toAddArticle() {
				this.$router.push({
					path: '/addArticle'
				})
			},
			toPersonal(){
				this.$router.push({
					path: '/personal'
				})
			},
			tohome(){
				this.$router.push('/Article?Page='+1)
				this.reload()
			},
			tochat(){
				this.$router.push('/tochat')
			}
			
		}

	}
</script>

<style scoped="scoped">
	/* .el-header, */
	.el-footer {
		min-width: 700px;
		background-color: #262A30;
	}

	.el-main {
		min-width: 700px;
		min-height: 790px;
		background-color: #f3f3f3;
		color: #333;
	}

	.pages {
		margin: 5px auto;
		text-align: center;
	}

	body>.el-container {
		margin-bottom: 40px;
	}
</style>
