// pages/record/record.js
const db = wx.cloud.database();
const appointmentsCollection = db.collection('appointments');

Page({
  data: {
    dataList: [],
    openId: '',
    timeList: []
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'get_Openid1',
      data: {},
      success: res => {
        const openId = res.result.openid
        this.setData({
          openId: openId
        })
        console.log(openId)
        this.fetchAppointments(openId);
      },
      fail: err => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    });
  },

  fetchAppointments: function (openid) {
    appointmentsCollection.where({
      _openid: openid
    }).orderBy('create_time', 'desc').get().then(res => {
      const data = res.data;
      this.setData({
        dataList: data
      });
      if (data.length === 0) {
        wx.showToast({
          title: '无预约记录！',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error(err);
    });
  },

  cancelAppointment: function (recordId, cancelDate, cancelTime) {
    appointmentsCollection.where({
      _id: recordId,
    }).remove().then(res => {
      wx.showToast({
        title: '预约取消成功！',
        icon: 'none',
        duration: 1000
      });
      wx.redirectTo({
        url: '/pages/record/record?id=' + this.data.openId,
      })
    }).catch(err => {
      console.error('数据删除失败', err);
      wx.showToast({
        title: '预约取消失败！',
        icon: 'none',
        duration: 1000
      });
    });
  },

  cancel: function (e) {
    const record = e.target.dataset.record
    const id = record._id
    const date = record.date
    const time = record.time
    this.cancelAppointment(id, date, time)
  },

  onPullDownRefresh: function () {
    this.fetchAppointments(this.data.openId);
    wx.showToast({
      title: '刷新成功'
    });
    wx.stopPullDownRefresh();
  },

  onClickLeft: function () {
    wx.redirectTo({
      url: '/pages/home/home'
    });
  },
});