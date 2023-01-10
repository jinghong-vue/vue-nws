<template>
  <div class="projectManager">
    <!-- 顶部增加项目 -->
    <el-button type="primary" class="topaddproject" @click="openDialog('add')">
      增加项目</el-button
    >
    <!-- 删除选中项目 -->
    <el-button
      type="danger"
      @click="deleteSelections()"
      :disabled="multipleSelection.length == 0"
      >删除选择</el-button
    >

    <!-- table -->

    <el-table
      :data="projectinfos.projects"
      style="width: 100%; height: calc(100vh - 153px)"
      @selection-change="handleSelectionChange"
      border
      stripe
    >
      <el-table-column type="selection" :selectable="selectable" width="55">
      </el-table-column>
      <el-table-column
        prop="ItemName"
        label="项目名称"
        width="150"
        align="center"
      >
        <!-- sortable
        :sort-by="sortby" -->
      </el-table-column>
      <el-table-column label="项目代码" prop="ItemCode" align="center">
      </el-table-column>
      <!-- <el-table-column label="是否有病床" prop="IsDel" align="center">
      </el-table-column> -->
      <el-table-column label="排序值" prop="RowNum" align="center">
      </el-table-column>
      <!-- <el-table-column label="排序" prop="SerialNo" align="center">
      </el-table-column> -->
      <el-table-column label="操作" width="280" align="center">
        <!-- <template slot="header" slot-scope="scope">
          <el-input
            v-model="header_search"
            size="mini"
            placeholder="输入项目关键字搜索"
          />
        </template> -->
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              openDialog(scope.$index, projectinfos.projects, 'edit')
            "
            :disabled="false"
            type="success"
            size="small"
          >
            编辑
          </el-button>
          <el-button
            @click.native.prevent="
              deleteRow(scope.$index, projectinfos.projects)
            "
            :disabled="false"
            type="danger"
            size="small"
          >
            删除
          </el-button>
          <div class="handle">
            <div>
              <el-button
                class="handlebutton"
                icon="el-icon-arrow-up"
                @click="moveUpHandle(scope.$index, projectinfos.projects)"
              ></el-button>
            </div>
            <div>
              <el-button
                class="handlebutton"
                icon="el-icon-arrow-down"
                @click="moveDownHandle(scope.$index, projectinfos.projects)"
              ></el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="pagination"
      background
      @current-change="pageChange"
      layout="prev, pager, next"
      :total="total"
      :pageSize="pageSize"
    >
    </el-pagination> -->

    <!-- 对话框 -->
    <el-dialog
      ref="addOrEditdialog"
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="projectform">
        <el-button
          icon="el-icon-edit"
          @click="changeShow"
          class="togglebutton"
          v-show="isToggleShow"
          >切换模式</el-button
        >
        <el-form-item
          label="项目名称"
          :label-width="formLabelWidth"
          v-show="isInputShow"
        >
          <el-input
            class="forminput"
            placeholder="请输入项目名称"
            v-model.trim="dialoginput"
            @change="formInputChange"
            :disabled="inputDisabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="排序" :label-width="formLabelWidth" v-show="cate=='edit'">
          <el-input
            class="sortinput"
            placeholder="请输入排序数值"
            v-model.trim="dialoginputsort"
            @change="sortInputChange"
            :disabled="inputDisabled"
            clearable
          >
          </el-input>
        </el-form-item> -->
        <el-form-item
          label="选择项目"
          :label-width="formLabelWidth"
          class="selectproject"
          v-show="isSelectShow"
          ref="selectForm"
        >
          <!-- <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          > -->
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="projectform.projects"
            @change="handleCheckedProjectsChange"
          >
            <el-checkbox
              v-for="(project, key) in allprojectinfos.allprojects"
              :label="key"
              >{{ project.ItemName }}</el-checkbox
            >
            <!-- }}<br />所属区域:{{ project.AreaIds }}</el-checkbox> -->
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(cate)">取 消</el-button>
        <el-button
          type="primary"
          @click="confrimAddProject()"
          :disabled="dialoginput == '' && checkedCount == 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/users.js";
import util from "@/common/util";

let userinfo = JSON.parse(localStorage.getItem("userinfo"));
let user = userinfo.Response.Data.User;
console.log(user); //用户信息
let areaid = userinfo.Response.Data.User.Area.AreaId;
console.log(areaid); //区域id

