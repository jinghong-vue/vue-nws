<template>
  <!-- <h1>护理项目排班</h1> -->
  <div class="product">
    <template>
      <div style="margin-top: 20px">
        <h5 class="title1">选择项目：</h5>
        <!-- 点击弹出项目框 -->
        <el-checkbox-group
          v-model="checkboxGroup1"
          size="medium"
          @change="getValue()"
        >
          <el-popover
            placement="top-start"
            title="全部项目"
            width="600"
            trigger="click"
            :visible="visibleItem"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <el-button slot="reference">点击 激活</el-button>
            <!-- 删除气泡确认框 -->
            <el-popover placement="top" width="160" v-model="visibledelete">
              <p>这是一段内容这是一段内容确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="visibledelete = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="removeProjects"
                  >确定</el-button
                >
              </div>
              <el-button slot="reference">删除</el-button>
            </el-popover>
            <el-checkbox-button
              ref="checkgroups1"
              @change="selectItem"
              v-for="city in cities"
              :label="city.ItemName"
              :key="city.ItemName"
              :checked="city.checked"
              class="buttonin"
            >
              {{ city.ItemName }}
            </el-checkbox-button>
          </el-popover>
        </el-checkbox-group>
        <div class="shuru">
          <el-input
            v-model="input"
            @change="getinput"
            placeholder="请输入内容"
          ></el-input>
          <el-button class="addp" @click="additem()" icon="el-icon-plus"
            >增加项目</el-button
          >
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="total"
        :pageSize="pageSize"
      >
      </el-pagination>
    </template>
    <template>
      <div style="margin-top: 20px">
        <h5 class="title1">选择病床：</h5>
        <el-checkbox-group
          v-model="checkboxGroup2"
          size="medium"
          @change="getValue()"
        >
          <el-checkbox-button
            v-for="item in beds"
            :label="item.BedId"
            :key="item.BedId"
            class="buttonin"
          >
            {{ item.BedId }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    </template>
    <el-button class="title2" type="primary" @click="addStu"
      >发布项目</el-button
    >
    <el-button
      plain
      icon="iconfont icon-excel"
      @click="exportExcel"
      class="exportExcel"
      >导出excel</el-button
    >
    <Dialog
      ref="stuDialog"
      :visible="visible"
      @ok="ok"
      @cancel="cancel"
      :checkboxGroups="checkboxGroup1"
      :checkboxGroups2="checkboxGroup2"
    ></Dialog>

    <div class="edit">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="bedno" label="床号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="item" label="项目" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template v-slot="{ row, column, $index }">
              <el-button
                type="primary"
                @click="lookOver(row)"
                size="mini"
                icon="el-icon-view"
                >查看</el-button
              >
              <el-button
                type="primary"
                @click="edit(row)"
                size="mini"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="delStu(row, column, $index)"
                size="mini"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/users.js";
import Dialog from "@/components/Dialog";
import { mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
import storage from "@/api/storage.js";
import cunchu from "@/common/util";
import qee from "qf-export-excel";
// import xml2json from '@/xml2json.js'
const cityOptions = [
  "记尿量",
  "机测血糖",
  "血析导管",
  "剩余尿",
  "时间药",
  "手术前",
  "手术后",
  "胰岛素",
  "大静脉",
  "尿管",
  "胃液",
  "伤口引流管",
  "输液港",
  "止痛",
  "PICC",
  "胃管",
  "呼吸机",
  "点眼药",
  "约束带",
  "胆汁",
  "记胸水",
  "记出入量",
  "测血压",
  "测体重",
];
// const bedOptions = getdata("beddatas","jsonformat");
const bedOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];
// let date = new Date()
let userinfo = JSON.parse(localStorage.getItem("userinfo"));
// console.log(userinfo);
let areaid = userinfo.Response.Data.User.Area.AreaId;
console.log(areaid);
let count, page, cities, input;
export default {
  data() {
    return {
      checkboxGroup1: [],
      checkboxGroup2: [],
      cities: cityOptions,
      beds: bedOptions,
      visible: false,
      stuData: [],
      loading: false,
      tableData: [
        {
          date: "",
          bedno: "王小虎",
          item: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      meetdata: [],
      nowtime: "",
      total: 0,
      pageSize: 0,
      count: 0,
      page: 0,
      input: "", //增加项目输入框
      itemid: "", //项目id
      itemsIds: [],
      memo: "", //备注
      visibleItem: "", //项目显示
      visibledelete: false, //删除项目显示
    };
  },
  computed: {
    time() {
      let time = this.$moment().format("YYYY-MM-DD HH:mm:ss"); //当前时间：2021-05-11 18:42:53
      console.log(time);
      // this.tableData.date = this.$moment().format("YYYY-MM-DD HH:mm:ss")
    },
  },
  mounted() {
    this.getTime();
    // if (this.tableData) {
    // }
    // this.tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    this.tableData = cunchu.getlocaL("tableData", []);
    console.log("this.tableData", this.tableData);
    this.getBeds(areaid);
    console.log(areaid);
    console.log("fffffffff", count, page);
    this.getProjects(100, 1);
    console.log("eeeeeeee", count, page);
    console.log(areaid);
  },

  components: {
    Dialog,
  },
  methods: {
    selectItem() {
      console.log(this.checkboxGroup1);
      if (this.checkboxGroup1.length > 0) {
        // this.visibleItem = false
        console.log(this.$refs.checkgroups1);
      }
    },
    getinput(inp) {
      // console.log(inp);
      this.input = inp;
    },
    // 增加项目
    additem() {
      // let itemid=Math.random().toString(36).substring(2)
      let memo = this.memo;
      let itemid = this.itemid;
      console.log(itemid, this.input, (memo = 1), areaid);
      this.addProjects((itemid = ""), this.input, (memo = 1), areaid);
    },
    //导出excel
    exportExcel() {
      //导出的字段有哪些
      let titleList = [
        {
          title: "日期",
          key: "date",
        },
        {
          title: "床号",
          key: "bedno",
        },
        {
          title: "项目",
          key: "item",
        },
      ];

      qee(titleList, this.tableData, "2211项目");
    },
    //页码改变的时候
    pageChange(pageSize) {
      this.getProjects(5, pageSize);
    },
    removeProjects(itemid, areaid) {
      console.log("remove", itemid, areaid);
    },
    getProjects(count, page, areaid = "") {
      console.log(count, page, areaid);
      let cityOptions = api.getprojectsApi(count, page, areaid).then((res) => {
        // console.log(res.data);
        let projects = this.$x2js.xml2js(res.data);
        console.log(projects);
        let projs = projects.Response.Data.ExamItem.Dict;
        console.log(projs);
        this.cities = projs;
        this.total = Number(projs[0].Amount);
        this.pageSize = count;
      });
    },
    addProjects(itemid, itemname, memo) {
      console.log(areaid);
      let newProjects = api
        .addprojectsApi(itemid, itemname, memo, areaid)
        .then((res) => {
          console.log(res);
          // console.log(res.data);
          let newprojects = this.$x2js.xml2js(res.data);
          console.log(newprojects);
          let itemid = newprojects.Response.Data;
          console.log(itemid);
          //建立关系
          this.buildRelationships(itemid, areaid);
        });
    },
    buildRelationships(itemid, areaid, option = 0) {
      let builds = api.buildrelationsApi(itemid, areaid, option).then((res) => {
        console.log(res);
      });
    },
    getBeds() {
      let bedOptionss = api.getbedsApi(areaid).then(async (res) => {
        // let beds = res.data
        // xml转json
        let beds = this.$x2js.xml2js(res.data);
        console.log(beds);
        let bedss = beds.Response.Data.AreaBed.Bed;
        console.log(bedss);
        this.beds = bedss;
      });
    },
    getTime() {
      // new Date() new一个data对象，当前日期和时间
      // toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
      this.nowtime = new Date().toLocaleString();
      console.log("nowtime: ", this.nowtime);
    },
    getValue() {
      let _this = this;
      console.log(_this);
      console.log(_this.cities); //全部项目
      let itemsIds = _this.cities.map((item) => {
        return item.ItemCode;
      });
      console.log(itemsIds);
      let itemid = this.itemid;
      console.log(itemid);
      console.log(_this.$refs.checkgroups1);
      // console.log(itemid);
      console.log(_this.checkboxGroup1);
      console.log(_this.checkboxGroup2);
      // checkboxGroup1=_this.checkboxGroup1
    },
    //增加
    addStu() {
      //清空dialog中的数据
      // this.$refs.stuDialog.stuForm = {};
      this.$refs.stuDialog.title = "增加学员信息";
      console.log(this.checkboxGroup1);
      this.visible = true;
    },
    //查看学员信息
    lookOver(row) {
      //设置当前行的信息
      this.$router.push({
        path: "/releaseManagement/projectEditor",
        query: row,
      });
    },
    //编辑
    edit(row) {
      console.log(row);
      console.log(this.$refs.stuDialog);
      // 数据回显
      // this.$refs.stuDialog.stuForm = {...row}
      // this.$refs.stuDialog.title = '编辑学员信息'
      this.visible = true;
    },
    // 删除
    delStu(row, column, index) {
      console.log(this.tableData);
      console.log(row, column, index);
      // console.log(row.sId);
      this.$confirm("该操作将永久删除数据，是否继续", "删除提示")
        .then(() => {
          this.$message.success("删除成功");
          this.tableData.splice(
            this.tableData.findIndex((item) => item.index === index),
            1
          );
          cunchu.rmLocal("tableData");
          // api.deleteStu(row.sId)
          // .then(res => {
          // if (res.data.state) {
          // this.$message.success('删除成功')
          //     this.getStuList()
          // }
          // })
          // storage.rm()

          // cunchu.rmLocal()
        })
        .catch((e) => {
          // console.log(e);
          this.$message.error("已取消删除");
        });
    },
    //点击了dialog确定按钮
    ok(formData) {
      console.log("dailogOpen", this.tableData);
      let dialogTitle = this.$refs.stuDialog.title;
      // console.log(dialogTitle);
      // console.log(this.checkboxGroup2);
      var b = this.checkboxGroup2.map((item) => {
        return item;
      });
      console.log(b);
      console.log(this.checkboxGroup2[0]);
      this.getTime();
      this.tableData.date = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      this.tableData.push({
        date: this.nowtime,
        bedno: b.join(", "),
        item: this.checkboxGroup1.join(", "),
      });

      this.visible = false;
      console.log(this.tableData);
      cunchu.setlocaL("tableData", this.tableData);
      // localStorage.setItem("tableData",JSON.stringify(this.tableData))
    },
    //点击了dialo取消定按钮
    cancel() {
      // console.log("dialogClose");
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-checkbox-button__inner {
  margin: 10px;
  border: 0;
}
.title1 {
  display: block;
  width: 68px;
}
.title2 {
  margin: 46px;
}
.pagination {
  margin: 10px;
}
/deep/ .exportExcel i.icon-excel {
  color: green !important;
  font-size: 20px;
  margin-right: 3px;
}
.shuru {
  display: flex;
  width: 250px;
  .addp {
    font-size: small;
  }
}
</style>
