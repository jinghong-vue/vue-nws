<template>
  <!-- <h1>护理项目排班</h1> -->
  <div class="schdule">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="病床管理" name="bedManager" class="pane-tab">
        <!-- 病床管理 -->
        <div class="bedManager">
          <!-- 顶部增加项目 -->
          <!-- 删除选中项目 -->
          <el-button type="primary" @click="openTopDialog" class="topaddproject"
            >增加项目</el-button
          >
          <!-- <el-button @click="toggleSelection()">取消选择</el-button> -->
          <el-button
            type="danger"
            
            @click="deleteSelections()"
            :disabled="multipleSelection.length == 0"
            >删除选择</el-button
          >
          <!-- <el-button @click="toggleSelection(scope.$index, scheduleinfos.bed)">取消选择</el-button> -->
          <!-- <el-button type="text">总计：{{topStatisticValue}}床</el-button> -->
          <el-table
            :data="bedtabledata"
            style="width: 100%; height:calc(100vh - 153px)"
            border
            stripe
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="name"
              label="床号"
              width="150"
              align="center"
            >
            </el-table-column>

            <el-table-column label="项目名称" align="center">
              <template slot-scope="scope">
                <el-tag
                  :key="itemindex"
                  v-for="(item, itemindex) in scope.row.items"
                  closable
                  :disable-transitions="false"
                  @close="
                    deleteRowOrArray(scope.$index, scheduleinfos.bed, itemindex)
                  "
                  effect="dark"
                  type="success"
                >
                  {{ projectinfos[item]?.name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot="header" slot-scope="scope">
                <el-input
                  @change="topSearchChange"
                  v-model="header_search"
                  size="mini"
                  placeholder="输入床号关键字搜索"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    @click="topSearch"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="openDialog(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >
                  增加项目
                </el-button>
                <el-button
                  @click.native.prevent="
                    deleteRowOrArray(scope.$index, scheduleinfos.bed)
                  "
                  type="danger"
                  size="small"
                >
                  清空项目
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-pagination class="pagination"
          background  @current-change = "pageChange"
          layout="prev, pager, next"
          :total="total" :pageSize="pageSize">
        </el-pagination> -->
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="itemManager">
        <!-- 顶部增加床位 -->
        <el-button
          type="primary"
          @click="openBedTopDialog"
          class="topaddproject"
          >增加床位</el-button
        >
        <!-- 顶部删除所选按钮 -->
        <el-button
          type="danger"
          @click="deleteSelectionsProject()"
          :disabled="multipleSelection.length == 0"
          >删除选择</el-button
        >
        <!-- 项目管理 -->
        <template>
          <el-table
            :data="scheduleinfos.project"
            style="width: 100%; height:calc(100vh - 153px)"
            max-height="510"
            border
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="name"
              label="项目名称"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column label="床号" prop="items" align="center">
              <template slot-scope="scope">
                <el-popover
                  v-for="(item, itemindex) in scope.row.items"
                  placement="top"
                  trigger="hover"
                  width="160"
                >
                  <p>确认要删除该项目的所有床位吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="
                        deleteRowOrArray(
                          scope.$index,
                          scheduleinfos.project,
                          itemindex,
                          'project'
                        )
                      "
                      >确定</el-button
                    >
                  </div>
                </el-popover>
                <el-tag
                  :key="itemindex"
                  v-for="(item, itemindex) in scope.row.items"
                  closable
                  :disable-transitions="false"
                  @close="
                    deleteRowOrArray(
                      scope.$index,
                      scheduleinfos.project,
                      itemindex,
                      'project'
                    )
                  "
                  effect="dark"
                  type="success"
                >
                  {{ bedinfos[item].name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="openBedDialog(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >
                  增加床位
                </el-button>
                <el-button
                  @click.native.prevent="
                    deleteRowOrArray(
                      scope.$index,
                      scheduleinfos.project,
                      -1,
                      'project'
                    )
                  "
                  type="danger"
                  size="small"
                >
                  清空床位
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="增加项目"
      :visible.sync="dialogFormVisible"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="bedform">
        <el-form-item label="床号" :label-width="formLabelWidth">
          <!-- <el-input v-model="bedform.bedname" autocomplete="off"></el-input> -->
          <el-select
            v-model="bedform.bednumber"
            placeholder=""
            :disabled="bedform.bedindex >= 0"
          >
            <el-option
              :label="bed.name"
              :value="key"
              v-for="(bed, key) in filterSelectBed"
              >{{ bed.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="选择项目" :label-width="formLabelWidth" class="selectproject">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="bedform.projects"
            @change="handleCheckedProjectsChange"
          >
            <el-checkbox v-for="(project, key) in projectinfos" :label="key">{{
              project.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddProject(bedform)"
          :disabled="bedform.projects.length === 0 || !bedform.bednumber"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="增加床位"
      :visible.sync="dialogFormVisible2"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="projectform">
        <el-form-item label="项目" :label-width="formLabelWidth">
          <!-- <el-input v-model="projectform.bedname" autocomplete="off"></el-input> -->
          <el-select
            v-model="projectform.projectnumber"
            placeholder=""
            :disabled="projectform.projectindex >= 0"
          >
            <el-option
              :label="project.name"
              :value="key"
              v-for="(project, key) in filterSelectProject"
              >{{ project.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="选择床位" :label-width="formLabelWidth" class="select selectproject">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange2"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="projectform.beds"
            @change="handleCheckedProjectsChange2"
          >
            <el-checkbox v-for="(bed, key) in bedinfos" :label="key">{{
              bed.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddBed(projectform)"
          :disabled="
            projectform.beds.length === 0 || !projectform.projectnumber"

          
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/users.js";
// import Dialog from "@/components/Dialog2";
import util from "@/common/util";

let userinfo = JSON.parse(localStorage.getItem("userinfo"));
let user = userinfo.Response.Data.User;
console.log(user); //用户信息
let areaid = userinfo.Response.Data.User.Area.AreaId;
console.log(areaid); //区域id

export default {
  data() {
    return {
      isBreadcrumbShow: false,
      // activeName: "bedManager", //当前标签页
      activeName: "itemManager", //当前标签页
      total: 0, //项目总条数
      pageSize: 5, //项目分页每页数
      dialogFormVisible: false, //对话框显示
      dialogFormVisible2: false, //对话框显示
      formLabelWidth: "120px", //对话框表单宽度
      checkAll: false, //项目全选
      isIndeterminate: true, //checkbox 的不确定状态，用于实现全选的效果
      header_search: "", //表格顶部_搜索床位
      multipleSelection: [], //表格左侧多选
      topdeleteDisabled: true, //顶部删除按钮
      bedtabledata: [], //表格数据
      topStatisticValue: "0 ", //顶部统计信息
      topStatisticTitle: "2222", //顶部统计标题
      // 所有床的信息
      bedinfos: {},
      // 所有项目的信息
      projectinfos: {},
      // 排班信息
      scheduleinfos: {
        bed: [
          //床位信息
        ],
        project: [
          //项目信息
        ],
      },
      // bed
      bedform: {
        bednumber: "",
        projects: [],
        bedindex: 0,
      },
      // project
      projectform: {
        projectnumber: "",
        beds: [],
        projectindex: 0,
      },
    };
  },
  mounted() {
    // util.setlocaL("isShowBreadCrumb",false)
    // setTimeout(() => {

    //   console.log("isShowBreadCrumb",util.getlocaL("isShowBreadCrumb"));
    // }, 1000);
    // //获取床位
    this.getBeds();
    // //获取项目
    this.getProjects();

    //获取项目和床位的关系
    setTimeout(() => {
      this.showbedtoproject();
    }, 500);
  },
  components: {},
  computed: {
    //根据是顶部增加还是行内增加 修改确定按钮的可选

    // isDialogConfirm(){
    //   if (this.projectform.projectindex == '-1') {
    //     // console.log('顶部增加');
    //     if ( this.projectform.beds.length === 0 || !this.projectform.projectnumber) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   } else if (this.projectform.projectindex == '0') {
    //     // console.log('行内增加');
    //     if (this.projectform.beds.length === 0  || !this.projectform.projectnumber) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // },

    filterSelectBed() {
      if (this.bedform.bedindex >= 0) {
        return this.bedinfos;
      }
      let newbedinfos = {};
      let hasnumbers = [];
      console.log("this.scheduleinfos.bed", this.scheduleinfos.bed);
      console.log(this.bedinfos);
      // let hasnumbers =
      for (var i = 0; i < this.scheduleinfos.bed.length; i++) {
        hasnumbers.push(this.scheduleinfos.bed[i].number);
      }
      console.log(hasnumbers);
      for (const key in this.bedinfos) {
        if (Object.hasOwnProperty.call(this.bedinfos, key)) {
          const element = this.bedinfos[key];
          // console.log(key, element);
          // console.log(hasnumbers.indexOf(key));
          if (hasnumbers.indexOf(key) < 0) {
            // console.log(key, element);
            newbedinfos[key] = element;
          }
        }
      }
      console.log(newbedinfos);
      // this.bedinfos.filter((item)=>{
      //   return item.number !== this.scheduleinfos.bed.number
      // })
      // return this.bedinfos
      return newbedinfos;
    },
    filterSelectProject() {
      if (this.projectform.projectindex >= 0) {
        return this.projectinfos;
      }
      let newprojectinfos = {};
      let hasnumbers = [];
      console.log(this.scheduleinfos.project);
      console.log(this.projectinfos);
      // let hasnumbers =
      for (var i = 0; i < this.scheduleinfos.project.length; i++) {
        hasnumbers.push(this.scheduleinfos.project[i].number);
      }
      console.log(hasnumbers);
      for (const key in this.projectinfos) {
        if (Object.hasOwnProperty.call(this.projectinfos, key)) {
          const element = this.projectinfos[key];
          // console.log("key, element",key, element);
          // console.log(hasnumbers.indexOf(key));
          if (hasnumbers.indexOf(key) < 0) {
            // console.log(key, element);
            newprojectinfos[key] = element;
          }
        }
      }
      console.log(newprojectinfos);
      // this.bedinfos.filter((item)=>{
      //   return item.number !== this.scheduleinfos.bed.number
      // })
      // return this.bedinfos
      return newprojectinfos;
    },
  },

  methods: {
    //顶部搜索input输入框变化时
    topSearchChange(val) {
      console.log(val);
      this.header_search = val;
    },
    //点击顶部输入框 搜索图标 函数触发
    topSearch() {
      console.log(
        1111111111111111111111111111111111111,
        this.scheduleinfos.bed,
        this.header_search
      );
      console.log("this.multipleSelection", this.multipleSelection);
      let selectsArr = this.multipleSelection;
      this.$refs.multipleTable.clearSelection();
      this.bedtabledata = this.scheduleinfos.bed.filter(
        (data) =>
          !this.header_search ||
          data.name.toLowerCase().includes(this.header_search.toLowerCase())
      );
      console.log("this.bedtabledata", this.bedtabledata);
      console.log("selectsArr", selectsArr);

      for (let i = 0; i < selectsArr.length; i++) {
        let flag = false; //flag ：搜索的是否在选中的里面
        const element = selectsArr[i];
        console.log(element);
        this.bedtabledata.forEach((item) => {
          if (item.name == element.name) {
            flag = true;
          }
        });
        if (flag) {
          console.log("在里面");
        } else {
          console.log("在外面");
          this.bedtabledata.push(element);
        }
      }
      setTimeout(() => {
        selectsArr.forEach((row) => {
          console.log(row.name);
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }, 100);
      console.log("selectsArr", selectsArr);
    },
    //表格上方删除所选项目所
    deleteSelectionsProject() {
      console.log(this.multipleSelection); //选中的项目行
      console.log(this.scheduleinfos.project); //排班信息中的所有项目
      let selections = this.multipleSelection; //选中的项目行
      //组装要删除的床位与项目关系数据
      let bedoptdatas = {};
      for (let i = 0; i < selections.length; i++) {
        let selectprojectEvery = selections[i]; //循环出每一个项目行
        console.log(selectprojectEvery);
        for (let j = 0; j < selectprojectEvery.items.length; j++) {
          // selectprojectEvery["items"][j]] ：选中的每一个项目行中的项目数组中的每一个床位
          if (!bedoptdatas[selectprojectEvery["items"][j]]) {
            for (let k = 0; k < this.scheduleinfos.bed.length; k++) {
              //this.scheduleinfos.bed[k]["number"] 排班信息里每张床
              //如果 选中的每一个项目中的每个床位 和 排班信息里每一张床 如果相等
              if (this.scheduleinfos.bed[k]["number"] == selectprojectEvery["items"][j]) {
                // this.scheduleinfos.bed[k]["items"] 排班信息床里面每张床的所有项目
                // 组装要删除的床位与项目关系数据[床位] = 
                bedoptdatas[selectprojectEvery["items"][j]] =this.scheduleinfos.bed[k]["items"];
                break;
              }
            }
          }
          // bedoptdatas[selectprojectEvery["items"][j]] ：组装要删除的床位与项目关系数据[ 床位 ]所含项目
          //selectprojectEvery.number 选中的每一个项目
          if (bedoptdatas[selectprojectEvery["items"][j]].indexOf(selectprojectEvery.number) >= 0)
           {
            bedoptdatas[selectprojectEvery["items"][j]].splice(
              bedoptdatas[selectprojectEvery["items"][j]].indexOf(selectprojectEvery.number),
              1
            );
          }
        }
      }
      console.log("bedoptdatas:", bedoptdatas);
      for (const key in bedoptdatas) {
        if (Object.hasOwnProperty.call(bedoptdatas, key)) {
          const element = bedoptdatas[key];
          console.log("bedoptdatas:element", key, element);

          this.addbedtoproject(key, element)
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      this.showbedtoproject();
    },
    //表格上方删除所选床位
    deleteSelections() {
      console.log(this.multipleSelection);
      console.log(this.scheduleinfos.bed);
      let selections = this.multipleSelection;
      this.$confirm("确定要删除所选的行吗", "删除提示")
        .then(() => {
          let delreqsts = []
          for (let i = 0; i < selections.length; i++) {
            const element = selections[i].number;
            console.log(element);
            delreqsts.push(this.addbedtoproject(element));

          }
          console.log(delreqsts);
          Promise.all(delreqsts).then((res) => {
              console.log("delreqsts",res);
              this.showbedtoproject();
          });
          this.showbedtoproject();
          this.$message.success("删除成功");
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("已取消删除");
        });
    },
    // 表格左侧取消选择

    //左侧多选改变值时
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("val", val);
      // if (val.length > 0) {
      //   console.log(11111111111111111111111111111);
      //   this.topdeleteDisabled = false
      // }else{
      //     this.topdeleteDisabled = true

      // }
      // if (val.length == 0) {
      // }
    },
    // 新增管理病床项目全选
    handleCheckAllChange(val) {
      if (val) {
        this.bedform.projects = Object.keys(this.projectinfos);
      } else {
        this.bedform.projects = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckAllChange2(val) {
      console.log(val);
      if (val) {
        this.projectform.beds = Object.keys(this.bedinfos);
      } else {
        this.projectform.beds = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedProjectsChange() {
      let xunhuanlis = Object.keys(this.projectinfos).length;
      console.log(this.bedform.projects);
      let checkedCount = this.bedform.projects.length;
      this.checkAll = checkedCount === xunhuanlis;
      this.isIndeterminate = checkedCount > 0 && checkedCount < xunhuanlis;
    },
    handleCheckedProjectsChange2() {
      let xunhuanlis = Object.keys(this.bedinfos).length;
      console.log(this.projectform.beds);
      let checkedCount = this.projectform.beds.length;
      this.checkAll = checkedCount === xunhuanlis;
      this.isIndeterminate = checkedCount > 0 && checkedCount < xunhuanlis;
    },
    //点击 病床管理页面 对话框中确定增加项目
    confirmAddProject(data) {
      console.log(data);
      this.addbedtoproject(data.bednumber, data.projects)
        .then((res) => {
          console.log(res);
          this.closeDialog();
          this.showbedtoproject();
        })
        .catch((error) => {
          this.closeDialog();
          console.log(error);
        });
      // console.log(data.projects[0]);
      // console.log(data.bedindex);
      // console.log(this.scheduleinfos.bed);
      // if (data.bedindex < 0 && this.bedinfos[data.bednumber]) {
      //   this.scheduleinfos.bed.push({
      //     number: data.bednumber,
      //     name: this.bedinfos[data.bednumber].name,
      //     items: data.projects,
      //   });
      // } else {
      //   this.scheduleinfos.bed[data.bedindex].items = data.projects;
      //   if (data.projects.length === 0) {
      //     this.scheduleinfos.bed.splice(data.bedindex, 1);
      //   }
      // }
      // // 修改项目排班
      // this.reformatdata("bed");
      // for (let pi = 0; pi < data.projects.length; pi++) {
      //   const currentproject = data.projects[pi];
      //   console.log("currentproject:", currentproject);
      //   let hasdata = false;
      //   for (var i = 0; i < this.scheduleinfos.project.length; i++) {
      //     let projectitem = this.scheduleinfos.project[i];
      //     if (projectitem["number"] == currentproject) {
      //       //
      //       this.scheduleinfos.project[i]["items"].push(data["bednumber"]);
      //       hasdata = true;
      //     }
      //   }
      //   if (!hasdata && this.projectinfos[currentproject]) {
      //     this.scheduleinfos.project.push({
      //       number: currentproject,
      //       name: this.projectinfos[currentproject].name,
      //       items: [data["bednumber"]],
      //     });
      //   }
      // }
      // console.log('我',11111);
      // setTimeout(() => {
      //   this.showbedtoproject()
      // }, 5000);
      // this.closeDialog();

      // console.log('我',22222);
    },
    //点击 项目管理页面 对话框中确定增加 床位
    confirmAddBed(data) {
      console.log(data);
      console.log(data.projectindex);
      console.log(this.scheduleinfos.project);
      console.log(data.projectindex);
      console.log(data.projectnumber);
      console.log(this.projectinfos);
      console.log(this.projectinfos[data.projectnumber]);
      console.log(5555555555555,this.projectform.beds);
      if (data.projectindex < 0 && this.projectinfos[data.projectnumber]) {
        this.scheduleinfos.project.push({
          number: data.projectnumber,
          name: this.projectinfos[data.projectnumber].name,
          items: data.beds,
        });
      } else {
        this.scheduleinfos.project[data.projectindex].items = data.beds;
        if (data.beds.length === 0) {
          this.scheduleinfos.project.splice(data.projectindex, 1);
        }
      }
      // 修改床位排班
      console.log(5555555555555,this.projectform.beds);
      this.reformatdata("project");
      console.log(this.scheduleinfos.bed);
      console.log(data.beds);//点击多选框修改后的 床号数组
      
      let bednumbers = data.beds;

      for (var i = 0; i < bednumbers.length; i++) {
        console.log("排班表床data.beds[i]", bednumbers[i]);
        // this.addbedtoproject(bednumbers[i],data.projectnumber)
        for (let j = 0; j < this.scheduleinfos.bed.length; j++) {
          const element = this.scheduleinfos.bed[j];
          console.log("排班表床element", element);
          if (element.number === bednumbers[i]) {
            console.log("排班表床", element.items);
            this.addbedtoproject(bednumbers[i], element.items)
              .then((res) => {
                this.showbedtoproject();
                console.log(res);
              })
              .catch((error) => {
                console.log(error);
              });
            break;
          }
        }
      }

      console.log("----------------华丽的分隔线----------------");
      // for
      // 1 this.scheduleinfos.bed
      // 2  data.beds
      // 3 for(data.beds){
      //
      //}
      // console.log("bednumber,data.projectnumber",bednumber,data.projectnumber);
      // this.addbedtoproject(bednumber,data.projectnumber)
      console.log("----------------华丽的分隔线----------------");
      this.showbedtoproject();

      this.closeDialog();
    },
    //点击dialog增加项目
    openDialog(index, data) {
      console.log(index, data);
      this.dialogFormVisible = true;
      // console.log(data.name);
      this.bedform.bednumber = data.number;
      this.bedform.bedindex = index;

      this.bedform.projects = data.items;
      this.handleCheckedProjectsChange();
      console.log(this.bedform.bedindex);
    },
    openBedDialog(index, data) {
      console.log(index, data);//data为当前项目行的数据，
      this.dialogFormVisible2 = true;
      // console.log(data.name);
      this.projectform.projectnumber = data.number;
      this.projectform.projectindex = index;
      
      this.projectform.beds = data.items;
      console.log(555555,this.projectform.beds);
      
      this.handleCheckedProjectsChange2();
        
    },
    // 顶部增加床位 打开对话框
    openBedTopDialog() {
      this.dialogFormVisible2 = true;
      this.projectform = {
        projectnumber: "",
        beds: [],
        projectindex: -1,
      };
      console.log(this.projectform.projectindex);
      // this.handleCheckAllChange(false)
      this.checkAll = false;
      this.isIndeterminate = false;
      // console.log(data.name);
      // this.projectform.projectname = data.name
      // this.projectform.projectnumber = data.number
      // this.projectform.projectindex = index

      // this.projectform.beds = data.items
      // this.handleCheckedProjectsChange2()
    },
    // 顶部增加项目 打开对话框
    openTopDialog() {
      this.dialogFormVisible = true;
      this.bedform = {
        bednumber: "",
        projects: [],
        bedindex: -1,
      };
      // this.handleCheckAllChange(false)
      this.checkAll = false;
      this.isIndeterminate = false;
      // console.log(data.name);
      // this.projectform.projectname = data.name
      // this.projectform.projectnumber = data.number
      // this.projectform.projectindex = index

      // this.projectform.beds = data.items
      // this.handleCheckedProjectsChange2()
    },
    closeDialog() {
      //dialog关闭时触发的回调
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
    },
    //分页显示项目和病床--页码改变的时候
    pageChange(pageNumber) {
      console.log("pageNumber", pageNumber);
      this.showbedtoproject(pageNumber);
    },
    //显示项目和病床的关系
    showbedtoproject(page = 1) {
      let count = this.pageSize;
      console.log("page,count,areaid", page, count, areaid);
      let showbedtoprojectoptions = api
        .showbedtoprojectApi(page, -1, 0, areaid)
        .then((res) => {
          // console.log(res.data);
          let showbedtoproject = this.$x2js.xml2js(res.data);
          console.log("showbedtoproject", showbedtoproject);
          this.pageNumber = page;
          console.log(showbedtoproject.Response.Data);
          if (showbedtoproject.Response.Data == "") {
            showbedtoproject.Response.Data = {
              Bed: [],
            };
          }
          if (showbedtoproject.Response && showbedtoproject.Response.Data) {
            console.log(
              "showbedtoproject"
              // showbedtoproject.Response.Data.Bed[0].Amount
            );
            console.log(showbedtoproject.Response.Data.Bed);
            console.log(util.objtoArr(showbedtoproject.Response.Data.Bed));
            showbedtoproject.Response.Data.Bed = util.objtoArr(
              showbedtoproject.Response.Data.Bed
            );

            if (showbedtoproject.Response.Data.Bed.length > 0) {
              this.total = Number(showbedtoproject.Response.Data.Bed[0].Amount);
              this.topStatisticValue = this.total;
            } else {
              console.log(showbedtoproject.Response.Data.Bed.length);
              if (showbedtoproject.Response.Data.Bed.length == 0) {
                this.total = 0;
              } else {
                this.total = Number(
                  showbedtoproject.Response.Data.Bed[0].Amount
                );
                this.topStatisticValue = this.total;
              }
              // this.total = Number(showbedtoproject.Response.Data.Bed.Amount);
            }
            console.log("this.pageNumber", this.pageNumber, this.total);
            let showbedproject = showbedtoproject.Response.Data.Bed;
            console.log("showbedproject", showbedproject);

            let bedinfos = [];
            for (let i = 0; i < showbedproject.length; i++) {
              const element = showbedproject[i];
              console.log("showbedproject-element", element);
              if (element.ItemCode === "") continue;

              let bednumber = "bed_" + element.BedId;
              let bedname = element.Name + "床";
              let itemcode = [];
              if (element.ExamItems.length == 0) {
                continue;
              }
              if (element.ExamItems && element.ExamItems.ExamItem) {
                let itemcodesArray = element.ExamItems.ExamItem;
                if (itemcodesArray.constructor == Object) {
                  itemcodesArray = [itemcodesArray];
                }
                console.log(
                  "itemc+++++++++++++odesArray",
                  itemcodesArray.constructor,
                  bedname
                );
                for (let j = 0; j < itemcodesArray.length; j++) {
                  let itemcodes = itemcodesArray[j].ItemCode;
                  let itemnames = itemcodesArray[j].ItemName;
                  console.log("itemcodesArray[j]", itemcodesArray[j], bedname);
                  itemcode.push(itemcodes);
                }
              }
              console.log(
                "showbedproject-itemcode",
                itemcode,
                "bedname",
                bedname
              );
              let items = [];
              for (let j = 0; j < itemcode.length; j++) {
                if (itemcode[j]) {
                  items.push("item_" + itemcode[j]);
                }
              }

              console.log(itemcode, "items", items);
              bedinfos.push({
                number: bednumber,
                name: bedname,
                items: items,
              });
            }
            console.log("bedinfos", bedinfos);
            // this.bedinfos = bedinfos;
            this.scheduleinfos.bed = bedinfos;
            this.bedtabledata = bedinfos;
            this.reformatdata();
            // console.log("bedinfos",bedinfos);
          }
        });
    },
    //新建项目床位关系
    addbedtoproject(bednumber, projectnumbers = []) {
      console.log(bednumber, projectnumbers, areaid);
      return new Promise((resolve, reject) => {
        console.log(bednumber, projectnumbers, areaid);
        // let projectnumbers =
        let itemcode = "";
        for (var i = 0; i < projectnumbers.length; i++) {
          itemcode += this.projectinfos[projectnumbers[i]].ItemCode + "+";
        }
        console.log("itemcode", itemcode);
        itemcode = itemcode.slice(0, itemcode.length - 1);
        console.log(this.bedinfos[bednumber]);
        let bedid = this.bedinfos[bednumber].BedId;
        console.log("bedid", bedid);
        // let itemcode = this.projectinfos[projectnumber].ItemCode
        // console.log(itemcode);
        let bedtoprojections = api
          .addbedtoprojectApi(bedid, itemcode, areaid)
          .then((res) => {
            // console.log(res);
            let bedtoproject = this.$x2js.xml2js(res.data);
            console.log(bedtoproject);

            resolve(bednumber, (projectnumbers = []));
          })
          .catch(() => {
            reject();
          });
      });
    },
    //获取项目
    getProjects(count = -1, page = 1, ) {
      console.log(count, page, areaid);
      let itemOptions = api.getprojectsApi(count, page, areaid).then((res) => {
        // console.log(res.data);
        let projects = this.$x2js.xml2js(res.data);
        console.log("projects", projects);
        if (
          projects.Response &&
          projects.Response.Data &&
          projects.Response.Data.ExamItem &&
          projects.Response.Data.ExamItem.Dict
        ) {
          let remoteprojectinfos = projects.Response.Data.ExamItem.Dict;
          console.log("remoteprojectinfos:", remoteprojectinfos);
          let projectinfos = {};
          for (let i = 0; i < remoteprojectinfos.length; i++) {
            const element = remoteprojectinfos[i];
            // console.log(element);
            // console.log("element.ItemCode",element.ItemCode);
            let projectnumber = "item_" + element.ItemCode;
            let projectname = element.ItemName;
            projectinfos[projectnumber] = {
              name: projectname,
              ItemCode: element.ItemCode,
              RowNum: element.RowNum,
              Memo: element.Memo,
              Amount: element.Amount,
            };
          }
          console.log("this.projectinfos", this.projectinfos);
          this.projectinfos = projectinfos;
          console.log("this.projectinfos", this.projectinfos);
        }
        // let projs = projects.Response.Data.ExamItem.Dict;
        // console.log(projs);
        // this.scheduleinfos.project = projs;
        // this.total = Number(projs[0].Amount);
        // this.pageNumber = count;
      });
    },
    //获取床位
    getBeds() {
      console.log(11111111111111111111111111111111111);
      let bedOptionss = api.getbedsApi(areaid).then(async (res) => {
        // let beds = res.data
        // xml转json
        let beds = this.$x2js.xml2js(res.data);
        console.log(beds);
        if (
          beds.Response &&
          beds.Response.Data &&
          beds.Response.Data.AreaBed &&
          beds.Response.Data.AreaBed.Bed
        ) {
          let remotebedinfos = beds.Response.Data.AreaBed.Bed;
          console.log("remotebedinfos:", remotebedinfos);
          let bedinfos = {};
          // this.bedinfos=
          for (let i = 0; i < remotebedinfos.length; i++) {
            const element = remotebedinfos[i];
            // console.log("bedid element",element);
            let bednumber = "bed_" + element.BedId;
            // console.log("bedid bednumber:", bednumber);
            let bedname = element.Name + "床";
            bedinfos[bednumber] = {
              name: bedname,
              Name: element.Name,
              BedId: element.BedId,
            };
          }
          console.log("bedinfos", bedinfos);
          this.bedinfos = bedinfos;
        }

        // let bedss = beds.Response.Data.AreaBed.Bed;
        // console.log(bedss);
        // this.scheduleinfos.bed2 = bedss;
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //表格删除行 index第几行 rows：index行的数据 itemindex：index行第几个项目/床 type：表格类型
    deleteRowOrArray(index, rows, itemindex = -1, type = "bed") {
      console.log(index, rows, itemindex, type);
      console.log(rows[index].number);
      let _this = this;
      let deleteSingleitem =
        type == "bed"
          ? "该操作将清空本床位所有项目，是否继续"
          : "该操作将清空本项目所有床位，是否继续";
      if (itemindex >= 0) {
        deleteSingleitem =
          type == "bed"
            ? "该操作将删除该项目，是否继续"
            : "该操作将删除该床位，是否继续";
      }
      this.$confirm(deleteSingleitem, "删除提示")
        .then(() => {
          let delbeds = {};
          if (type == "bed") {
            itemindex >= 0 && rows[index].items.splice(itemindex, 1);
            let projectnumbers = itemindex >= 0 ? rows[index].items : [];
            delbeds[rows[index].number] = projectnumbers;
          } else {
            let projectnumber = rows[index].number;
            //bednumbers要删除的床位
            let bednumbers =
              itemindex >= 0
                ? [rows[index]["items"][itemindex]]
                : rows[index]["items"];
            for (let i = 0; i < bednumbers.length; i++) {
              // this.scheduleinfos.bed 排班信息里的床位
              for (let j = 0; j < this.scheduleinfos.bed.length; j++) {
                const element = this.scheduleinfos.bed[j];
                if (element.number === bednumbers[i]) {
                  let projectindex = element.items.indexOf(projectnumber);
                  element.items.splice(projectindex, 1);
                  //delbeds[bednumbers[i]] 床位里剩下的项目
                  delbeds[bednumbers[i]] = element.items;
                  break;
                }
              }
            }
          }
          console.log("delbeds:", delbeds);
          let delreqsts = [];
          for (const bednumber in delbeds) {
            if (Object.hasOwnProperty.call(delbeds, bednumber)) {
              delreqsts.push(_this.addbedtoproject(bednumber, delbeds[bednumber]));
            }
          }
          Promise.all(delreqsts).then((res) => {
            console.log("delbeds all: ", res);
            _this.showbedtoproject();
          });
        })
        .catch(() => {});
    },
    // 根据床位数据或者排版数据，重新定义另外一个数据
    reformatdata(type = "bed") {
      console.log("----------------华丽的分隔线----------------");
      //删除床位中项目信息，同时改变项目中床位信息
      if (type === "bed") {
        //获取当前床位表格中所有项目床位关系
        //projectHasBeds项目中有多少张床
        let projectHasBeds = {};
        console.log("this.scheduleinfos.bed", this.scheduleinfos.bed);
        for (let bi = 0; bi < this.scheduleinfos.bed.length; bi++) {
          const bedelement = this.scheduleinfos.bed[bi];
          // console.log("bedelement:",bedelement);
          for (let pi = 0; pi < bedelement["items"].length; pi++) {
            const projectelement = bedelement["items"][pi];
            // console.log("projectelement:",projectelement);
            if (!projectHasBeds[projectelement]) {
              projectHasBeds[projectelement] = [];
            }
            if (projectHasBeds[projectelement].indexOf(bedelement["number"]) < 0) {
              projectHasBeds[projectelement].push(bedelement["number"]);
            }
          }
        }
        console.log("projectHasBeds:", projectHasBeds);
        // 将更新好的项目床位信息更新到项目表格
        let projects = [];
        for (const key in projectHasBeds) {
          if (Object.hasOwnProperty.call(projectHasBeds, key)) {
            const beds = projectHasBeds[key];
            if (beds.length && this.projectinfos[key]) {
              projects.push({
                name: this.projectinfos[key]["name"],
                number: key,
                items: beds,
              });
            }
          }
        }
        this.scheduleinfos.project = projects;
        console.log("projects:", projects);
        console.log(
          "this.scheduleinfos.bed",
          this.scheduleinfos.bed,
          this.scheduleinfos.project
        );
        console.log("this.projectinfos", this.projectinfos, this.bedinfos);
      } else {
        //获取当前项目表格中所有项目床位关系
        //projectHasBeds 床含有多少项目
        let projectHasBeds = {};
        for (let bi = 0; bi < this.scheduleinfos.project.length; bi++) {
          const projectelement = this.scheduleinfos.project[bi];
          // console.log("bedelement:",bedelement);
          for (let pi = 0; pi < projectelement["items"].length; pi++) {
            const bedelement = projectelement["items"][pi];
            // console.log("projectelement:", projectelement);
            if (!projectHasBeds[bedelement]) {
              projectHasBeds[bedelement] = [];
            }
            if ( projectHasBeds[bedelement].indexOf(projectelement["number"]) < 0) {
              projectHasBeds[bedelement].push(projectelement["number"]);
            }
          }
        }
        console.log("projectHasBeds:", projectHasBeds);
        // 将更新好的项目床位信息更新到项目表格
        let beds = [];
        for (const key in projectHasBeds) {
          if (Object.hasOwnProperty.call(projectHasBeds, key)) {
            const projects = projectHasBeds[key];
            if (projects.length && this.bedinfos[key]) {
              beds.push({
                name: this.bedinfos[key]["name"],
                number: key,
                items: projects,
              });
            }
          }
        }
        this.scheduleinfos.bed = beds;
        this.bedtabledata = beds;
        console.log("beds:", beds);
      }
    },
  },
};
</script>
<style lang="less">

.schdule {
  overflow: hidden;
}
.el-table{
  overflow-y: scroll;
  
}
.cell {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.el-tag--dark.el-tag--success {
  margin: 10px;
  // border-radius: 10px;
}
.bedManager {
  text-align: left;
  margin-bottom: 10px;
}
.topaddproject {
  margin-bottom: 16px;
}
.pane-tab {
  text-align: center;
}
.el-input__icon:hover {
  color: red;
}
.selectproject {
  height: 240px;
  overflow-y: scroll;
}
</style>
