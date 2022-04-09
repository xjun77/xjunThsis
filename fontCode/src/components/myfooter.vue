<template>
  <div class="footer">
    <p>
      本博客已运行
      <span>{{ runningTime }}</span>
    </p>
    <p>本站由 @Xjun7 创建 - © 2022.&nbsp;@Xjun7 博客/论坛 Github</p>
  </div>
</template>

<script>
export default {
  name: "myfooter",
  components: {},
  data() {
    return {
      runningTime: ""
    };
  },
  created() {
    this.running();
  },
  methods: {
    running() {
      let startTime = new Date("2022/02/01 00:00:00");
      let timer = setInterval(() => {
        let time = new Date() - startTime;
        let day = parseInt(time / 1000 / 60 / 60 / 24, 10);
        let hour = parseInt((time / 1000 / 60 / 60) % 24, 10);
        let minute = parseInt((time / 1000 / 60) % 60, 10);
        let second = parseInt((time / 1000) % 60, 10);
        this.runningTime = `${day}天${hour}小时${minute}分${second}秒`;
      }, 1000);
    }
  }
};
</script>

<style scoped="scoped">
.footer {
  color: #999;
  text-align: center;
  line-height: 30px;
}
p {
  height: 13px;
  margin-bottom: 10px;
}
</style>
