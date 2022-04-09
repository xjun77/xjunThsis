// pages/myarticle/myarticle.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arts:[],
  },
  todetail(e){
    console.log(e)
    let artid = e.currentTarget.dataset.artid
    wx.navigateTo({
      url: '../todetail/todetail?id='+artid,
    })

  },
  delete(e){
    let index = e.currentTarget.dataset.index
    let temp = this.data.arts.splice(index,1)
    console.log(temp)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.request({
      url: `${app.globalData.Apiurl}/article/current?username=`+app.globalData.user.username,
      method:'GET',
      success(res){
        console.log(res)
        that.setData({
          arts:res.data.list
        })
      }
    })
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