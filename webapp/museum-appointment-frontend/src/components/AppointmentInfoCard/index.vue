<template>
  <div class="info box">
    <div class="data">
      <van-icon name="notes-o" :size="icon_size" :color="icon_color" />
      <span>参观日期：</span>{{ record.date }}
    </div>
    <div class="data">
      <van-icon name="underway-o" :size="icon_size" :color="icon_color" />
      <span>参观时间：</span>{{ record.time }}
    </div>
    <div class="data">
      <van-icon name="contact" :size="icon_size" :color="icon_color" />
      <span>预约人：</span>{{ record.appointeeName }}
    </div>
    <div class="data">
      <van-icon name="hotel-o" :size="icon_size" :color="icon_color" />
      <span>联系方式：</span>{{ record.phone }}
    </div>
    <div class="data">
      <van-icon name="phone-circle-o" :size="icon_size" :color="icon_color" />
      <span>来访人信息：</span>{{ record.visitorInfo }}
    </div>
    <div class="data">
      <van-icon name="friends-o" :size="icon_size" :color="icon_color" />
      <span>预约人数：</span>{{ record.visitorNumber }}
    </div>
    <div class="data">
      <van-icon name="edit" :size="icon_size" :color="icon_color" />
      <span>备注：</span>{{ record.comment }}
    </div>
    <van-divider custom-style="color: #1989fa; border-color: #1989fa;" dashed />
    <div class="status">
      <div><span>预约时间：</span>{{ record.createTime }}</div>
      <div>
        <span>审核状态：</span>
        <span
          v-if="record.status === 1"
          style="padding: 0; margin: 0; color: green"
        >
          已通过
        </span>
        <span
          v-else-if="record.status === 0"
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
</template>

<script>
export default {
  props: {
    record: Object,
    icon_size: String,
    icon_color: String,
    edit: Boolean,
    handleReview: Function,
  },
  data: () => ({
    is_show: false,
    reason: "",
    refuse_record: {},
  }),
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

::v-deep .van-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  height: auto;
}

.search {
  display: flex;
}

.search_input {
  width: 85%;
}

.search_button {
  width: 20%;
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
  padding: 30px 40px;
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

.text_style {
  padding: 0;
  margin: 0;
  color: black;
}
</style>
