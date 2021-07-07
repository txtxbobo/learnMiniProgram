// pages/goods_list/index.js
import {request} from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    goodsList: [],
  },
  // 节后需要的参数
  queryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  // 总页数
  totalPages: 1,
  // 标题点击事件，从子组件传递过来的
  handleTabsItemChange(e) {
    // console.log(e);
    // 获取传递过来的索引
    const { index } = e.detail;
    // 修改原数组
    let { tabs } = this.data;
    tabs.forEach((item, i) =>
      i === index ? (item.isActive = true) : (item.isActive = false)
    );
    // 赋值
    this.setData({
      tabs,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保存cid
    // console.log(options);
    this.queryParams.cid = options.cid||"";
    this.queryParams.query = options.query||"";
    this.getGoddsList();
    wx.showLoading({
      title: "加载中",
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 5000);
  },
  // 获取商品列表的数据
  async getGoddsList() {
    const res = await request({ url: "/goods/search", data: this.queryParams });
    // console.log(res);
    // 获取总条数
    const total = res.data.message.total;
    // console.log(total);
    this.totalPages = Math.ceil(total / this.queryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // es6结构拼接 。。。
      goodsList: [...this.data.goodsList, ...res.data.message.goods],
    });
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  // 滚动条触底事件
  /*
    判断到底有没有下一页
    获取数据的总页数  获取当前页码  判断当前页面>=总页数  无
    总页数 = Math.ceil() / 也容量 pagesize
  */
  onReachBottom() {
    // console.log("页面触底");
    // 判断还有没有下一页数据
    if (this.queryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: "已经到底了",
        icon: "none",
        duration: 1500,
        mask: false,
      });
    } else {
      // console.log("有下一页数据");
      this.queryParams.pagenum++;
      this.getGoddsList();
    }
  },
  // 下拉刷新页面
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.queryParams.pagenum=1
    // 重新发送请求
    this.getGoddsList()
  }
});