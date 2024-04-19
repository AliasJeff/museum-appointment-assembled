//封装方法
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
// 发送订阅消息模板 - 交易
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wxContext = cloud.getWXContext()
      const data = event.data || {}
      console.log(event)
      await cloud.openapi.subscribeMessage.send({
        touser: data.touser, //用户的_openid
        templateId: '_2JGVi5k6O3V_F2GSl8_w4zYJ2KA3aGXfumVlhv1rCg', // 模板id
        page: '/pages/home/home', // 查看小程序需要跳转的页面路径
        data: {
          name1: { value: data.appointee_name }, // 预约人
          date3: { value: data.appoint_time }, // 预约时间, 必须是时间格式
          phone_number4: { value: data.phone }, // 联系电话
          thing7: { value: data.comment }, // 备注, 不能为空 
          phrase9: { value: data.status } //预约结果
        },
        // miniprogramState: 'developer' //跳转小程序类型：developer 为开发版；trial为体验版；formal为正式版；默认为正式版
      })
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
};