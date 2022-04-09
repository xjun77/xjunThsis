// pages/todetail/todetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '标题',
    username: '',
    createTime: '',
    updateTime: '',
    tags: [],
    context: '',
    type: ['', 'success', 'info', 'warning', 'danger'],
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    wx.request({
      url: `${app.globalData.Apiurl}/article/getArtdetail?aid=${options.id}`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          that.setData({
            title : res.data.title,
						tags : res.data.tag,
						createTime : res.data.createTIME,
						updateTime : res.data.updateTIME,
						username : res.data.username,
						context : res.data.context
          })
        }
      }
    })
    wx.request({
      url: `${app.globalData.Apiurl}/article/getComments?aid=${options.id}`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.comments)
        that.setData({
          comments:res.data.comments
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})