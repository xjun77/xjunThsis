<template>
    <div>
        <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
            <el-avatar class="header-img" :size="40" :src="user.avatar"></el-avatar>
            <div class="reply-info" >
                <div 
                tabindex="0" 
                contenteditable="true" 
                id="replyInput" 
                spellcheck="false" 
                placeholder="输入评论..." 
                class="reply-input" 
                @focus="showReplyBtn"  
                @input="onDivInput($event)"
                >
                </div>
            </div>
            <div class="reply-btn-box" v-show="btnShow">
                <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
            </div>
        </div>
        <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="item.headImg"></el-avatar>
            <div class="author-info" @click="showReplyInput(i,item.name,item.id)">
                <span class="author-name">{{item.name}}</span>
                <span class="author-time">{{item.time}}</span>
            </div>
            <!-- <div class="icon-btn">
                <span @click="showReplyInput(i,item.name,item.id)"><i class="iconfont el-icon-s-comment"></i>{{item.commentNum}}</span>
                <i class="iconfont el-icon-caret-top"></i>{{item.like}}
            </div> -->
            <div class="talk-box">
                <p>
                    <span class="reply">{{item.comment}}</span>
                </p>
            </div>
            <div style="margin-left: 50px;margin-top: 10px;background-color: #dfdfdf;">
                <div v-for="(reply,j) in item.reply" :key="j" class="author-title">
                    <el-avatar class="header-img" :size="30" :src="reply.fromHeadImg"></el-avatar>
                    <div class="author-info"  @click="showReplyInput1(i,reply.fromwho,item.id)">
                        <span class="author-name" style="font-size: 14px;">{{reply.fromwho}}</span>
                        <span class="author-time" style="font-size: 12px;">{{reply.time}}</span>
                    </div>
                    <!-- <div class="icon-btn">
                        <span @click="showReplyInput(i,reply.from,reply.id)"><i class="iconfont el-icon-s-comment"></i>{{reply.commentNum}}</span>
                        <i class="iconfont el-icon-caret-top"></i>{{reply.like}}
                    </div> -->
                    <div class="talk-box" style="margin-left: 35px;">
                        <p>
                            <span v-if="!reply.isdirect" class="qianreply" >回复 {{reply.towho}}:</span>
                            <span class="reply" style="font-size: 14px;">{{"     "+reply.comment}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div  v-show="index == i" class="my-reply my-comment-reply">
                <el-avatar class="header-img" :size="30" :src="user.avatar"></el-avatar>
                <div class="reply-info" >
					<div style="margin-bottom: 8px;font-size: 14px;"><span>回复 {{towho}}:</span></div>
                    <div tabindex="0" :id="'inputarea'+i" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>
                </div>
                <div class=" reply-btn-box">
                    <el-button class="reply-btn" size="medium" @click="sendCommentReply(i)" type="primary">发表评论</el-button>
				</div>
			</div>
        </div>
    </div>
</template>

<script>
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
    function documentHandler(e) {
    // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
            return false;
        }
    // 判断指令中是否绑定了函数
        if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e);
        }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
