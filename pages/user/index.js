// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 被收藏的商品的数量
    collectNum: 0,
  },
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];
    const collectNum = collect.length;

    this.setData({
      userInfo,
      collectNum,
    });
  },
  turnFedd() {
    wx.navigateTo({
      url: '/pages/feedback/index',
    });
  }
});