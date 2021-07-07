//Page Object
// 引入用来发动请求的方法  一定要把路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 单行数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  // 页面开始加载，就会触发
  onLoad() {
    // 1.发送异步请求，获取轮播图数据
    // var reqTask = wx.request({
    //   url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    //   data: {},
    //   header: { "content-type": "application/json" },
    //   method: "GET",
    //   dataType: "json",
    //   responseType: "text",
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // });
    // 使用封装好的request调用数据请求
    this.getSwiperList();
    // 导航数据
    this.getCatesList();
    this.getFloorList()
  },
  // 获取轮播图数据的方法
  getSwiperList() {
    request({
      url: "/home/swiperdata",
    }).then((result) => {
      console.log(result);
      this.setData({
        swiperList: result.data.message.map((v) => ({
          ...v,
          navigator_new_url: v.navigator_url.replace(/main/, 'index')
        })),
      });
    });
  },
  getCatesList() {
    request({
      url: "/home/catitems",
    }).then((result) => {
      // console.log(result);
      this.setData({
        catesList: result.data.message,
      });
    });
  },
  getFloorList() {
    request({
      url: "/home/floordata",
    }).then((result) => {
      let floorList = result.data.message;
      console.log(floorList);
      for (let i = 0; i < floorList.length; i++) {
        floorList[i].product_list.forEach((v,j) => {
           floorList[i].product_list[j].navigator_url = v.navigator_url.replace(
             "?",
             "/index?"
           );
        })
      }
      this.setData({
        floorList
      });
    });
  }
});
