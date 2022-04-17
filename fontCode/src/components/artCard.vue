<template>
  <div class="card">
    <div
      class="cont"
      :style="{backgroundImage: 'url(' + art.photo_url + ')', backgroundSize:'cover'}"
    >
      <div class="title">
        <span class="tit" @click="toArticle">{{art.title}}</span>
        <!-- <span>{{art.photo_url}}</span> -->
      </div>
    </div>
    <div class="under">
      <div class="u1">
        <el-avatar :size="55" :src="art.avatar">123</el-avatar>
        <div>
          <div style="font-size: 20px;">{{art.username}}</div>
          <div>{{art.updateTIME}}</div>
        </div>
      </div>
      <div class="u1">
        <el-tag
          effect="dark"
          v-for="(item,index) in art.tag"
          :key="index"
          :type="type[index%5]"
        >{{item}}</el-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  props: {
    art: Object
  },
  data() {
    return {
      type: ["", "success", "info", "warning", "danger"]
    };
  },
  methods: {
    toArticle() {
      this.$router.push({
        path: "toArticle",
        query: {
          id: this.art.ID
        }
      });
    }
    // getArt(){
    // 	console.log(this.art);
    // }
  }
};
</script>

<style scoped>
.card {
  width: 80vw;
  max-width: 800px;
  min-width: 500px;
  height: 40vw;
  max-height: 400px;
  min-height: 250px;
  margin: 50px auto;
  box-sizing: border-box;
  border: 1px solid #999999;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 1px 1px 8px #596270;
}

.card:hover {
  box-shadow: 1px 1px 15px #262a30;
}

.cont {
  width: 100%;
  height: 80%;
  /* background-image: url(../imgs/pic1.png); */
  background: #55aa7f;
  box-sizing: border-box;
  position: relative;
}

.tit {
  padding: 10px;
  font-size: 25px;
  line-height: 30px;
  color: #fff;
  /* text-decoration: underline ; */
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
}

.tit:hover {
  box-shadow: 3px 3px 8px #fff;
}

.under {
  height: 20%;
  background-color: #f3f3f3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.u1 {
  width: 220px;
  line-height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