export default {
  data() {
    return {
      isSelectShow: true,
      isInputShow: false,
      isToggleShow: true,
      sortby: ["IsDel", "RowNum"],
      total: 0, //项目总条数
      // pageSize: 5, //项目分页每页数
      pageSize: -1, //项目分页每页数
      checkAll: false, //项目全选
      checkedCount: 0, //选中的个数
      isIndeterminate: true, //checkbox 的不确定状态，用于实现全选的效果
      header_search: "", //表格顶部_搜索
      topdeleteEnable: true, //表格顶部删除可用
      dialogTitle: "", //对话框标题
      cate: "", //dialog增加还是编辑
      dialogFormVisible: false, //对话框显示
      formLabelWidth: "120px", //对话框表单宽度
      dialoginput: "", //添加项目对话框输入
      inputDisabled: false, //对话框输入框的可选
      itemid: "", //项目id
      memo: "", //备注
      multipleSelection: [], //表格左侧多选
      pageNumber: 1, //分页第几页
      isdel: 0, //0表示不能删除(排班信息中有该项目)，1表示可以删除
      //本病区所有项目的信息
      projectinfos: {
        projects: [],
      },
      //所有病区的所有项目
      allprojectinfos: {
        allprojects: [],
      },
      //对话框表单信息
      projectform: {
        projectname: "",
        projects: [],
      },
      checkedProjectsId: [], //选中的项目id数组
    };
  },
  mounted() {
    // 获取本病区项目
    this.getProjects();

    //获取所有病区的项目
    this.getAllProjects();

    console.log(22222222222222222);
  },
  methods: {
    //更换添加方式
    changeShow() {
      this.isSelectShow = !this.isSelectShow;
      this.dialoginput = "";
      this.isInputShow = !this.isInputShow;
      this.projectform.projects = [];
    },
    //增加项目_多选框选中的项目变化
    handleCheckedProjectsChange() {
      // let xunhuanlis = Object.keys(this.allprojectinfos).length;
      console.log(this.projectform.projects);
      let checkedCount = this.projectform.projects.length;
      this.checkedCount = checkedCount;
      let checkedProjectsId = [];
      for (let i = 0; i < this.projectform.projects.length; i++) {
        const element = this.projectform.projects[i];
        console.log(
          "选中的项目名称",
          this.allprojectinfos.allprojects[this.projectform.projects[i]]
            ?.ItemName
        );
        console.log(
          "选中的项目id",
          this.allprojectinfos.allprojects[this.projectform.projects[i]]
            ?.ItemCode
        );
        checkedProjectsId.push(
          this.allprojectinfos.allprojects[element]?.ItemCode
        );
      }
      console.log("选中的项目个数", checkedCount);
      console.log("选中的id数组", checkedProjectsId);
      this.checkedProjectsId = checkedProjectsId;
    },
    //项目维护页面 排序 函数
    sortProjects(itemcodesArray) {
      return new Promise((resolve, reject) => {
        console.log(itemcodesArray);

        let sortProjects = api
          .sortProjectsApi(itemcodesArray, areaid)
          .then((res) => {
            // console.log(res.data);
            let sortProjects = this.$x2js.xml2js(res.data);
            console.log(sortProjects);
            resolve(itemcodesArray);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 表格行向上移动 // number1是当前行的ItemCode number2是上一行的ItemCode
    moveUpHandle(index, rows) {
      console.log(index, rows);
      let itemcodes = [];
      for (let i = 0; i < rows.length; i++) {
        itemcodes.push(rows[i]["ItemCode"]);
      }
      console.log(itemcodes);
      if (index > 0) {
        //表格向上移
        // const param = {}
        // param.number1 = rows[index].ItemCode
        // param.number2 = this.projectinfos.projects[index - 1].ItemCode
        // this.projectinfos.projects[index - 1].ItemCode = param.number1
        // rows[index].ItemCode = param.number2
        // const up = this.projectinfos.projects[index - 1]
        // this.projectinfos.projects.splice(index - 1, 1)
        // this.projectinfos.projects.splice(index, 0, up)
        let middle = "";
        middle = itemcodes[index];
        itemcodes[index] = itemcodes[index - 1];
        itemcodes[index - 1] = middle;

        itemcodes = itemcodes.join("+");
        console.log(itemcodes);
        //获取调整后的排序 并调用排序接口
        // console.log(index,rows);
        // let itemcodes = ''
        // for (let i = 0; i < rows.length; i++) {
        //   const element = rows[i]['ItemCode'];
        //   itemcodes += rows[i]['ItemCode'] + "+"
        // }
        // itemcodes = itemcodes.slice(0,itemcodes.length - 1)
        // console.log(itemcodes);
        //调用排序函数
        this.sortProjects(itemcodes)
          .then((res) => {
            console.log(res);
            this.getProjects();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message({
          type: "info",
          message: "已经是第一行，不可上移",
        });
      }
    },
    // 表格行向下移动 // number1是当前行的ItemCode number2是上一行的ItemCode
    moveDownHandle(index, rows) {
      // console.log(index,rows);
      console.log(index, rows);
      //1.获取所有项目的itemcode
      let itemcodes = [];
      for (let i = 0; i < rows.length; i++) {
        itemcodes.push(rows[i]["ItemCode"]);
      }
      console.log(itemcodes);

      if (index + 1 === this.projectinfos.projects.length) {
        this.$message({
          type: "info",
          message: "已经是最后一行，不可下移",
        });
      } else {
        //表格向下移
        // const param = {}
        // param.number1 = rows[index].ItemCode
        // param.number2 = this.projectinfos.projects[index + 1].ItemCode
        // this.projectinfos.projects[index + 1].ItemCode = param.number1
        // rows[index].ItemCode = param.number2
        // const down = this.projectinfos.projects[index + 1]
        // this.projectinfos.projects.splice(index + 1, 1)
        // this.projectinfos.projects.splice(index, 0, down)

        //获取调整后的排序 并调用排序接口
        // console.log(index,rows);
        // let itemcodes = ''
        // for (let i = 0; i < rows.length; i++) {
        //   const element = rows[i]['ItemCode'];
        //   itemcodes += rows[i]['ItemCode'] + "+"
        // }
        // itemcodes = itemcodes.slice(0,itemcodes.length - 1)
        // console.log(itemcodes);

        let middle = ""; //2.根据下移交换itemcode
        middle = itemcodes[index];
        itemcodes[index] = itemcodes[index + 1];
        itemcodes[index + 1] = middle;

        itemcodes = itemcodes.join("+");
        console.log(itemcodes);

        //调用排序函数
        this.sortProjects(itemcodes)
          .then((res) => {
            console.log(res);
            this.getProjects();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /** 根据传入的字段进行排序
     * @param arr 需要排序的数组
     * @param property 排序的字段
     * @param desc true.升序 false.降序
     * @returns {*} 排好序后的数组
     */
    abilitySort(arr, property, desc) {
      return arr.sort(function (a, b) {
        const val1 = a[property];
        const val2 = b[property];
        if (desc) {
          return val1 - val2; // 升序排列
        } else {
          return val2 - val1; // 降序排列
        }
      });
    },

    // 编辑项目
    EditRow(index, rows) {
      console.log(index, rows);
    },
    //表格排序
    sortChange(column) {
      //column：当前列的信息//order：排序的规则（升序、降序和默认[默认就是没排序]//prop：当前列需要排序的数据
      console.log(column);
    },
    //复选框禁用
    selectable(row, rowIndex) {
      // console.log(row,rowIndex);
      //只有IsDel == 1不被禁用
      // if (row.IsDel == 1) {
      return true; //不禁用
      // } else {
      //   return false; //禁用
      // }
    },
    //左侧多选改变值时
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("val", val);
    },
    //删除函数
    shanchu(itemid) {
      return api.rmoveprojectsApi(itemid, areaid).then((res) => {
        console.log(res);
      });
    },
    //表格上方多选删除所选床位
    deleteSelections() {
      console.log(this.multipleSelection);
      console.log(this.projectinfos.projects);
      let selections = this.multipleSelection;
      console.log(this.pageNumber);
      let promisearr = [];
      // this.$confirm("确定要删除所选的行吗", "删除提示").then(()=>{

      this.$confirm("确定要删除所选的行吗", "删除提示")
        .then(async () => {
          for (let i = 0; i < selections.length; i++) {
            const element = selections[i];
            console.log(element.ItemCode);
            let itemid = element.ItemCode;
            console.log(itemid);
            // let rmarr = []
            // rmarr.push(itemid)
            // this.deleteRow(itemid,areaid)
            //移除关系
            console.log(itemid, areaid, "1");
            this.buildRelationships(itemid, areaid, "1")
              .then((res) => {
                console.log(res);
              })
              .catch((error) => {
                console.log(error);
              });
            let topremove = await this.shanchu(itemid, areaid);
          }
          this.getProjects(5, this.pageNumber);
          // Promise.all(promisearr).then(res => {
          //     console.log(res);

          // })
          // for (let i = 0; i < selections.length; i++) {
          //     const element = selections[i];
          //     console.log(element.ItemCode);
          //     let itemid = element.ItemCode
          //     console.log(itemid);
          //     let rmarr = []
          //     rmarr.push(itemid)
          //     // this.deleteRow(itemid,areaid)
          //     let topremove = api.rmoveprojectsApi(itemid,areaid)
          //     promisearr.push(topremove)
          // }
          // Promise.all(promisearr).then(res => {
          //     console.log(res);
          //     this.getProjects(5,this.pageNumber);

          // })
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
    //表格删除项目行
    deleteRow(index, rows) {
      console.log(index, rows);
      let itemid = rows[index].ItemCode;
      let itemname = rows[index].ItemName;
      console.log(itemid, itemname);
      console.log(this.pageNumber);
      this.$confirm(`确定要删除 ${itemname} 项目吗`, "删除提示")
        .then(() => {
          let removeprojects = api
            .rmoveprojectsApi(itemid, areaid)
            .then((res) => {
              // console.log(res.data);
              let rmprojects = this.$x2js.xml2js(res.data);
              console.log(rmprojects);

              //移除关系
              console.log(itemid, areaid, "1");
              this.buildRelationships(itemid, areaid, "1")
                .then((res) => {
                  console.log(res);
                  this.getProjects(5, this.pageNumber);
                  this.$message.success("删除成功");
                })
                .catch((error) => {
                  console.log(error);
                });
            });
        })
        .catch(() => {
          this.$message.error("已取消删除");
        });
    },
    //顶部增加项目 打开对话框
    openDialog(index, rows, cate = "add") {
      this.isToggleShow = true;
      this.dialoginput = "";
      this.dialoginputsort = "";
      console.log(index, rows, cate);
      this.cate = cate;
      if (cate == "add") {
        this.itemid = ''
        this.dialogTitle = "增加项目";
        this.inputDisabled = false;
      } else {
        this.isToggleShow = false;
        this.isInputShow = true;
        this.isSelectShow = false;
        this.dialogTitle = "编辑项目";
        // this.inputDisabled = true
        this.dialoginput = rows[index].ItemName;
        console.log(this.dialoginput);
        this.itemid = rows[index].ItemCode;
        console.log(this.itemid);
      }
      this.dialogFormVisible = true;
      console.log("----------------华丽的分隔线----------------");
    },
    //获取本病区项目
    getProjects(count = -1, page = 1) {
      count = this.pageSize;
      console.log(areaid);
      console.log(count, page, areaid);
      let itemOptions = api.getprojectsApi(count, page, areaid).then((res) => {
        // console.log(res.data);
        // util.xml2json(res.data,['ExamItem'])
        let projects = this.$x2js.xml2js(res.data);
        console.log("projects", projects);
        if (
          projects.Response &&
          projects.Response.Data &&
          projects.Response.Data.ExamItem &&
          projects.Response.Data.ExamItem.Dict
        ) {
          let remoteprojectinfos = projects.Response.Data.ExamItem.Dict;
          for (let i = 0; i < remoteprojectinfos.length; i++) {
            // remoteprojectinfos[i]["IsDel"] = Number(
            //   remoteprojectinfos[i]["IsDel"]
            // );
            remoteprojectinfos[i]["RowNum"] = Number(
              remoteprojectinfos[i]["RowNum"]
            );
            remoteprojectinfos[i]["SerialNo"] = Number(
              remoteprojectinfos[i]["SerialNo"]
            );
          }
          // this.abilitySort(remoteprojectinfos, "RowNum", true);
          // this.abilitySort(remoteprojectinfos, "IsDel", true);
          console.log("remoteprojectinfos:", remoteprojectinfos);
          this.projectinfos.projects = remoteprojectinfos;
          console.log(this.projectinfos.projects);

          let newprojects = [];
          if (Array.isArray(this.projectinfos.projects)) {
            this.total = Number(this.projectinfos.projects[0].Amount);
            console.log(this.total);
          } else {
            newprojects.push(this.projectinfos.projects);
            console.log(newprojects);
            this.projectinfos.projects = newprojects;
            this.total = Number(this.projectinfos.projects[0].Amount);
            console.log(this.total);
          }
        }
      });
    },
    //获取所有病区的项目
    getAllProjects(count = -1, page = 1, areaid = "") {
      count = this.pageSize;
      console.log(areaid);
      console.log(count, page, areaid);
      let itemOptions = api.getprojectsApi(count, page, areaid).then((res) => {
        // console.log(res.data);
        // util.xml2json(res.data,['ExamItem'])
        let projects = this.$x2js.xml2js(res.data);
        console.log("projects", projects);
        if (
          projects.Response &&
          projects.Response.Data &&
          projects.Response.Data.ExamItem &&
          projects.Response.Data.ExamItem.Dict
        ) {
          let remoteprojectinfos = projects.Response.Data.ExamItem.Dict;
          for (let i = 0; i < remoteprojectinfos.length; i++) {
            // remoteprojectinfos[i]["IsDel"] = Number(
            //   remoteprojectinfos[i]["IsDel"]
            // );
            remoteprojectinfos[i]["RowNum"] = Number(
              remoteprojectinfos[i]["RowNum"]
            );
            remoteprojectinfos[i]["SerialNo"] = Number(
              remoteprojectinfos[i]["SerialNo"]
            );
          }
          // this.abilitySort(remoteprojectinfos, "RowNum", true);
          // this.abilitySort(remoteprojectinfos, "IsDel", true);
          console.log("remoteprojectinfos:", remoteprojectinfos);
          this.allprojectinfos.allprojects = remoteprojectinfos;
          console.log(this.allprojectinfos.allprojects);

          let newprojects = [];
          if (Array.isArray(this.allprojectinfos.allprojects)) {
            this.total = Number(this.allprojectinfos.allprojects[0].Amount);
            console.log(this.total);
          } else {
            newprojects.push(this.allprojectinfos.allprojects);
            console.log(newprojects);
            this.allprojectinfos.allprojects = newprojects;
            this.total = Number(this.allprojectinfos.allprojects[0].Amount);
            console.log(this.total);
          }
        }
      });
    },
    //分页显示项目和病床--页码改变的时候
    pageChange(pageNumber) {
      console.log("pageNumber", pageNumber);
      this.pageNumber = pageNumber;
      this.getProjects(5, pageNumber);
    },
    closeDialog(cate) {
      console.log(cate);
      if (cate == "add") {
        console.log("添加");
        this.isSelectShow = true;
        this.isInputShow = false;
        this.dialoginput = "";
        this.projectform.projects = [];
      } else {
        console.log("编辑");
        this.isSelectShow = false;
        this.isInputShow = true;
      }
      // cate = '天'
      cate == "add" ? (cate = "添加") : (cate = "编辑");

      //dialog关闭时触发的回调
      this.dialogFormVisible = false;
      this.$message.error(`已取消${cate}`);
    },
    formInputChange(val) {
      console.log(val.length);
      this.dialoginput = val;
    },
    sortInputChange(val) {
      console.log(val);
      this.dialoginputsort = val;
    },
    // 确定增加项目
    confrimAddProject() {
      // let itemid=Math.random().toString(36).substring(2)
      // let memo = this.memo
      console.log(this.cate);
      let itemid = this.itemid;
      let memo = this.memo;
      let flag = true;
      console.log(this.pageNumber, itemid, memo);
      // if (this.cate == "add") {
        if (this.isInputShow == true) {
          //如果是输入框增加项目模式
          console.log("输入框增加项目模式");
          console.log((itemid = ""), this.dialoginput, (memo = "1"), areaid);

          // this.addProjects( "", this.dialoginput.toString(),  '1', areaid)
          // .then(() => {
          //   console.log(111111111111111111111111111);
          //   this.dialogFormVisible = false;
          //   this.dialoginput = "";
          //   this.getProjects(5, this.pageNumber);
          //   this.$message.success("添加成功");
          // })
          // .catch((error) => {
          //   this.dialogFormVisible = false;
          //   this.dialoginput = "";
          //   console.log(error);
          // })
          api
            .addprojectsApi(itemid, this.dialoginput, "1", areaid)
            .then((res) => {
              console.log(res);
              // console.log(res.data);
              let newprojects = this.$x2js.xml2js(res.data);
              console.log(newprojects);
              if (newprojects.Response.Data != "") {
                console.log("成功");
                let itemid = newprojects.Response.Data;
                console.log(itemid);
                //建立关系
                this.buildRelationships(itemid, areaid)
                  .then((res) => {
                    console.log(res);
                    this.dialoginput=''
                    this.dialogFormVisible = false
                    this.getProjects();
                    this.getAllProjects()
                    this.$message.success("添加成功");
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                this.$message.error("添加失败");
                this.dialogFormVisible = false;
                 this.dialoginput = "";
              }
              console.log(1111111111111111111111111111111111111111);

            })
            .catch((error) => {
   
              console.log(error);
            });
          // .then(()=>{
          //   console.log('成功');
          // })
          // .catch((error) => {
          //   console.log(error);
          // });
        } else {
          //如果切换到多选框 增加项目模式,选择模式 需要调用建立关系的接口
          console.log("多选框增加项目模式");
          let itemcode = this.checkedProjectsId.join("+");
          console.log(itemcode);
          //建立关系
          this.buildRelationships(itemcode, areaid)
            .then(() => {
              this.getProjects();
            })
            .catch((error) => {
              console.log(error);
            });
          this.dialogFormVisible = false;
          this.projectform.projects = [];
        }
      // } else {
        console.log((itemid = ""), this.dialoginput, (memo = "1"), areaid);
        // this.addProjects(this.itemid, this.dialoginput.toString(), 1, areaid)
        // this.addProjects(this.itemid, this.dialoginput.toString(), 1, areaid)
        //   .then(() => {
        //     this.dialogFormVisible = false;
        //     this.dialoginput = "";
        //     this.getProjects(5, this.pageNumber);
        //     this.$message.success("添加成功");
        //   })
        //   .catch((error) => {
        //     this.dialogFormVisible = false;
        //     this.dialoginput = "";
        //     console.log("error", error);
        //   });

      // }
    },
    //增加项目
    addProjects(itemid, itemname, memo) {
      console.log(areaid);
      return new Promise((resolve, reject) => {
        let newProjects = api
          .addprojectsApi(itemid, itemname, memo, areaid)
          .then((res) => {
            console.log(res);
            // console.log(res.data);
            let newprojects = this.$x2js.xml2js(res.data);
            console.log(newprojects);
            if (newprojects.Response.Data != "") {
              console.log("成功");
              let itemid = newprojects.Response.Data;
              console.log(itemid);
              resolve(itemid, newProjects);
            } else {
              // console.log('重复');
              // console.log(newProjects.Response.Desc)
              // reject(this.$message.info('项目已存在'))
              console.log("重复");
              reject(newProjects);
              // throw new Error(newProjects)
            }
            console.log(1111111111111111111111111111111111111111);
            //建立关系
            this.buildRelationships(itemid, areaid)
              .then((res) => {
                console.log(res);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            reject(console.log(error));
          });
      });
      // .catch((error)=>{
      //   console.log(error);
      // })
      // return newProjects
    },
    //建立或移除关系 option: 0建立 1移除
    buildRelationships(itemid, areaid, option = 0) {
      return new Promise((resolve, reject) => {
        let builds = api
          .buildrelationsApi(itemid, areaid, option)
          .then((res) => {
            // console.log(res);
            let afterbuild = this.$x2js.xml2js(res.data);
            console.log(afterbuild);
            resolve(afterbuild);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>
<style lang="less">
.togglebutton {
  margin-bottom: 10px;
}
.el-table {
  overflow-y: scroll;
}
.projectManager {
  text-align: left;
  margin-bottom: 10px;
}
.topaddproject {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.handle {
  margin-left: 10px;
  .el-button {
    padding: 2px 10px;
  }
}
.selectproject {
  height: 240px;
  overflow-y: scroll;
}
</style>
