const app = getApp()
Page({
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    artlength:0,
    username:''
  },
  topassword(){
    wx.navigateTo({
      url: '../gaimima/gaimima',
    })
  },
  topersonart(){
    wx.navigateTo({
      url: '../myarticle/myarticle',
    })
  },
  onShow(){
    console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.setData({
      username:app.globalData.user.username
    })
    wx.request({
      url: `${app.globalData.Apiurl}/user/getdetail?username=`+ that.data.username,
      method:'GET',
      success(res){
        if(res.statusCode == 200 ){
          let email = res.data.email||''
          let phone = res.data.phone||''
          let sex = res.data.sex||'女'
          let slog = res.data.slog||''
          let imgList = res.data.avatar||''
          if(sex == '女'){
            that.setData({
              checked:false
            })
          }
          that.setData({
            email: email,
            sex:sex,
            phone:phone,
            slog:slog,
            imgList:imgList
          })
          
        }
      }
    })
    wx.request({
      url: `${app.globalData.Apiurl}/article/current?username=`+app.globalData.user.username,
      method:'GET',
      success(res){
        console.log(res)
        that.setData({
          artlength:res.data.list.length
        })
      }
    })

    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(1),
          forksCount: that.coutNum(1),
          visitTotal: that.coutNum(that.data.artlength)
        })
      }
    }
    wx.hideLoading()
  },
  onLoad(){
    
  },
    topersonl(){
      wx.navigateTo({
        url: '../personal/personal',
      })
    },
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
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
})