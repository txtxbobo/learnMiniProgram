import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
  },
  // 商品对象
  goodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({url:"/goods/detail",data:{goods_id}})
    this.goodsInfo = res.data.message;
    // console.log(res);
    this.setData({
      goodsDetail: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        pics: res.data.message.pics,
        goods_introduce: res.data.message.goods_introduce
      },
    });
  },

  // 点击轮播图方法预览
  handleprevewImage(e){
    const urls = this.goodsInfo.pics.map(item=>item.pics_mid)
    // 接受传递过来的额图片索引
    // console.log(e);
    // 接受传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      // 先构造要预览的图片数组
      current,
      urls
    });
      
  },
  // 添加购物车
  handleCartAdd() {
    // 获取缓冲中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if (index===-1) {
      // 不存在  第一次添加
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo)
    }else{
      // 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 把购物车重新添加到缓冲中
    wx.setStorageSync("cart", cart);
    // 弹窗提示信息
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      // 放置用户手抖 疯狂点击
      mask: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})