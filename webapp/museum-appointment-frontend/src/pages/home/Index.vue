<template>
  <div>
    <van-notice-bar left-icon="volume-o" :text="banner" class="notice" scrollable/>

    <scroll-view scroll-y="true" class="scroll-view">
      <van-cell-group inset class="van-group_margin">
        <div class="image">
          <div class="shadow">
          <view class="time center-text" v-for="item in museumTitles" :key="item">
            <p>{{ item }}</p>
          </view>

          </div>
        </div>
      </van-cell-group>

      <van-cell-group inset class="van-group_margin">
        <van-cell title="预约人" border="false" size="large" required class="cellroot" title-class="font-weight"
                  label-class="label-weight">
          <van-field v-model="appointeeName" placeholder="单位和姓名" border="false" size="large" @blur="validateInput"/>
        </van-cell>
        <van-cell title="联系方式" border="false" size="large" required class="cellroot" title-class="font-weight"
                  label-class="label-weight">
          <van-field v-model="phone" placeholder="联系方式" border="true" size="large" type="number" @blur="validatePhone"/>
        </van-cell>

        <van-cell title="来访人" border="false" size="large" required class="cellroot" title-class="font-weight"
                  label-class="label-weight">
          <van-field v-model="visitorInfo" placeholder="来访人信息" border="true" size="large" @blur="validateInput"/>
        </van-cell>

        <van-cell title="预约人数" size="large" border="false" title-class="font-weight" label-class="label-weight"
                  required>
          <van-field v-model.number="visitorNumber" type="number" placeholder="不得多于20" @blur="validateVisitorNumber"/>
        </van-cell>

        <van-cell title="参观日期" :value="visitDate" @click="showCalendar = true" size="large" title-class="font-weight"
                  required border="false"/>
        <van-calendar v-model="showCalendar" @close="showCalendar = false" @confirm="onVisitDateChange" color="#b88b50"
                      :min-date="minDate" :max-date="maxDate" class="calendar" row-height="60"/>

        <van-cell title="参观时间" size="large" border="false" title-class="font-weight" label-class="label-weight"
                  required>
          <view class="showtime">
            <van-cell v-for="time in selectedTime" :key="time" class="show-box" value-class="show-value"
                      border="false">
              <text>{{ time }}</text>
              <van-button size="mini" @click="cancelTime(time)" class="btn_size">×</van-button>
            </van-cell>
          </view>
          <van-date-picker id="time" :range="timeOptions" class="align_center" @change="selectTime">+</van-date-picker>
        </van-cell>

        <van-cell required size="small" value-class="checkbox-wrapper">
          <div class="title-wrapper">
            <div>我已阅读并同意</div>
            <div>
              <a @click="togglePolicy('user')" class="text-btn">《用户协议》</a>、
              <a @click="togglePolicy('privacy')" class="text-btn">《隐私政策》</a>
            </div>
          </div>
          <van-checkbox v-model="checked" shape="square" @change="onCheckboxChange"/>
        </van-cell>
      </van-cell-group>
    </scroll-view>

    <div id="bottom">
      <button class="btn align_center" @click="showNotice = true">预约须知
        <icon type="info" color="#b3a78f" size="30rpx" style="margin-left: 10px;"/>
      </button>
      <button class="btn align_center" @click="onSubmit">立即预约</button>
      <button class="btn align_center" @click="toRecord">预约记录</button>
    </div>

    <van-dialog v-if="showNotice" @close="showNotice = false" :content="notice" title="非洲博物馆参观须知"/>
    <van-dialog v-if="showUserPolicy" @close="togglePolicy('user')" :content="userPolicy" title="用户协议"/>
    <van-dialog v-if="showPrivacyPolicy" @close="togglePolicy('privacy')" :content="privacyPolicy" title="隐私政策"/>
  </div>
</template>

<script>
import {ref} from 'vue';
import myAxios from "../../plugins/myAxios";
import './index.css'
import {useRouter} from "vue-router";

