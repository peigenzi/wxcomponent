// pages/1clip/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: ''
  },

  handleImg() {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        console.log(res);
        this.setData({
          // imageUrl: res.
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },

  _contentStartMove: function(e) {
    //console.log(e);
    this.picture_cut.contentStartMove(e.detail);
  },
  _contentMoveing: function(e) {
    //console.log(e);
    this.picture_cut.contentMoveing(e.detail);
  },
  _dragStart: function(e) {
    //console.log(e);
    this.picture_cut.dragStart(e.detail);
  },
  _dragMove: function(e) {
    //console.log(e);
    this.picture_cut.dragMove(e.detail);
  },
  _scaleChange: function(e) {
    //console.log(e);
    this.picture_cut.scaleChange(e.detail);
  },
  _getImageInfo: function(e) {
    //console.log(e);
    this.picture_cut.getImageInfo(e.detail);
  },
  _changefixedRatio: function(e) {
    //console.log(e);
    this.picture_cut.changefixedRatio(e.detail);
  },
  _alterScaleBtn: function() {
    //console.log();
    this.picture_cut.alterScaleBtn();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.picture_cut = this.selectComponent('#picture-cut');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
