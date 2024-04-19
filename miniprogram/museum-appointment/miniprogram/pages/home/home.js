const db = wx.cloud.database()
const appointmentsCollection = db.collection('appointments')
const STATUS = {
  PENDING: 0,
  APPROVE: 1,
  REJECTED: 2,
}
Page({
  data: {
    notice: [
      "为营造安全、庄重、有序的良好环境，确保展品安全、观众安全、馆舍安全，特制定文明参观须知如下：",
      "●开放时间：周三、周五14:00-17:00；周六8:00-12:00，14:00-17:00其他时间预约开放。",
      "●预约后，请准时参观。如果无法按时参与，请在开始前3小时取消预约。",
      "●如果爽约两次，半年内将无法进行预约。",
      "●团队参观（≥20人）须提前三天预约。预约单位（团队）来馆时请提供参观介绍信（包括单位、人数、参观时间、联系电话），按照预约时间准时进馆参观。预约及咨询电话：0579-82287059。",
      "一、入馆",
      "1．观众入馆须自觉接受安全检查，严禁将易燃易爆、管制械具等危险品带入馆内。酗酒、衣冠不整、携带宠物者谢绝入内；",
      "2．未满14周岁（含）的青少年须在成年人陪伴下入馆；",
      "二、观展",
      "3.文明参观，展厅内严禁吸烟、饮食、喧哗、追逐打闹、攀爬躺卧、随地吐痰、乱扔废弃物等不文明行为",
      "4．禁止音响外放、长时间占用公共设施及公共空间等影响其他观众观展的行为；",
      "5．禁止翻越围挡护栏，触摸、污损、毁坏展品等行为；",
      "三、活动",
      "6．禁止乞讨、卖艺、打小旗、拉横幅，禁止散发、悬挂、粘贴广告以及其它违背公序良俗的活动或行为；",
      "7．未经批准，禁止进行讲学、表演、采访、商业性拍摄、自媒体直播、录播等非参观活动；",
      "四、安全",
      "8．禁止随意挪用、触动和损坏馆内消防设施、器材；",
      "9．如遇特殊活动或突发事件，须接受现场工作人员引导，有序疏散；",
      "五、责任",
      "10．违反本规定的，工作人员有权责令停止，直至责令离馆；",
      "11．造成人身和财产损失的，依法追究行为人相应法律责任；",
      "12．未尽事宜以本馆公示为准。"
    ],
    banner: "欢迎参观浙江师范大学非洲博物馆、中非交流博物馆",
    userPolicy : [
      "1. 用户信息：本小程序将收集并存储用户的姓名和电话号码，以便提供预约服务和联系通知。",
      "2. 使用规定：用户在使用本小程序时，需遵守相关法律法规，不得利用本小程序从事违法活动。",
      "3. 信息保护：我们承诺对用户的个人信息进行保护，不会泄露给第三方机构或个人。",
      "4. 免责条款：用户在使用本小程序时，需自行承担风险，本小程序不对因不可抗力、网络问题等原因造成的损失负责。",
      "5. 权利声明：用户拥有自己的个人信息，并有权要求查询、更正或删除自己的信息。",
      "6. 协议更新：本用户协议可能根据法律法规变化进行更新，用户需定期查看最新版本。"
    ],

    privacyPolicy : [
      "1. 信息收集：本小程序将收集用户的姓名和电话号码，用于提供预约服务和联系通知。",
      "2. 信息使用：用户提供的个人信息仅用于提供服务，不会用于其他商业用途。",
      "3. 信息保护：我们承诺对用户的个人信息进行严格保护，不会泄露给第三方机构或个人。",
      "4. 信息安全：我们将采取合理的安全措施保护用户的个人信息，防止信息泄露、损坏或丢失。",
      "5. 信息访问：用户有权要求查询、更正或删除自己的个人信息，可以通过联系方式向我们提出申请。",
      "6. 隐私政策更新：隐私政策可能根据法律法规变化进行更新，用户需定期查看最新版本。"
    ],

    showNotice: true,
    showNotice: true,
    showUserPolicy: false,
    showPrivacyPolicy: false,

    appointeeName: "", // 预约人姓名
    timeOptions: [], // 可选择的时间段
    selectedTime: [], // 已选择的时间段
    showCalendar: false,
    visitorInfo: "", // 来访人信息
    phone: "", // 联系方式
    visitorNumber: "", // 预约人数
    visitDate: "", // 参观日期
    openid: "",
    nowDate: "",
    endDate: "",
    maxDate: "",
    minDate: "",
    week: ""
  },
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'get_Openid1',
      data: {},

      success: res => {
        console.log(res)
        this.setData({
          openid: res.result.openid
        })
      },
      fail: err => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    });

    this.getNowDate();
    this.getEndDate();
    this.refreshAvailableTime()
  },
  handleUserPolicyChange(event) {
    this.setData({
      showUserPolicy: !this.data.showUserPolicy
    })
  },

  handlePrivacyPolicyChange(event) {
    this.setData({
      showPrivacyPolicy: !this.data.showPrivacyPolicy
    })
  },

  onCheckboxChange(event) {
    this.setData({
      checked: event.detail
    })
  },

  showNotice() {
    this.setData({
      showNotice: true,
    })
  },
  closeNotice() {
    this.setData({
      showNotice: false
    })
  },
  getNowDate() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let y = date.getFullYear();
    let m = (date.getMonth() + 1).toString().padStart(2, '0');
    let d = date.getDate().toString().padStart(2, '0');
    let nowDate = `${y}-${m}-${d}`;
    this.setData({
      visitDate: nowDate,
      nowDate: nowDate,
      minDate: Date.parse(nowDate)
    })
  },
  getEndDate() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let startDate = new Date(`${year}-${month}-${day}`);
    let endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let edYear = endDate.getFullYear();
    let edMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
    let edDay = endDate.getDate().toString().padStart(2, '0');
    this.setData({
      endDate: `${edYear}-${edMonth}-${edDay}`,
      maxDate: Date.parse(`${edYear}/${edMonth}/${edDay}`)
    })
  },
  refreshAvailableTime(date) {
    let times = [
      "08:00-09:50", "10:20-12:00", "14:00-15:20", "15:40-17:00",
    ]
    appointmentsCollection.where({
      date: date || this.data.visitDate
    }).get().then(res => {
      console.log(date || this.data.visitDate)
      console.log(res)
      const data = res.data || []
      const occupiedTime = new Set()
      data.forEach(item => {
        if (item.status != STATUS.REJECTED) {
          item.time.forEach(time => {
            occupiedTime.add(time);
          })
        }
      })
      const filteredTimeOptions = times.filter(time => !occupiedTime.has(time));
      this.setData({
        timeOptions: filteredTimeOptions
      })
      console.log(filteredTimeOptions)
    })
  },
  selectTime(event) {
    if (this.data.timeOptions.length == 0) {
      return;
    }
    let index = event.detail.value;
    let newArray = this.data.timeOptions;
    let newSelected = this.data.selectedTime;
    if (newSelected.length > 0) {
      wx.showToast({
        title: '最多只能选择1个时间段',
        icon: 'none'
      })
      return;
    }
    newSelected.push(newArray[index]);
    newArray.splice(index, 1);
    this.setData({
      timeOptions: newArray,
      selectedTime: newSelected
    })
  },
  cancelTime(event) {
    let time = event.currentTarget.dataset.item;
    let newSelected = this.data.selectedTime;
    let newArray = this.data.timeOptions;
    for (let i = 0; i < newSelected.length; i++) {
      if (newSelected[i] == time) {
        newSelected.splice(i, 1);
        break;
      }
    }
    newArray.push(time);
    newArray.sort();
    this.setData({
      timeOptions: newArray,
      selectedTime: newSelected
    })
  },

  onCalendarChange(event) {
    this.setData({
      showCalendar: event.type === "click"
    });
  },

  onAppointeeNameChange(event) {
    this.setData({
      appointeeName: event.detail.value
    })
  },

  onPhoneChange(event) {
    if (!(/^1[3456789]\d{9}$/.test(event.detail.value))) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      });
      return; // 如果格式错误，不进行后续操作
    }
    this.setData({
      phone: event.detail.value
    })
  },


  onVisitorInfoChange(event) {
    this.setData({
      visitorInfo: event.detail.value
    })
  },

  onVisitorNumberChange(event) {
    const value = event.detail.value;
    this.setData({
      visitorNumber: value
    });

    if (value > 20) {
      wx.showToast({
        title: '人数不得多于20,如果需要预约超过20人的参观，须提前三天预约。预约单位（团队）来馆时请提供参观介绍信（包括单位、人数、参观时间、联系电话），按照预约时间准时进馆参观。预约及咨询电话：0579-82287059。',
        icon: 'none',
        duration: 4000
      });
      this.setData({
        visitorNumber: ""
      });
    }
    if (isNaN(value)) {
      wx.showToast({
        title: '请输入数字',
        icon: 'none',
        duration: 1000
      });
      this.setData({
        visitorNumber: ""
      });
    }
  },


  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
  },

  onVisitDateChange(event) {
    this.setData({
      showCalendar: false,
      visitDate: this.formatDate(event.detail),
      selectedTime: [],
    });
    this.refreshAvailableTime(this.formatDate(event.detail))
  },

  async onSubmit(event) {
    if (this.data.appointeeName == "") {
      wx.showToast({
        title: '预约人不可为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    if (this.data.phone == "") {
      wx.showToast({
        title: '请检查联系方式',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    if (this.data.visitorInfo == "") {
      wx.showToast({
        title: '来访人不可为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (this.data.visitorNumber == "") {
      wx.showToast({
        title: '预约人数为空或者大于20',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (this.data.selectedTime.length == 0) {
      wx.showToast({
        title: '预约时间不可为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (!this.data.checked) {
      this.showToast('请勾选同意《用户协议》《隐私政策》')
      return;
    }
    try {
      // let allowSendMessage = false;
      const res = await this.requestSubscribeMessage();
      console.log(`res: ${res}`)
      // allowSendMessage = res === 'accept';

      // 添加预约
      await this.addAppointment();

      this.showToast('预约待审核！');
    } catch (error) {
      console.error("预约失败", error);
      this.showToast('预约失败！');
    }
    setTimeout(() => wx.redirectTo({
      url: '/pages/home/home'
    }), 1000)

  },
  requestSubscribeMessage() {
    return new Promise((resolve, reject) => {
      wx.requestSubscribeMessage({
        tmplIds: ['_2JGVi5k6O3V_F2GSl8_w4zYJ2KA3aGXfumVlhv1rCg'],
        success: res => {
          if (res['_2JGVi5k6O3V_F2GSl8_w4zYJ2KA3aGXfumVlhv1rCg'] === 'accept') {
            console.log('允许');
            resolve('accept');
          } else {
            console.log('拒绝或未决定');
            resolve('reject');
          }
        },
        fail: err => {
          console.log(err);
          reject(err);
        }
      });
    });
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1000
    });
  },
  addAppointment() {
    return appointmentsCollection.add({
      data: {
        appointee_name: this.data.appointeeName,
        phone: this.data.phone,
        visitor_info: this.data.visitorInfo,
        visitor_number: this.data.visitorNumber,
        time: this.data.selectedTime,
        date: this.data.visitDate.toString(),
        create_time: new Date(),
        status: 0,
        comment: "",
      }
    });
  },
  toRecord() {
    wx.redirectTo({
      url: '/pages/record/record'
    })
  }
})