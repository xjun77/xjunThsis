<template>
  <div id="app">
	<el-backtop :bottom="120" style="color:black"></el-backtop>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
    
  },
  //局部刷新 app.vue添加provide 需要刷新的用inject
  provide(){
	  return{
		  reload:this.reload
	  }
  },
  data(){
	  return{
		  isRouterAlive:true
	  }
  },
  methods:{
	  reload(){
		  this.isRouterAlive = false
		  this.$nextTick(function(){
			  this.isRouterAlive = true
		  })
	  }
  }
}
</script>

<style>
#app {
 
}
</style>
