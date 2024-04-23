<template>
  <van-tabs v-model="active" @change="onChange" :color="icon_color" animated tab-class="tab_class" sticky>
    <van-tab title="未审核">
      <div class="box">
        <div v-for="(record, index) in unreviewed_dataList" :key="index" class="info">
          <div>
            <van-icon name="notes-o" :size="icon_size" :color="icon_color"/>
            <span>参观日期：</span>{{ record.date }}
          </div>
          <div>
            <van-icon name="underway-o" :size="icon_size" :color="icon_color"/>
            <span>参观时间：</span>{{ record.time }}
          </div>
          <div>
            <van-icon name="contact" :size="icon_size" :color="icon_color"/>
            <span>预约人：</span>{{ record.appointeeName }}
          </div>
          <div>
            <van-icon name="hotel-o" :size="icon_size" :color="icon_color"/>
            <span>联系方式：</span>{{ record.phone }}
          </div>
          <div>
            <van-icon name="phone-circle-o" :size="icon_size" :color="icon_color"/>
            <span>来访人信息：</span>{{ record.visitorInfo }}
          </div>
          <div>
            <van-icon name="friends-o" :size="icon_size" :color="icon_color"/>
            <span>预约人数：</span>{{ record.visitorNumber }}
          </div>
          <van-divider custom-style="color: #1989fa; border-color: #1989fa;" dashed/>
          <div class="status">
            <div><span>预约时间：</span>{{ record.createTime }}</div>
            <div><span>审核状态：</span><span style="padding: 0; margin: 0; color: red;">待审核</span></div>
          </div>
          <div class="btn_wrapper">
            <button class="btn" @click="handleReview(2, record)">拒绝</button>
            <button class="btn" @click="handleReview(1, record)">确认</button>
          </div>
        </div>
      </div>

      <van-dialog v-model:show="is_show" use-slot id="van-dialog" class="dialog" show-cancel-button @confirm="refuse">
        <van-field v-model="reason" placeholder="请输入拒绝理由" border :blur="onReasonChange"/>
      </van-dialog>

    </van-tab>
    <van-tab title="已审核">
      <div class="box">
        <van-cell-group class="search">
          <van-field v-model="customer_name" center clearable label="来访人姓名" placeholder="请输入" border
                     :blur="onQueryChange" use-button-slot class="search_input"/>
          <van-button slot="button" type="primary" @click="onSearch">
            搜索
          </van-button>
        </van-cell-group>
        <div v-for="(record, index) in reviewed_dataList" :key="index" class="info">
          <div>
            <van-icon name="notes-o" :size="icon_size" :color="icon_color"/>
            <span>参观日期：</span>{{ record.date }}
          </div>
          <div>
            <van-icon name="underway-o" :size="icon_size" :color="icon_color"/>
            <span>参观时间：</span>{{ record.time }}
          </div>
          <div>
            <van-icon name="contact" :size="icon_size" :color="icon_color"/>
            <span>预约人：</span>{{ record.appointeeName }}
          </div>
          <div>
            <van-icon name="hotel-o" :size="icon_size" :color="icon_color"/>
            <span>联系方式：</span>{{ record.phone }}
          </div>
          <div>
            <van-icon name="phone-circle-o" :size="icon_size" :color="icon_color"/>
            <span>来访人信息：</span>{{ record.visitorInfo }}
          </div>
          <div>
            <van-icon name="friends-o" :size="icon_size" :color="icon_color"/>
            <span>预约人数：</span>{{ record.visitorNumber }}
          </div>
          <div>
            <van-icon name="question-o" :size="icon_size" :color="icon_color"/>
            <span>原因：</span>{{ record.comment }}
          </div>
          <van-divider custom-style="color: #1989fa; border-color: #1989fa;" dashed/>
          <div class="status">
            <div><span>预约时间：</span>{{ record.createTime }}</div>
            <div><span>审核状态：</span><span v-if="record.status === 1"
                                         style="padding: 0; margin: 0; color: green;">已通过</span><span v-else
                                                                                                      style="padding: 0; margin: 0; color: red;">已拒绝</span>
            </div>
          </div>
        </div>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
import myAxios from "../../plugins/myAxios";
import './audit.css'
import {Toast} from "vant";

export default {
  data() {
    return {
      is_show: false,
      refuse_record: [],
      active: 0,
      icon_color: '#333',
      icon_size: '20px',
      tab_class: 'tab_class',
      unreviewed_dataList: [],
      reviewed_dataList: [],
      customer_name: '',
      reason: ''
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const response = await myAxios.get('/appointment/get');
        this.unreviewed_dataList = response.data.filter(data => data.status === 0);
        this.reviewed_dataList = response.data.filter(data => data.status !== 0);
      } catch (error) {
        Toast.fail(`获取数据失败: ${error}`);
      }
    },
    onChange(index) {
      this.active = index;
    },
    async handleReview(status, record) {
      // Handle review logic here
      if (status === 2) {
        this.is_show = true;
        this.refuse_record = record;
      } else {
        try {
          const response = await myAxios.post('/appointment/update', {
            id: record.id,
            status: status,
          });
          console.log(response)
          await this.getData()
        } catch (error) {
          Toast.fail(`操作失败: ${error}`);
        }
      }
    },
    onReasonChange() {
      // Handle reason change logic here
      console.log(this.reason)
    },
    onQueryChange() {
      // Handle query change logic here
    },
    onSearch() {
      let self = this;
      self.reviewed_dataList = self.reviewed_dataList.filter(function (item) {
        return item.appointeeName.includes(self.customer_name);
      });
    },
    async refuse() {
      try {
        console.log(this.reason)
        const response = await myAxios.post('/appointment/update', {
          id: this.refuse_record.id,
          status: 2,
          comment: this.reason
        });

        console.log(response)
        await this.getData()
      } catch (error) {
        Toast.fail(`操作失败: ${error}`);
      }
    }
  }
}

</script>

<style scoped>

</style>