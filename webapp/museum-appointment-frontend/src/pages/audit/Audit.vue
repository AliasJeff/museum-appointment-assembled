<template>
  <van-pull-refresh v-model="isLoading" @refresh="getData">
    <div v-if="!isSuper">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入管理员密码"
            :rules="[{ required: true, message: '请填写管理员密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
    <van-tabs
      v-else
      v-model="active"
      @change="onChange"
      :color="icon_color"
      animated
      tab-class="tab_class"
      sticky
    >
      <van-tab title="未审核">
        <div v-for="record in unreviewed_dataList" :key="record.id">
          <AppointmentInfoCard
            :record="record"
            :icon_size="icon_size"
            :icon_color="icon_color"
            :edit="true"
            :handle-review="handleReview"
          />
        </div>
      </van-tab>
      <van-tab title="已审核">
        <van-cell-group class="search">
          <van-field
            v-model="customer_name"
            center
            label="来访人姓名"
            placeholder="请输入"
            border
            use-button-slot
            class="search_input"
          />
          <van-button type="primary" @click="onSearch" class="search_button">
            搜索
          </van-button>
        </van-cell-group>
        <div v-for="record in reviewed_dataList" :key="record.id">
          <AppointmentInfoCard
            :record="record"
            :icon_size="icon_size"
            :icon_color="icon_color"
            :edit="false"
            :handle-review="handleReview"
          />
        </div>
      </van-tab>
    </van-tabs>
    <van-dialog
      v-model:show="showDialog"
      use-slot
      show-cancel-button
      @confirm="refuse"
    >
      <van-field v-model="reason" placeholder="请输入拒绝理由" border />
    </van-dialog>
  </van-pull-refresh>
</template>

<script>
import myAxios from "../../plugins/myAxios";
import { Toast } from "vant";
import AppointmentInfoCard from "../../components/AppointmentInfoCard/index.vue";
import { encrypt, decrypt } from "../../libs/encrypt";

export default {
  components: {
    AppointmentInfoCard,
  },
  data() {
    return {
      isLoading: false,
      isSuper: false,
      password: null,
      showDialog: false,
      refuse_record: [],
      active: 0,
      icon_color: "#333",
      icon_size: "20px",
      tab_class: "tab_class",
      all_records: [],
      unreviewed_dataList: [],
      reviewed_dataList: [],
      customer_name: "",
      reason: "",
    };
  },
  created() {
    this.getData();
    this.checkAuth();
  },
  methods: {
    async checkAuth() {
      const storedData = localStorage.getItem("authToken");
      const expiration = localStorage.getItem("expiration");
      const currentTime = new Date().getTime();

      // 检查token是否存在且未过期
      if (storedData && expiration && currentTime < parseInt(expiration)) {
        const { iv, encrypted } = JSON.parse(storedData);
        const decryptedToken = await decrypt(
          new Uint8Array(iv),
          new Uint8Array(encrypted)
        );

        if (decryptedToken === "authenticated") {
          this.isSuper = true;
        }
      }
    },
    async onSubmit() {
      const res = await myAxios.post(
        `/appointment/auth?password=${this.password}`
      );
      if (res?.code === 0) {
        this.isSuper = true;
        Toast.success("认证成功");

        // 加密并存储token
        const { iv, encrypted } = await encrypt("authenticated");
        localStorage.setItem(
          "authToken",
          JSON.stringify({
            iv: Array.from(iv),
            encrypted: Array.from(new Uint8Array(encrypted)),
          })
        );
        localStorage.setItem("expiration", new Date().getTime() + 86400000); // 设置1天后过期
      } else {
        Toast.fail("认证失败");
      }
    },

    async getData() {
      try {
        const response = await myAxios.get("/appointment/get");
        this.all_records = response.data;
        this.unreviewed_dataList = response.data.filter(
          (data) => data.status === 0
        );
        this.reviewed_dataList = response.data
          .sort((a, b) => b.createTime.localeCompare(a.createTime))
          .filter((data) => data.status !== 0);
      } catch (error) {
        Toast.fail(`获取数据失败: ${error}`);
      } finally {
        this.isLoading = false;
      }
    },
    onChange(index) {
      this.active = index;
    },
    onSearch() {
      const self = this;
      const filteredList = self.all_records.filter((data) => data.status !== 0);
      if (self.customer_name) {
        self.reviewed_dataList = filteredList
          .sort((a, b) => b.createTime.localeCompare(a.createTime))
          .filter(function (item) {
            return item.appointeeName.includes(self.customer_name);
          });
      } else {
        self.reviewed_dataList = filteredList.sort((a, b) =>
          b.createTime.localeCompare(a.createTime)
        );
      }
      console.log(self.reviewed_dataList);
    },
    async handleReview(status, record) {
      if (status === 2) {
        this.showDialog = true;
        this.refuse_record = record;
      } else {
        try {
          const response = await myAxios.post("/appointment/update", {
            id: record.id,
            status: status,
          });
          if (response?.code === 0) {
            Toast.success("操作成功");
          }
          await this.getData();
        } catch (error) {
          Toast.fail(`操作失败: ${error}`);
        }
      }
    },
    async refuse() {
      try {
        const response = await myAxios.post("/appointment/update", {
          id: this.refuse_record.id,
          status: 2,
          comment: this.reason,
        });
        if (response?.code === 0) {
          Toast.success("操作成功");
        }
        await this.getData();
      } catch (error) {
        Toast.fail(`操作失败: ${error}`);
      }
    },
  },
};
</script>

<style scoped>
.search {
  display: flex;
}
.search_input {
  width: 100%;
}
.search_button {
  width: 10% !important;
}
page {
  background-color: white;
}
</style>
