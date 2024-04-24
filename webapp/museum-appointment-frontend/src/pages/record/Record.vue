<template>
  <div class="wrapper">
    <van-cell-group class="search">
      <van-field
        v-model="param"
        center
        label="姓名或手机号"
        placeholder="请输入姓名或联系电话搜索"
        border
        use-button-slot
        autosize
        class="search_input"
      />
      <van-button type="primary" @click="onSearch" class="search_button">
        搜索
      </van-button>
    </van-cell-group>
    <van-list v-if="records.length">
      <AppointmentInfoCard
        v-for="record in records"
        :key="record.id"
        :record="record"
      />
    </van-list>
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<script>
import myAxios from "../../plugins/myAxios";
import AppointmentInfoCard from "../../components/AppointmentInfoCard/index.vue";

export default {
  components: {
    AppointmentInfoCard,
  },
  data() {
    return {
      param: null,
      records: [],
    };
  },
  methods: {
    async onSearch() {
      const { data } = await myAxios.get("/appointment/get/records", {
        params: {
          param: this.param,
        },
      });
      // [
      //   {
      //     "id": "1",
      //     "userId": null,
      //     "appointeeName": "ccc",
      //     "visitorNumber": "1",
      //     "visitorInfo": "test",
      //     "phone": "13111112222",
      //     "date": "2024-04-24",
      //     "time": "08:00-09:50",
      //     "status": 2,
      //     "comment": "xxxxx拒绝理由xxxx",
      //     "createTime": "2024-04-24 01:57:40",
      //     "updateTime": "2024-04-24 10:44:16",
      //     "isDelete": 0
      //   }
      // ]
      this.records = data.sort((a, b) =>
        b.createTime.localeCompare(a.createTime)
      );
    },
  },
};
</script>

<style scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.search_input {
  width: 90%;
}
.search_button {
  width: 10% !important;
}
</style>
