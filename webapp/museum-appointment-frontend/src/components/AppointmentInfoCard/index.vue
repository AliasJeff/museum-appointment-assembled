<template>
  <div class="info box" :class="className">
    <div v-if="!!className" class="shadow">
      <div class="data">
        <van-icon name="notes-o" :size="icon_size" :color="icon_color" />
        <span>参观日期：</span>{{ displayRecord.date }}
      </div>
      <div class="data">
        <van-icon name="underway-o" :size="icon_size" :color="icon_color" />
        <span>参观时间：</span>{{ displayRecord.time }}
      </div>
      <div class="data">
        <van-icon name="contact" :size="icon_size" :color="icon_color" />
        <span>预约人：</span>{{ displayRecord.appointeeName }}
      </div>
      <div class="data">
        <van-icon name="hotel-o" :size="icon_size" :color="icon_color" />
        <span>联系方式：</span>{{ displayRecord.phone }}
      </div>
      <div class="data">
        <van-icon name="phone-circle-o" :size="icon_size" :color="icon_color" />
        <span>来访人信息：</span>{{ displayRecord.visitorInfo }}
      </div>
      <div class="data">
        <van-icon name="friends-o" :size="icon_size" :color="icon_color" />
        <span>预约人数：</span>{{ displayRecord.visitorNumber }}
      </div>
      <div class="data">
        <van-icon name="edit" :size="icon_size" :color="icon_color" />
        <span>反馈：</span>{{ displayRecord.comment }}
      </div>
      <van-divider
        custom-style="color: #1989fa; border-color: #1989fa;"
        dashed
      />
      <div class="status">
        <div><span>预约时间：</span>{{ displayRecord.createTime }}</div>
        <div>
          <span>审核状态：</span>
          <span
            v-if="displayRecord.status === 1"
            style="padding: 0; margin: 0; color: green"
          >
            已通过
          </span>
          <span
            v-else-if="displayRecord.status === 0"
            style="padding: 0; margin: 0; color: orange"
            >待审核</span
          >
          <span v-else style="padding: 0; margin: 0; color: red">已拒绝</span>
        </div>
      </div>
      <div v-if="edit" class="btn_wrapper">
        <button class="auditBtn" @click="handleReview(2, record)">拒绝</button>
        <button class="auditBtn" @click="handleReview(1, record)">确认</button>
      </div>
    </div>
    <div v-else style="padding: 30px 40px">
      <div class="data">
        <van-icon name="notes-o" :size="icon_size" :color="icon_color" />
        <span>参观日期：</span>{{ displayRecord.date }}
      </div>
      <div class="data">
        <van-icon name="underway-o" :size="icon_size" :color="icon_color" />
        <span>参观时间：</span>{{ displayRecord.time }}
      </div>
      <div class="data">
        <van-icon name="contact" :size="icon_size" :color="icon_color" />
        <span>预约人：</span>{{ displayRecord.appointeeName }}
      </div>
      <div class="data">
        <van-icon name="hotel-o" :size="icon_size" :color="icon_color" />
        <span>联系方式：</span>{{ displayRecord.phone }}
      </div>
      <div class="data">
        <van-icon name="phone-circle-o" :size="icon_size" :color="icon_color" />
        <span>来访人信息：</span>{{ displayRecord.visitorInfo }}
      </div>
      <div class="data">
        <van-icon name="friends-o" :size="icon_size" :color="icon_color" />
        <span>预约人数：</span>{{ displayRecord.visitorNumber }}
      </div>
      <div class="data">
        <van-icon name="edit" :size="icon_size" :color="icon_color" />
        <span>反馈：</span>{{ displayRecord.comment }}
      </div>
      <van-divider
        custom-style="color: #1989fa; border-color: #1989fa;"
        dashed
      />
      <div class="status">
        <div><span>预约时间：</span>{{ displayRecord.createTime }}</div>
        <div>
          <span>审核状态：</span>
          <span
            v-if="displayRecord.status === 1"
            style="padding: 0; margin: 0; color: green"
          >
            已通过
          </span>
          <span
            v-else-if="displayRecord.status === 0"
            style="padding: 0; margin: 0; color: orange"
            >待审核</span
          >
          <span v-else style="padding: 0; margin: 0; color: red">已拒绝</span>
        </div>
      </div>
      <div v-if="edit" class="btn_wrapper">
        <button class="auditBtn" @click="handleReview(2, displayRecord)">
          拒绝
        </button>
        <button class="auditBtn" @click="handleReview(1, displayRecord)">
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    record: Object,
    icon_size: String,
    icon_color: String,
    edit: Boolean,
    handleReview: Function,
    className: String,
  },
  data: () => ({
    is_show: false,
    reason: "",
    refuse_record: {},
  }),
  computed: {
    displayRecord() {
      return this.record ? { ...this.record } : null;
    },
  },
  watch: {
    record: {
      deep: true,
      handler(newVal, oldVal, xxx) {
        console.log("Record has changed", newVal);
        console.log(oldVal);
        console.log(xxx);
        console.log("====================");
        // 可以在这里执行任何需要的操作，例如重新初始化数据或更新内部状态
      },
    },
  },
  created() {
    console.log(this.record);
  },
};
</script>

<style scoped>
.status {
  font-size: 18px;
}

.btn_wrapper {
  display: flex;
  justify-content: space-between;
}

.auditBtn {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

page {
  background-color: white;
}

.box {
  width: 100%;
  margin: 40px 0;
  padding: 0;
}

.tab_class {
  font-size: 28px !important;
}

.info {
  height: fit-content;
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 30px;
  background-color: #e9f8ff;
  border: 1px solid #e9f8ff;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.info view {
  margin-bottom: 10px;
}

.info .auditBtn {
  border: 1px solid #1989fa;
  background-color: #1989fa;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.info view > text {
  margin-left: 10px;
}

.info .status {
  text-align: right;
  margin-bottom: 10px;
}

.info .btn_wrapper {
  display: flex;
  column-gap: 20px;
}

.info .btn_wrapper .auditBtn {
  width: 100%;
}

.info .data {
  display: flex;
  gap: 5px;
  font-size: 18px;
}

.recordCard {
  background: url("../../assets/record_img.jpeg");
  background-size: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  color: white;
}

.shadow {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding: 30px 40px;
}
</style>
