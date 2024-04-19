import Dialog from '@vant/weapp/dialog/dialog';
const db = wx.cloud.database();
const appointmentsCollection = db.collection('appointments');

const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
}

Page({
  data: {
    reviewed_dataList: [],
    unreviewed_dataList: [],
    icon_size: "40rpx",
    icon_color: "#1989fa",
    active: 0,
    search_condition: "",
    reason: ""
  },

  onLoad(options) {
    this.loadData();
  },

  loadData() {
    return appointmentsCollection.orderBy('create_time', 'desc')
      .get()
      .then(res => {
        this.setData({
          unreviewed_dataList: res.data
            .filter(
              item => item.status === STATUS.PENDING
            )
            .map(
              item => ({
                ...item,
                create_time: new Date(item.create_time).toLocaleString()
              })
            ),
          reviewed_dataList: res.data
            .filter(item => item.status === STATUS.APPROVED || item.status === STATUS.REJECTED)
            .map(
              item => ({
                ...item,
                create_time: new Date(item.create_time).toLocaleString()
              })
            ),
        })
      }).catch(err => {
        wx.showToast({
          title: '获取数据失败',
          icon: "none",
          duration: 1000,
        })
        console.log('获取数据失败', err)
      });
  },

  checkForDuplicates(array1, array2) {
    const mergedArray = [...array1, ...array2];
    const uniqueItems = new Set(mergedArray);
    if (mergedArray.length !== uniqueItems.size) {
      return true
    }
    return false
  },

  handleReview(event) {
    let recordId = event.target.dataset.record._id;
    let status = event.target.dataset.status;
    let time = event.target.dataset.record.time;
    const checkDuplicatePromise = new Promise((resolve, reject) => {
      if (status === 1) {
        appointmentsCollection
          .where({
            date: event.target.dataset.record.date,
            status: STATUS.APPROVED
          })
          .get()
          .then(res => {
            let appointmentTimes = res.data.flatMap(item => item.time);
            if (this.checkForDuplicates(appointmentTimes, time)) {
              wx.showToast({
                title: '确认失败，预约时间冲突',
                icon: "none",
                duration: 1000
              });
              reject();
            } else {
              resolve();
            }
          })
          .catch(err => {
            console.error("Error getting appointments:", err);
            reject();
          });
      } else {
        //  resolve();
        Dialog.alert({
          title: '拒绝原因',
        }).then(() => {
          resolve();
        });
      }
    });
    checkDuplicatePromise.then(() => {
      appointmentsCollection
        .where({
          _id: recordId
        })
        .update({
          data: {
            status: status,
            comment: this.data.reason ? this.data.reason : "无"
          }
        })
        .then(res => {
          wx.showToast({
            title: status === STATUS.APPROVED ? '已确认' : '已拒绝',
            icon: "none",
            duration: 1000
          });
          event.target.dataset.record.comment = this.data.reason ? this.data.reason : "无";
          this.sendSubscribeMessage(event.target.dataset);
          wx.redirectTo({
            url: '/pages/index/index'
          });
        })
        .catch(err => {
          console.error("审核失败", err);
          wx.showToast({
            title: '审核失败',
            icon: "none",
            duration: 1000
          });
        });
    }).catch(() => {
      return;
    });
  },

  onQueryChange(event) {
    this.setData({
      search_condition: event.detail.value
    })
  },
  onReasonChange(event) {
    this.setData({
      reason: event.detail.value
    })
  },
  onSearch() {
    appointmentsCollection.where({
      appointee_name: db.RegExp({
        regexp: '.*' + this.data.search_condition + '.*',
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        reviewed_dataList: res.data.map(
          item => ({
            ...item,
            create_time: new Date(item.create_time).toLocaleString()
          })
        ),
      })
    })
  },
  sendSubscribeMessage(data) {
    // 参数
    // {
    //   "data": {
    //     "appointee_name": "czx",
    //     "appoint_time": "2024-03-30", // 必须是时间格式
    //     "phone": 13112311344,
    //     "status": "审核中",
    //     "comment": "无" // 不能为空
    //   }
    // }
    console.log('start sending subscribe message...')
    // console.log([data.visitDate.toString(), ...data.selectedTime].join(', '))
    console.log(data.record.comment)
    return wx.cloud.callFunction({
      name: 'subscribe_message',
      data: {
        data: {
          touser: data.record._openid,
          appointee_name: data.record.appointee_name,
          appoint_time: data.record.date.toString(),
          phone: data.record.phone,
          status: data.status == 1 ? "预约成功" : "预约失败",
          comment: data.record.comment,
        }
      },
      success: res => {
        console.log('服务通知成功')
        console.log(res)
      },
      fail: err => {
        console.log('服务通知失败')
        console.log(err)
      }
    });
  },
  onPullDownRefresh: function () {
    Promise.all([this.loadData(true), this.loadData(false)]).then(() => {
      wx.showToast({
        title: '刷新成功'
      });
      wx.stopPullDownRefresh();
    });
  },
});