export default {
    name:'ArticleComment',
	props:{
		artid:String,
		title:String,
		comments:Array
	},
    data(){
        return{
            btnShow: false,
			isdirect:false,//直接回复
            index:-1,
            replyComment:'',
			user:JSON.parse(sessionStorage.user),
            myId:19870621,
            towho:'',
            toId:-1,
       //      comments:[
       //          {
       //              name:'Lana Del Rey',
       //              id:19870621,
       //              headImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
       //              comment:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
       //              time:'2019年9月16日 18:43',
       //              // commentNum:2,
       //              // like:15,
       //              reply:[
       //                  {
							// isdirect:true,
       //                      fromwho:'Taylor Swift',
       //                      fromId:19891221,
       //                      fromHeadImg:'https://ae01.alicdn.com/kf/H94c78935ffa64e7e977544d19ecebf06L.jpg',
       //                      towho:'Lana Del Rey',
       //                      toId:19870621,
       //                      comment:'我很喜欢你的新专辑！！',
       //                      time:'2019年9月16日 18:43',
       //                      // commentNum:1,
       //                      // like:15,
       //                  },
       //                  {
							// isdirect:false,
       //                      fromwho:'Ariana Grande',
       //                      fromId:1123,
       //                      fromHeadImg:'https://ae01.alicdn.com/kf/Hf6c0b4a7428b4edf866a9fbab75568e6U.jpg',
       //                      towho:'Lana Del Rey',
       //                      toId:19870621,
       //                      comment:'别忘记宣传我们的合作单曲啊',
       //                      time:'2019年9月16日 18:43',
       //                      // commentNum:0,
       //                      // like:5,

       //                  }
       //              ]
       //          },
       //          {
       //              name:'Taylor Swift',
       //              id:19891221,
       //              headImg:'https://ae01.alicdn.com/kf/H94c78935ffa64e7e977544d19ecebf06L.jpg',
       //              comment:'我发行了我的新专辑Lover',
       //              time:'2019年9月16日 18:43',
       //              // commentNum:1,
       //              // like:5,
       //              reply:[
       //                  {
							// isdirect:true,
       //                      fromwho:'Lana Del Rey',
       //                      fromId:19870621,
       //                      fromHeadImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
       //                      towho:'Taylor Swift',
       //                      toId:19891221,
       //                      comment:'新专辑和speak now 一样棒！',
       //                      time:'2019年9月16日 18:43',
       //                      // commentNum:25,
       //                      // like:5,

       //                  }
       //              ]
       //          },
       //          {
       //              name:'Norman Fucking Rockwell',
       //              id:20190830,
       //              headImg:'https://ae01.alicdn.com/kf/Hdd856ae4c81545d2b51fa0c209f7aa28Z.jpg',
       //              comment:'Plz buy Norman Fucking Rockwell on everywhere',
       //              time:'2019年9月16日 18:43',
       //              // commentNum:0,
       //              // like:5,
       //              reply:[]
       //          },
       //      ]
        }
    },
    directives: {clickoutside},
    methods: {
        inputFocus(){
            var replyInput = document.getElementById('replyInput');
            replyInput.style.padding= "8px 8px"
            replyInput.style.border ="2px solid blue"
            replyInput.focus()
        },  
        showReplyBtn(){
            this.btnShow = true
        },
        hideReplyBtn(){
            this.btnShow = false
            replyInput.style.padding= "10px"
            replyInput.style.border ="none"
        },
        showReplyInput(i,name,id){
            // this.comments[this.index].inputShow = false
            this.index = i
            // this.comments[i].inputShow = true
            this.towho = name
            this.toId = id
			this.isdirect = true
			this.$nextTick(()=>{
				document.getElementById('inputarea'+i).focus()
			})
        },
		showReplyInput1(i,replyto,id){
			this.showReplyInput(i,replyto,id)
			this.isdirect = false
		},
        // _inputShow(i){
        //     return this.comments[i].inputShow 
        // },
        sendComment(){
            if(!this.replyComment){
                 this.$message({
                    showClose: true,
                    type:'warning',
                    message:'评论不能为空'
                })
            }else{
                let a ={}
                let input =  document.getElementById('replyInput')
                let timeNow = new Date().getTime();
                let time= this.dateStr(timeNow);
				a.artid = this.artid
				a.title = this.title
                a.name= this.user.username
                a.comment =this.replyComment
                a.headImg = this.user.avatar
                a.time = time
				a.reply = []
                // a.commentNum = 0
                // a.like = 0
                this.comments.push(a)
                this.replyComment = ''
                input.innerHTML = '';
				let that = this
				that.$http({
					method: 'post',
					url: '/article/upComment',
					data: a
				}).then(res => {
					console.log(res)
					if (res.status == 200) {
						
					} else {

					}
				})
			}
        },
        sendCommentReply(i){
            if(!this.replyComment){
                 this.$message({
                    showClose: true,
                    type:'warning',
                    message:'评论不能为空'
                })
            }else{
                let a ={}
                let timeNow = new Date().getTime();
                let time= this.dateStr(timeNow);
                a.fromwho= this.user.username
                a.towho = this.towho
                a.fromHeadImg = this.user.avatar
                a.comment =this.replyComment
                a.time = time
                // a.commentNum = 0
                // a.like = 0
				a.isdirect = this.isdirect
				console.log(this.comments[i])
                this.comments[i].reply.push(a)
                this.replyComment = ''
                document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
				// this.comments[this.index].inputShow = false
				this.index = -1
				
				let that = this
				that.$http({
					method: 'post',
					url: '/article/upCommentReply',
					data: {artid:that.artid,index:i,comment:a}
				}).then(res => {
					console.log(res)
					if (res.status == 200) {
						
					} else {
				
					}
				})
            }
        },
        onDivInput: function(e) {
            this.replyComment = e.target.innerHTML;
        },
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
        }
    },    
}
</script>


<style lang="stylus" scoped>
.my-reply
    padding 10px
    background-color #e9eef3
    .header-img
        display inline-block
        vertical-align top
    .reply-info    
        display inline-block
        margin-left 5px
        width 90%
        @media screen and (max-width:1200px) {
            width 80%
        }
        .reply-input
            min-height 20px
            line-height 22px
            padding 10px 10px
            color #000
            background-color #f8f8f8
            border-radius 5px
            &:empty:before
                content attr(placeholder)
            &:focus:before
                content none
            &:focus
                padding 8px 8px
                border 2px solid #9398ff
                box-shadow none
                outline none
    .reply-btn-box
        height 25px
        margin 10px 0
        .reply-btn
            position relative
            float right
            margin-right 15px
.my-comment-reply
    margin-left 50px
    .reply-input
        width flex
.author-title:not(:last-child)
    border-bottom: 1px solid rgba(99, 103, 108, 0.3)
.author-title
    padding 10px
    .header-img
        display inline-block
        vertical-align top
    .author-info
        display inline-block
        margin-left 5px
        width 60%
        height 40px
        line-height 20px
        >span 
            display block
            cursor pointer
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
        .author-name
            color #000
            font-size 18px
            font-weight bold
        .author-time
            font-size 14px
    .icon-btn
        width 30%
        padding 0 !important 
        float right
        @media screen and (max-width : 1200px){
            width 20%
            padding 7px
        }
        >span 
            cursor pointer
        .iconfont 
            margin 0 5px
    .talk-box
        margin 0 50px
        >p
           margin 0
		.qianreply
			font-size 12px
			color #777
        .reply
            font-size 16px
            color #000
</style>

