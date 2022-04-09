const app = getApp();
Page({
  data: {
    ScreenHeight: app.globalData.ScreenHeight,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    InputBottom: 0,
    Numcount: 0,
    tobottom: "bottom",
    user: "",
    inputValue: "",
    isfocus: false,
    Numcount: 0,
    list: [],
  },
  InputFocus(e) {
    let that = this;
    this.setData({
      InputBottom: e.detail.height,
    });
    setTimeout(() => {
      that.setData({
        tobottom: "bottom",
      });
    });
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0,
    });
  },
  onReady: function () {
    this.setData({
      user: app.globalData.user,
    });
    this.initWebSocket();
  },
  onHide: function () {
    console.log(1);
  },
  onUnload: function () {
    console.log(123);
    wx.closeSocket({
      code: 1000,
    });
  },
  //发送聊天信息
  sendText() {
    let _this = this;
    let datenow = new Date();
    let hours = datenow.getHours();
    let minutes = datenow.getMinutes();
    this.setData({
      isfocus: true,
    });
    if (!_this.data.inputValue) {
      return;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let params = {
      username: _this.data.user.username,
      msg: _this.data.inputValue,
      time: hours + ":" + minutes,
      userAvater: _this.data.user.avatar,
    };
    console.log(JSON.stringify(params));
    wx.sendSocketMessage({
      data: JSON.stringify(params),
    });
    _this.setData({
      inputValue: "",
    });
    setTimeout(() => {
      _this.setData({
        tobottom: "bottom",
      });
    }, 20);
  },
  initWebSocket() {
    let _this = this;
    wx.connectSocket({
      // url: 'wss://chat.nuotasuo.com:3001'
      url: "wss://xjun.cloud:3001",
    });
    wx.onSocketOpen(function (res) {
      console.log("服务器连接");
    });
    wx.onSocketError((res) => {
      console.log("服务器异常");
    });
    wx.onSocketClose((res) => {
      console.log("服务器关闭");
    });
    //接收消息
    wx.onSocketMessage((res) => {
      let resData = JSON.parse(res.data);
      if (resData.funName == "userCount") {
        _this.setData({
          Numcount: resData.users,
          list: resData.chat,
        });
        // console.log(resData.chat);
      } else {
        let temp = _this.data.list;
        temp.push({
          username: resData.username,
          content: resData.msg,
          time: resData.time,
          userAvater: resData.userAvater,
        });
        _this.setData({
          list: temp,
        });
      }
      setTimeout(() => {
        _this.setData({
          tobottom: "bottom",
        });
      }, 20);
    });
  },
});
