// pages/collect/index.js
Page({
  data: {
    collect:[],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true,
      },
      {
        id: 0,
        value: "品牌收藏",
        isActive: false,
      },
      {
        id: 0,
        value: "店铺收藏",
        isActive: false,
      },
      {
        id: 0,
        value: "浏览足迹",
        isActive: false,
      },
    ],
  },
  onLoad() {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },
  handleItemChange(e) {
    console.log(e);
    let {tabs} = this.data;
    const {index} = e.detail;
    tabs.forEach((v,i)=>i === index ? (v.isActive = true) : (v.isActive = false))
    this.setData({
      tabs
    })
  }
});