// pages/category/index.js
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    scrollTop:0
  },
  // 节后的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      1.先判断本地储存中有没有就得数据 如果没有就发送新的请求
      {time：Data.now(),data:[...]}
      2.有就得数据，同时就得数据没有过期，就是用就得数据
    */
    // 1.获取本地储存中的数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      // 不存在
      this.getCategoryList();
    } else {
      // 有就得数据  定义一个过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCategoryList();
      } else {
        // 可以使用就得本地储存的数据
        console.log("就得数据");
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map((item) => item.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },
  async getCategoryList() {
    // request({
    //   url: "/categories",
    // }).then((result) => {
    //   // console.log(result);
    //   this.Cates = result.data.message;
    //   // 把接口的数据出入到本地储存中
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map((item) => item.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent,
    //   });
    // });
    const res = await request({ url: "/categories" });
      this.Cates = res.data.message;
      // 把接口的数据出入到本地储存中
      wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

      // 构造左侧的大菜单数据
      let leftMenuList = this.Cates.map((item) => item.cat_name);
      // 构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent,
      });
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    // 获取被点击的标题索引
    // 给data中的currentIndex赋值
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置scrollTop 的值
      scrollTop:0
    });
  },
});