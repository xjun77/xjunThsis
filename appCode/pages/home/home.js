//index.js
//获取应用实例
const app = getApp()

var timer;
Page({
  data: {
    page: 1,
    pagesize: 15,
    arts: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0
  },
  toperson(){
    wx.navigateTo({
      url: '../personpage/personpage',
    })
  },
  todetail(e){
    let artid = e.currentTarget.dataset.artid
    wx.navigateTo({
      url: '../todetail/todetail?id='+artid,
    })

  },
  refresher(e) {
    console.log(e)
  },
  onLoad: function (options) {
    console.log(options)
    let that = this
    wx.request({
      url: `${app.globalData.Apiurl}/article`,
      method: 'GET',
      data: {
        current_page: that.data.page,
        page_size: that.data.pagesize
      },
      success(res) {
        that.setData({
          arts: res.data.list
        })
        console.log(that.data.arts)
      },

    })
  },
  /*函数节流*/
  throttle(fn, interval) {
    var enterTime = 0; //触发的时间
    var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this;
      var backTime = new Date(); //第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  },
  handle(){
    console.log(Math.random())
  },
  tolower(e) {
    this.throttle(this.handle(),30000)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },


  toChatroom() {
    wx.navigateTo({
      url: '../index/chatroom/chatroom'
    })
  },
  loginOut() {
    wx.clearStorageSync()
    wx.navigateTo({
      url: '../login/login',
      success: function (res) {
        // success 
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        })
      },
    })
  }
})