export default {
  setup() {
    const banner = "欢迎参观浙江师范大学非洲博物馆、中非交流博物馆";
    const museumTitles = [
      "欢迎光临",
      "全国高校党建工作标杆院系创建培育单位",
      "浙江省“一带一路与浙非合作”党员教育培训基地",
      "浙江省习近平对非外交思想现场教学点",
      "浙江省科普基地",
      "非洲研究院政治学、非洲学研究生党支部红色教育基地",
      "浙江师范大学非洲博物馆、中非交流博物馆"
    ];
    const showCalendar = ref(false);
    const showNotice = ref(false);
    const showUserPolicy = ref(false);
    const showPrivacyPolicy = ref(false);
    const checked = ref(false);
    const appointeeName = ref('');
    const phone = ref('');
    const visitorInfo = ref('');
    const visitorNumber = ref(0);
    const visitDate = ref('');
    const minDate = new Date();
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    const notice = [
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
    ];
    const userPolicy = [
      "1. 用户信息：本小程序将收集并存储用户的姓名和电话号码，以便提供预约服务和联系通知。",
      "2. 使用规定：用户在使用本小程序时，需遵守相关法律法规，不得利用本小程序从事违法活动。",
      "3. 信息保护：我们承诺对用户的个人信息进行保护，不会泄露给第三方机构或个人。",
      "4. 免责条款：用户在使用本小程序时，需自行承担风险，本小程序不对因不可抗力、网络问题等原因造成的损失负责。",
      "5. 权利声明：用户拥有自己的个人信息，并有权要求查询、更正或删除自己的信息。",
      "6. 协议更新：本用户协议可能根据法律法规变化进行更新，用户需定期查看最新版本。"
    ];
    const privacyPolicy = [
      "1. 信息收集：本小程序将收集用户的姓名和电话号码，用于提供预约服务和联系通知。",
      "2. 信息使用：用户提供的个人信息仅用于提供服务，不会用于其他商业用途。",
      "3. 信息保护：我们承诺对用户的个人信息进行严格保护，不会泄露给第三方机构或个人。",
      "4. 信息安全：我们将采取合理的安全措施保护用户的个人信息，防止信息泄露、损坏或丢失。",
      "5. 信息访问：用户有权要求查询、更正或删除自己的个人信息，可以通过联系方式向我们提出申请。",
      "6. 隐私政策更新：隐私政策可能根据法律法规变化进行更新，用户需定期查看最新版本。"
    ];

    const router = useRouter();

    function togglePolicy(type) {
      if (type === 'user') {
        showUserPolicy.value = !showUserPolicy.value;
      } else if (type === 'privacy') {
        showPrivacyPolicy.value = !showPrivacyPolicy.value;
      }
    }

    function validateInput() {
      // 输入验证逻辑...
    }

    function validatePhone() {
      // 手机号验证逻辑...
    }

    function validateVisitorNumber() {
      // 访客人数验证逻辑...
    }

    function onVisitDateChange(date) {
      visitDate.value = date;
    }

    function onCheckboxChange() {
      // 处理勾选逻辑...
    }

    async function onSubmit() {
      // 提交表单逻辑...
      if (!appointeeName.value || !phone.value || !visitorInfo.value || visitorNumber.value === 0 || !visitDate.value) {
        alert('请填写所有必填字段');
        return;
      }
      if (!checked.value) {
        alert('请同意用户协议和隐私政策');
        return;
      }
      await myAxios.post('/api/appointment/add', {
        appointeeName: appointeeName.value,
        phone: phone.value,
        visitorInfo: visitorInfo.value,
        visitorNumber: visitorNumber.value,
        visitDate: visitDate.value
      })
      alert('预约已提交');
    }

    function toRecord() {
      router.push({
        path: "/record"
      })
    }

    return {
      banner,
      museumTitles,
      showCalendar,
      showNotice,
      showUserPolicy,
      showPrivacyPolicy,
      checked,
      appointeeName,
      phone,
      visitorInfo,
      visitorNumber,
      visitDate,
      minDate,
      maxDate,
      notice,
      userPolicy,
      privacyPolicy,
      togglePolicy,
      validateInput,
      validatePhone,
      validateVisitorNumber,
      onVisitDateChange,
      onCheckboxChange,
      onSubmit,
      toRecord
    };
  }
}
</script>

<style scoped>

.center-text {
  text-align: center;
  margin: auto;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>