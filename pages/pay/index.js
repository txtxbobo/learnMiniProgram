// pages/cart/index.js
/*
  1.从缓存中获取购物车数据，渲染到结算页面中
      checked属性为true
  2.微信支付
    那些人或那些账号可以实现微信支付
      1.企业账号  
      2.企业账号的小程序后台中，必须给开发者添加上白名单
      3.一个Appid可以绑定多个开发者
*/
import { chooseAddress, showModal, showToast, requestPayment} from "../../utils/asyncWX";
import { request } from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    // 获取缓冲中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓冲中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 计算全选  数组遍历方法，确保每一个回调函数都返回true  才返回true
    // 过滤后的购物车数组
    cart = cart.filter((v) => v.checked);
    // 空数组调用every方法返回值就是true
    this.setData({
      address,
    });
    // 1.总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    // 把购物车数据重新设置会data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    });
  },
  // 支付按钮
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/index",
        });
        return;
      }
      // 存在token值时 ，开始创建订单, 获取订单编号
      // 请求头参数
      // const header = { Authorization: token };
      // 准备请求体参数
      const order_price = this.data.totalPrice;
      console.log(order_price);
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach((v) =>
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price,
        })
      );
      const orderParams = {
        order_price,
        consignee_addr,
        goods,
      };
      // 发送请求，创建订单 获取订单编号
      const res = await request({
        url: "/my/orders/create",
        data: orderParams,
        method: "POST",
      });
      const { order_number } = res.data.message;
      // 准备发起预支付的接口
      const orderPay = await request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        data: { order_number },
      });
      const { pay } = orderPay.data.message;
      // 支付完成，手动删除已经被选中了的商品
      // await requestPayment(pay);
      // wx.navigateTo({
      //   url: "/pages/order/index",
      // });
      // 查询后台  订单状态
      const payStatus = await request({
        url: "/my/orders/chkOrder",
        method: "POST",
        data: { order_number },
      });
      // 弹窗提示
      await showToast({title:"支付成功"});
      // 支付成功后，在缓存中删除该商品
      let newCart = wx.getStorageSync("cart");
      // 过滤掉选中的
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
        
      // 支付成功了。跳转刀片订单页面
      wx.navigateTo({
        url: "/pages/order/index",
      });
    } catch (error) {
      await showToast({ title: "支付成功" });
      console.log(error);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
});
