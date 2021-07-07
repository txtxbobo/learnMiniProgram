// pages/order/index.js
/*
  1.页面被打开的时候，onshow或者onload 频繁打开甩onshow
    获取url上的额type参数  发送请求渲染页面
    onShow无法在形参上接受options参数的
  2.点击不同的标题，发送不同的请求来渲染
*/ 
import {request} from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "代付款",
        isActive: false,
      },
      {
        id: 2,
        value: "代发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
  },
  // onLoad(options) {
  //   console.log(options);
  // },
  // 渲染数据
  onShow() {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
  }
    // 获取当前小程序的页面站 数组：长度最大为10
    // 数组中索引最大的页面就是当前页面
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length - 1];
    // 获取url上的参数
    const {type} = currentPage.options;
    // 激活选中页面标题
    this.changeTitleByIndex(type - 1)
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data:{type}});
    console.log(res);
    this.setData({
      orders: res.data.message.orders.map((v) => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
      })),
    });
  },
  // 根据标题的索引来激活选中的标题数组
  changeTitleByIndex(index) {
    // let {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=> i === index ? (v.isActive = true) : (v.isActive = false))
    this.setData({
      tabs
    })
  },
  handleItemChange(e){
    // console.log(e);
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index + 1)
  }
});