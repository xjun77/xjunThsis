// pages/chatList/chatList.js
const io = require("../../lib/socket.io-mp.js");
// 没有配置https是不是不能写https

const socket = io("https://xjun.cloud:3000", {
  autoConnect: false,
  transports: ["websocket"],
});
const sessionID = "609aad9f9a24d10f4c897c14";
const username = "jack";
const img = "http://cdn.xjun.cloud/avator-default.png";
socket.auth = { sessionID, username, img };
socket.userID = sessionID;
socket.connect();
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(socket.id);
    console.log("11");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    socket.disconnect();
    console.log("121");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
