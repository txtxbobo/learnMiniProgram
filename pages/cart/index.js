// pages/cart/index.js
/*
  1.获取收货地址功能
  2.调用小程序内置的api  wx.chooseAddress
  3.获取用户对小程序所授予的地址的权限状态
*/ 
import { chooseAddress, showModal, showToast } from "../../utils/asyncWX";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    // 获取缓冲中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓冲中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选  数组遍历方法，确保每一个回调函数都返回true  才返回true
    // 空数组调用every方法返回值就是true
    this.setData({
      address,
    });
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 点击收货地址蛋妞触发的点击事件
  async handleChooseAddress() {
    let address = await chooseAddress();
    // console.log(res);
    address.all =
      address.provinceName +
      address.cityName +
      address.countyName +
      address.detailInfo;
    wx.setStorageSync("address", address);
  },
  // 商品的选中
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex((item) => item.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 重新计算价格 数量等
    this.setCart(cart);
  },
  // 设置购物车数据 计算总价格 数量 设置选中状态
  setCart(cart) {
    const allChecked = cart.length ? cart.every((item) => item.checked) : false;
    // 1.总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }
    });
    // 把购物车数据重新设置会data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
  // 全选事件
  handleItemAllChecked() {
    // 获取data中的全选变量
    let { cart, allChecked } = this.data;
    // 修改至
    allChecked = !allChecked;
    // 循环修改数组中的商品选中状态
    cart.forEach((v) => (v.checked = allChecked));
    // 把修改后的值填充回data和缓存中
    this.setCart(cart);
  },
  // 商品增减功能
  async handleItemNumEdit(e) {
    // console.log(e);
    const { id, operation } = e.currentTarget.dataset;
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex((v) => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: "对否要删除该商品?" });
      if (res.confirm) {
        cart.splice(index, 1);
        // 把success变成箭头函数的方式、修改this指向
        this.setCart(cart);
      }
    } else {
      // 开始进行修改数量
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 结算功能
  async handlePay() {
    // 判断收货地址
    const {address, totalNum} = this.data;
    if (!address.userName) {
      await showToast({title:"您还没有选择收货地址！"});
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      showToast({title:"您还没有选购商品！"})
      return 
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
      
  }
});