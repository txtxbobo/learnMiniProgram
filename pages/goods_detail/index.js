import { request } from "../../request/index";
import {showToast} from '../../utils/asyncWX'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    // 商品是否被收藏过
    isCollect: true,
  },
  // 商品对象
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // const {goods_id} = options;
    let page = getCurrentPages();
    let currentPages = page[page.length - 1];
    // console.log(page);
    let { goods_id } = currentPages.options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } });
    this.goodsInfo = res.data.message;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当亲的商品是否被搜藏了
    let isCollect = collect.some((v) => v.goods_id === this.goodsInfo.goods_id);
    // console.log(res);
    this.setData({
      goodsDetail: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        pics: res.data.message.pics,
        goods_introduce: res.data.message.goods_introduce,
      },
      isCollect,
    });
  },

  // 点击轮播图方法预览
  handleprevewImage(e) {
    const urls = this.goodsInfo.pics.map((item) => item.pics_mid);
    // 接受传递过来的额图片索引
    // console.log(e);
    // 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      // 先构造要预览的图片数组
      current,
      urls,
    });
  },
  // 添加购物车
  handleCartAdd() {
    // 获取缓冲中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex((v) => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      // 不存在  第一次添加
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    } else {
      // 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 把购物车重新添加到缓冲中
    wx.setStorageSync("cart", cart);
    // 弹窗提示信息
    wx.showToast({
      title: "加入成功",
      icon: "success",
      duration: 1500,
      // 放置用户手抖 疯狂点击
      mask: true,
    });
  },
  //  点击商品收藏 
  handleCollect() {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.goodsInfo.goods_id);
    // 3.当index！= -1表示已经收藏过了
    if (index != -1) {
      // 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      // 将isCollect改为false
      isCollect = false;
      showToast({title:"取消成功"});
        
    }else{
      // 没有收藏过
      collect.push(this.goodsInfo);
      // 将isCollect改为true
      isCollect = true;
      showToast({title:"收藏成功"})
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data当中的属性 isCollect
    this.setData({
      isCollect
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
});
