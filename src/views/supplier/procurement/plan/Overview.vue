<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar" v-if="type === 3">
      <div>
        <el-button type="primary" plain @click="updateSupplier">查询供应商</el-button>
        <el-button type="primary" plain @click="updateBuyer">查询采购员</el-button>
      </div>
    </div>
    <div class="jz-overview-title">
      <i class="el-icon-s-opportunity jz-red"></i>
      <span>延期或不满足</span>
      <i class="el-icon-s-opportunity jz-yellow"></i>
      <span>提醒当天完成</span>
      <i class="el-icon-s-opportunity jz-gray"></i>
      <span>无任务</span>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <table class="jz-deliver" v-if="deliverShow">
        <tr>
          <th colspan="6">交付异常汇总</th>
        </tr>
        <tr>
          <th style="width: 200px" v-if="type !== 1">
            <span v-if="updateType === 'supplier'">供应商编码</span>
            <span v-if="updateType === 'buyer'">采购员</span>
          </th>
          <th>
            订单确认
          </th>
          <th>
            <router-link style="color: #4499ff;cursor: pointer"
                         :to="{path:'/procurement/infoMaintenance/inventory'}">
              供应商厂内库存
            </router-link>
          </th>
          <th>
            装车单维护
          </th>
          <th>
            到厂状态
          </th>
          <th>
            延期单
          </th>
        </tr>
        <tr v-for="deliver in deliverList" :key="deliver.supplierCode">
          <td class="jz-deliver-td" v-if="type !== 1">
            <span style="width: 100%;color: #4499ff" v-if="updateType === 'buyer'"
                  @click="updateBuyerSupplier(deliver.supplierCode)">{{ deliver.supplierCode }}</span>
            <span style="width: 100%" v-else>{{ deliver.supplierCode }}</span>
          </td>
          <td class="jz-deliver-td" v-if="deliver.purchaseRed === 0 && deliver.purchaseYellow === 0">
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
          </td>
          <td class="jz-deliver-td" v-else>
            <span><i class="el-icon-s-opportunity jz-yellow"></i></span>
            <span>
                    <span v-if="deliver.purchaseYellow === 0">{{ deliver.purchaseYellow }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderConfirm',query:{username:deliver.supplierCode,colorStatus:1}}">
                      {{ deliver.purchaseYellow }}
                    </router-link>
                  </span>
            <span><i class="el-icon-s-opportunity jz-red"></i></span>
            <span>
                    <span v-if="deliver.purchaseRed === 0">{{ deliver.purchaseRed }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderConfirm',query:{username:deliver.supplierCode,colorStatus:2}}">
                      {{ deliver.purchaseRed }}
                    </router-link>
                  </span>
          </td>
          <td class="jz-deliver-td" v-if="deliver.inventoryYellow === 0 && deliver.inventoryRed === 0">
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
          </td>
          <td class="jz-deliver-td" v-else>
            <span><i class="el-icon-s-opportunity jz-yellow"></i></span>
            <span>
                    <span v-if="deliver.inventoryYellow === 0">{{ deliver.inventoryYellow }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/inventory',query:{username:deliver.supplierCode,colorStatus:1}}">{{
                        deliver.inventoryYellow
                      }}</router-link>
                  </span>
            <span><i class="el-icon-s-opportunity jz-red"></i></span>
            <span>
                    <span v-if="deliver.inventoryRed === 0">{{ deliver.inventoryRed }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/inventory',query:{username:deliver.supplierCode,colorStatus:2}}">{{
                        deliver.inventoryRed
                      }}</router-link>
                  </span>
          </td>
          <td class="jz-deliver-td" v-if="deliver.truckYellow === 0 && deliver.truckRed === 0">
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
          </td>
          <td class="jz-deliver-td" v-else>
            <span><i class="el-icon-s-opportunity jz-yellow"></i></span>
            <span>
                    <span v-if="deliver.truckYellow === 0">{{ deliver.truckYellow }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/shippingOrder',query:{username:deliver.supplierCode,colorStatus:1}}">{{
                        deliver.truckYellow
                      }}</router-link>
                  </span>
            <span><i class="el-icon-s-opportunity jz-red"></i></span>
            <span>
                    <span v-if="deliver.truckRed === 0">{{ deliver.truckRed }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/shippingOrder',query:{username:deliver.supplierCode,colorStatus:2}}">{{
                        deliver.truckRed
                      }}</router-link>
                  </span>
          </td>
          <td class="jz-deliver-td" v-if="deliver.factoryYellow === 0 && deliver.factoryRed === 0">
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
          </td>
          <td class="jz-deliver-td" v-else>
            <span><i class="el-icon-s-opportunity jz-yellow"></i></span>
            <span>
                    <span v-if="deliver.factoryYellow === 0">{{ deliver.factoryYellow }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderStatus',query:{username:deliver.supplierCode,factoryColorStatus:1}}">{{
                        deliver.factoryYellow
                      }}</router-link>
                  </span>
            <span><i class="el-icon-s-opportunity jz-red"></i></span>
            <span>
                    <span v-if="deliver.factoryRed === 0">{{ deliver.factoryRed }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderStatus',query:{username:deliver.supplierCode,factoryColorStatus:2}}">{{
                        deliver.factoryRed
                      }}</router-link>
                  </span>
          </td>
          <td class="jz-deliver-td" v-if="deliver.postponeYellow === 0 && deliver.postponeRed === 0">
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
            <span><i class="el-icon-s-opportunity jz-gray"></i></span>
            <span>0</span>
          </td>
          <td class="jz-deliver-td" v-else>
            <span><i class="el-icon-s-opportunity jz-yellow"></i></span>
            <span>
                    <span v-if="deliver.postponeYellow === 0">{{ deliver.postponeYellow }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderStatus',query:{username:deliver.supplierCode,postponeColorStatus:1}}">{{
                        deliver.postponeYellow
                      }}</router-link>
                  </span>
            <span><i class="el-icon-s-opportunity jz-red"></i></span>
            <span>
                    <span v-if="deliver.postponeRed === 0">{{ deliver.postponeRed }}</span>
                    <router-link v-else style="color: #4499ff;cursor: pointer"
                                 :to="{path:'/procurement/infoMaintenance/orderStatus',query:{username:deliver.supplierCode,postponeColorStatus:2}}">{{
                        deliver.postponeRed
                      }}</router-link>
                  </span>
          </td>
        </tr>
      </table>
      <strong style="line-height: 30px">供需差异汇总</strong>
      <el-table v-if="deliverShow"
                highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="timeData"
                style="width:100%">
        <el-table-column label="供需差异汇总">
          <el-table-column v-if="type !== 1" prop="supplierCode" width="120"
                           :label="updateType === 'supplier' ? '供应商编码' : '采购员'"/>
          <el-table-column v-for="(item,index) in weekDateList" :key="index" :prop="item.name" :label="item.value"
                           width="60">
            <template slot-scope="scope">
              <span v-if="scope.row[item.name] === 0">{{ scope.row[item.name] }}</span>
              <span v-else style="color: #4499ff;cursor: pointer;"
                    @click="getDetails(scope.row,item.name)">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thirdWeek" label="第三周" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.thirdWeek === 0">{{ scope.row.thirdWeek }}</span>
              <span v-else style="color: #4499ff"
                    @click="getDetails(scope.row,'thirdWeek')">{{ scope.row.thirdWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fourthWeek" label="第四周" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.fourthWeek === 0">{{ scope.row.fourthWeek }}</span>
              <span v-else style="color: #4499ff;cursor: pointer;"
                    @click="getDetails(scope.row,'fourthWeek')">{{ scope.row.fourthWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fifthWeek" label="第五周" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.fifthWeek === 0">{{ scope.row.fifthWeek }}</span>
              <span v-else style="color: #4499ff;cursor: pointer;"
                    @click="getDetails(scope.row,'fifthWeek')">{{ scope.row.fifthWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sixthWeek" label="第六周" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.sixthWeek === 0">{{ scope.row.sixthWeek }}</span>
              <span v-else style="color: #4499ff;cursor: pointer;"
                    @click="getDetails(scope.row,'sixthWeek')">{{ scope.row.sixthWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sum" label="总计">
            <template slot-scope="scope">
              <span v-if="scope.row.sum === 0">{{ scope.row.sum }}</span>
              <span v-else style="color: #4499ff;cursor: pointer;"
                    @click="getDetails(scope.row,'sum')">{{ scope.row.sum }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!--  Table  -->
    <div class="jz-module-table" v-if="show">
      <strong style="line-height: 30px">供需差异详情</strong>
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="plant" label="工厂" width="120"/>
        <el-table-column prop="materialNumber" label="物料号" width="100"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150"/>
        <el-table-column prop="type" :formatter="formatInfoType" label="类型"/>
        <el-table-column v-for="(item,index) in dateList" :key="index" :prop="item.name" :label="item.value"
                         width="60"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination" v-if="show">
      <el-pagination @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="tableUtil.table.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'

export default {
  name: "Overview",
  data() {
    return {
      type: this.$store.state.user.type,
      deliverList: [],
      deliverShow: false,
      timeData: [],
      dateList: [],
      weekDateList: [],
      tableUtil: {},
      supplyDiffList: [],
      updateType: 'supplier',
      show: false
    }
  },
  created() {
    this.getDate()
    this.getDict()
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.plan.overview, {}, '供需总览', false);
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    doSearch() {
      this.tableUtil.initTable()
    },
    getDetails(data, name) {
      if (data.supplierCode !== undefined) {
        this.tableUtil.filter.username = data.supplierCode
      }
      this.tableUtil.filter.date = name
      this.tableUtil.initTable()
      this.show = true
    },
    updateSupplier() {
      this.updateType = 'supplier'
      let filter = {};
      this.getDeliver(filter)
    },
    updateBuyer() {
      this.updateType = 'buyer'
      let filter = {
        role: 1
      };
      this.getDeliver(filter)
    },
    updateBuyerSupplier(name) {
      this.updateType = 'supplier'
      let filter = {
        username: name
      };
      this.getDeliver(filter)
    },
    getDeliver(filter) {
      // role 空：默认是供应商维度
      // role 1： 采购员维度
      // 采购员维度，点击采购员名称，将数据写入用户名（username）
      // username 用户名
      // filter.role = '1';
      // filter.username = 'ent1';
      this.$api.supplier.procurement.plan.overview.getDeliver(filter).then(res => {
        if (res.code === 200) {
          this.deliverList = res.data.abnormalDelivery;
          this.timeData = res.data.diff;
          this.deliverShow = true
        }
      })
    },
    getDate() {
      this.$api.supplier.procurement.plan.overview.getDate().then(res => {
        if (res.code === 200) {
          // this.dateList = res.data
          this.dateList = []
          for (let key in res.data) {
            this.dateList.push({name: key, value: res.data[key]})
          }
          this.weekDateList = this.dateList.slice(0, 14)
          this.getDeliver({})
        }
      })
    },
    getDict() {
      this.$api.supplier.system.dict('SupplyDiffStatus').then(res => {
        if (res.code === 200) {
          this.supplyDiffList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatInfoType(row, column, cellValue) {
      let dictLabel = "";
      this.supplyDiffList.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
  }
}
</script>

<style scoped>
.jz-overview-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
}

.jz-red {
  color: red;
}

.jz-yellow {
  color: yellow;
}

.jz-gray {
  color: gray;
}

.jz-overview-title span {
  margin: 0 10px 0 5px;
}

.jz-deliver {
  width: 100%;
  border-collapse: collapse;
  /*border: 1px solid #999;*/
  margin-bottom: 30px;
}

.jz-deliver th, .jz-deliver td {
  border: 1px solid #EBEEF5;
  height: 40px;
  text-align: center;
  background: rgb(249, 249, 249);
  font-size: 14px;
}

.jz-deliver td {
  width: 17%;
  height: 30px;
  background: none;
  /*display: flex;*/
  /*align-content: center;*/
}

.jz-deliver td:first-child {
  width: 12%;
}

.jz-deliver-td span {
  display: inline-block;
  width: 25%;
  height: 30px;
  line-height: 30px;
  border-left: 1px solid #EBEEF5;
}

.jz-deliver-td span:first-child {
  border-left: none;
}
</style>
