<template>
  <!-- <h1>值班编辑</h1> -->
  <div class="watch">
    <div class="select-class" ref="selectList">
      <el-form class="select-title">
        <el-form-item label="发布日期:">
          <el-date-picker
            v-model="scheduleform.date"
            type="date"
            placeholder="选择日期"
            @click="getDateAndArea"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="诊区名称:">
          <el-select
            v-model="scheduleform.treamentArea"
            @visible-change="selectVisibleAreasOrStation($event, 'areas')"
            placeholder="请选择"
          >
            <el-option
              :value="scheduleform.treamentOptions"
              :label="scheduleform.treamentOptions"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护士站:">
          <el-select
            v-model="scheduleform.nurseStation"
            @change="classChange"
            @visible-change="selectVisibleAreasOrStation($event, 'station')"
            placeholder="请选择"
          >
            <el-option
              :label="scheduleform.nurseOptions"
              :value="scheduleform.nurseOptions"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="select-title">
        <el-form-item label="一线医生:">
          <el-select
            v-model="scheduleform.doctors1_1"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="selectVisibleStaff($event, 'doctor')"
            @change="classChange($event, 'doctors1_1')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.doctorsList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一线医生:">
          <el-select
            v-model="scheduleform.doctors1_2"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="selectVisibleStaff($event, 'doctor')"
            @change="classChange($event, 'doctors1_2')"
            placeholder="请选择"
          >
            <el-option label="不设置医生" value=""> </el-option>
            <el-option
              v-for="item in scheduleform.doctorsList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二线医生:">
          <el-select
            v-model="scheduleform.doctors2_1"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="selectVisibleStaff($event, 'doctor')"
            @change="classChange($event, 'doctors2_1')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.doctorsList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三线医生:">
          <el-select
            v-model="scheduleform.doctors3_1"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="selectVisibleStaff($event, 'doctor')"
            @change="classChange($event, 'doctors3_1')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.doctorsList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form class="select-title">
        <el-form-item label="主责护士:">
          <el-select
            v-model="scheduleform.majornurse"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodNurses"
            @visible-change="selectVisibleStaff($event, 'nurses')"
            @change="classChange($event, 'majornurse')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.nursesList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小夜护士:">
          <el-select
            v-model="scheduleform.smallnightnurse"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodNurses"
            @visible-change="selectVisibleStaff($event, 'nurses')"
            @change="classChange($event, 'smallnightnurse')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.nursesList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大夜护士:">
          <el-select
            v-model="scheduleform.bignightnurse"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodNurses"
            @visible-change="selectVisibleStaff($event, 'nurses')"
            @change="classChange($event, 'bignightnurse')"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scheduleform.nursesList"
              :key="item.EmpNo"
              :label="item.Name"
              :value="item.EmpNo"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="select-title">
        <el-form-item label="一线呼机:">
          <el-input
            v-model.trim="scheduleform.firstBP"
            @change="inputChange($event, 'firstNum')"
            placeholder="请输入一线呼机"
          ></el-input>
        </el-form-item>
        <el-form-item label="二线呼机:">
          <el-input
            v-model.trim="scheduleform.secondBP"
            @change="inputChange($event, 'secondNum')"
            placeholder="请输入二线呼机"
          ></el-input>
        </el-form-item>

      </el-form>
    </div>
    <el-button
      type="primary"
      class="bingo"
      @click="confirmSubmitSchedule(scheduleform)"
      :disabled="scheduleform.publishconfirm"
      >确认发布</el-button
    >
  
    <!-- <transition enter-active-class="animate__animated animate__rubberBand" leave-active-class="animate__animated animate__tada">
      <div class="transcontainer" v-if="transflag">
          人的一生应该怎样度过
      </div>
    </transition>
    <el-button @click="transflag =! transflag">点击动画效果</el-button>
     -->
      <!-- <Modal :visible="modalFlag" @onOk="handleOk" @cancel="handleCancel">
        <template v-slot:title>
            <h1>充值提示123</h1>
        </template>
        <template v-slot:body>
            <h3>您正在充值7000000欢乐豆是否确定?</h3>
        </template>
      </Modal>
    <el-button @click="showModal">点击显示模态框</el-button> -->
  </div>
</template>

<script>
import * as api from "@/api/users.js";
import Modal from '@/components/Modal/index.vue'
import 'animate.css'

let userinfo = JSON.parse(localStorage.getItem("userinfo"));
console.log(userinfo);
let areaname = userinfo.Response.Data.User.Area.AreaName;
let areaid = userinfo.Response.Data.User.Area.AreaId;
let userid = userinfo.Response.Data.User.UserId;
console.log("areaname,areaid,userid", areaname, areaid, userid);

export default {
  data() {
    return {
      modalFlag: false, //
      transflag: false, //
      scheduleform: {
        date: "", //日期
        selectareaValue: "", //
        treamentArea: "", //诊区
        treamentOptions: "", //诊区下拉框选项
        nurseStation: "", //护士站
        nurseOptions: "", //护士站下拉框选项
        doctors1_1: "", //一线医生1
        // doctors1_1: {}, //一线医生1
        doctors1_2: "", //一线医生2
        doctors2_1: "", //二线医生
        doctors3_1: "", //三线医生
        doctorsList: [], //医生列表
        majornurse: "", //主责护士
        smallnightnurse: "", //小夜护士
        bignightnurse: "", //大夜护士
        nursesList: [], //护士列表
        selectLoading: true,
        firstBP: "", //一线呼机电话
        firstBPoptions: "", //一线呼机下拉框选项
        secondBP: "", //二线呼机电话
        secondBPoptions: "", //二线呼机下拉框选项
        firstOrSecondBP: "",
        searchDoctorsValue: "", //医生下拉框搜索值
        searchNursesValue: "", //护士下拉框搜索值
        publishconfirm: true,
      },
    };
  },
  mounted() {
    //获取日期 及 初始病区和护士站
    this.getDateAndArea();
    //获取区域呼机
    this.getAreaBP(0);
    this.getAreaBP(1);
    //获取所有职工
    this.getAllStaff(); //默认获取所有医生
    this.getAllStaff(2); //获取所有护士
    //获取区域值班人员
    this.getOndutyStaff();
  },
  components: {
    Modal
  },
  methods: {
    //展示模态框
    showModal(){
      this.modalFlag = true;
    },
    handleOk(){
      this.modalFlag = false;
      console.log('确定了');
    },
    handleCancel(){
      this.modalFlag = false
      console.log('取消了');
    },
    // 确定提交值班信息(值班人员＋呼机电话)
    confirmSubmitSchedule(data) {
      console.log(data);
      //1.提交修改呼机电话
      console.log(data.firstBP, data.secondBP);
      let bpnumbers = [
        { cate: 0, number: data.firstBP },
        { cate: 1, number: data.secondBP },
      ];
      this.$confirm("确定要发布新的值班信息吗", "发布信息").then(() => {

        api.changeBPApi(areaid, bpnumbers, userid)
          .then((res) => {
            // console.log(res);
            let newBP = this.$x2js.xml2js(res.data);
            console.log(newBP);

            //2.提交修改值班医生和护士
            console.log(
              "修改后的医生:",
              data.doctors1_1,
              data.doctors1_2,
              data.doctors2_1,
              data.doctors3_1
            );
            console.log(
              "修改后的护士:",
              data.majornurse,
              data.smallnightnurse,
              data.bignightnurse
            );
            let ondutystaffs = [
              { cate: 0, peopleid: data.doctors1_1 },
              { cate: 0, peopleid: data.doctors1_2 },
              { cate: 1, peopleid: data.doctors2_1 },
              { cate: 2, peopleid: data.doctors3_1 },
              { cate: 3, peopleid: data.majornurse },
              { cate: 4, peopleid: data.smallnightnurse },
              { cate: 5, peopleid: data.bignightnurse },
            ];
            
            api.changeOndutyStaffApi(areaid, ondutystaffs, userid)
              .then((res) => {
                console.log(res);
                let newOndutystaff = this.$x2js.xml2js(res.data);
                console.log(newOndutystaff);
              });

            this.$message.success("发布成功");
          })
          .catch(() => {
            this.$message.error("已取消发布");
          });
      });
    },
    //获取所有职工
    getAllStaff(staffclass = "1", staffname = "") {
      console.log(staffclass, staffname);
      let allstaff = api
        .getallstaffApi(staffclass, staffname, areaid)
        .then((res) => {
          // console.log(res);
          let staffs = this.$x2js.xml2js(res.data);
          console.log(staffs);
          if (
            staffs.Response &&
            staffs.Response.Data &&
            staffs.Response.Data.StaffDict &&
            staffs.Response.Data.StaffDict.Staff
          ) {
            let staffList = staffs.Response.Data.StaffDict.Staff;
            // console.log(staffs.Response.Data.StaffDict.Staff);
            if (staffclass == "1") {
              this.scheduleform.doctorsList = staffList;
              // console.log(this.doctorsList);
            }
            if (staffclass == "2") {
              this.scheduleform.nursesList = staffList;
              // console.log(this.nursesList);
            }
          }
        });
    },
    //获取值班人员
    getOndutyStaff() {
      console.log(areaid);
      let currentstaff = api.showOndutystaffApi(areaid).then((res) => {
        // console.log(res.data);
        let currentstaffs = this.$x2js.xml2js(res.data);
        console.log(currentstaffs);
        let firstdoctors = [];
        console.log(
          currentstaffs.Response,
          currentstaffs.Response.Data,
          currentstaffs.Response.Data.DutyStaffs,
          currentstaffs.Response.Data.DutyStaffs.DutyStaff
        );
        if (
          (currentstaffs.Response,
          currentstaffs.Response.Data &&
            currentstaffs.Response.Data.DutyStaffs &&
            currentstaffs.Response.Data.DutyStaffs.DutyStaff)
        ) {
          let onDutystaff = currentstaffs.Response.Data.DutyStaffs.DutyStaff;
          console.log(onDutystaff);
          for (let i = 0; i < onDutystaff.length; i++) {
            const people = onDutystaff[i];
            console.log(people.StaffType);
            if (people.StaffType == "0") {
              console.log(people.EmpNo);
              firstdoctors.push(people.EmpNo);
            }
            if (people.StaffType == "1") {
              this.scheduleform.doctors2_1 = people.EmpNo;
            }
            if (people.StaffType == "2") {
              this.scheduleform.doctors3_1 = people.EmpNo;
            }
            if (people.StaffType == "3") {
              this.scheduleform.majornurse = people.EmpNo;
            }
            if (people.StaffType == "4") {
              this.scheduleform.smallnightnurse = people.EmpNo;
            }
            if (people.StaffType == "5") {
              this.scheduleform.bignightnurse = people.EmpNo;
            }
          }
          console.log("firstdoctors", firstdoctors);
          this.scheduleform.doctors1_1 = firstdoctors[0];
          this.scheduleform.doctors1_2 = firstdoctors[1];
        }
      });
    },
    //获取区域呼机
    getAreaBP(bptype) {
      console.log(areaid, bptype);
      let currentBP = api.showAreaBPApi(areaid, bptype).then((res) => {
        console.log(bptype);
        // console.log(res);
        let currentAreaBP = this.$x2js.xml2js(res.data);
        // console.log(currentAreaBP);
        if (
          currentAreaBP.Response &&
          currentAreaBP.Response.Data &&
          currentAreaBP.Response.Data.AreaTel &&
          currentAreaBP.Response.Data.AreaTel.Tel &&
          currentAreaBP.Response.Data.AreaTel.Tel.PhoneNum
        ) {
          let firstOrSecondBP =
            currentAreaBP.Response.Data.AreaTel.Tel.PhoneNum;
          console.log(firstOrSecondBP);
          if (bptype == "0") {
            this.scheduleform.firstBP = firstOrSecondBP;
            console.log("firstBP", this.scheduleform.firstBP);
          }
          if (bptype == "1") {
            this.scheduleform.secondBP = firstOrSecondBP;
            console.log("secondBP", this.scheduleform.secondBP);
          }
        }
      });
    },
    //获取日期 及 初始病区和护士站
    getDateAndArea() {
      this.scheduleform.date = new Date();
      this.scheduleform.treamentArea = areaname;
      this.scheduleform.nurseStation = areaname;
    },
    // 输入框一线呼机 或 二线呼机 修改后
    inputChange(input, cate = "") {
      let BPtype = "",
        BPnumber = "";
      console.log(input);
      if (cate == "firstNum") {
        BPtype = "一线呼机";
        BPnumber = input;
        this.scheduleform.firstBP = input;
        console.log(this.scheduleform.firstBP);
      }
      if (cate == "secondNum") {
        BPtype = "二线呼机";
        BPnumber = input;
        this.scheduleform.secondBP = input;
        console.log(this.scheduleform.secondBP);
      }
      this.$notify.info({
        title: "提示",
        message: `您已修改${BPtype}为${BPnumber}，请点击确认发布按钮发布`,
        duration: 5000,
      });
      // }

      this.scheduleform.publishconfirm = false;
    },
    //下拉框打开时 展示一线呼机 或 二线呼机
    // selectVisibleFirstOrSecondBP(isVisible, cate = "") {
    //   //展开选择器的时候,loading变为ture
    //   this.selectLoading = true;
    //   //展开的时候需要获取数据
    //   console.log(isVisible, cate);
    //   if (isVisible) {
    //     // 下拉框出现了
    //     if (cate = "firstNum") {
    //       this.firstBPoptions = this.firstBP;
    //     }
    //     if (cate = "secondNum") {
    //       this.secondBPoptions = this.secondBP;
    //     }
    //     // if ((cate = "firstNum")) {
    //     //   this.firstBP = 1314;
    //     // }
    //     // if ((cate = "secondNum")) {
    //     //   this.secondBP = 3367;
    //     // }
    //   }
    // },

    //下拉框打开时 展示诊区id或护士站
    selectVisibleAreasOrStation(isVisible, cate = "") {
      //下拉框打开时 展示诊区id或护士站
      //展开选择器的时候,loading变为ture
      this.scheduleform.selectLoading = true;
      //展开的时候需要获取数据
      //调用获取列表的方法
      console.log(isVisible, cate);
      if (isVisible) {
        // 下拉框出现了
        if (cate == "doctor") {
          this.scheduleform.treamentOptions = areaname;
        }
        if (cate == "nurse") {
          this.scheduleform.nurseOptions = areaname;
        }
        // if ((cate = "firstNum")) {
        //   this.firstBP = 1314;
        // }
        // if ((cate = "secondNum")) {
        //   this.secondBP = 3367;
        // }
      }
    },
    // 下拉框展示职工(医生或者护士)医生或者护士
    selectVisibleStaff(isVisible, cate = "") {
      //展开选择器的时候,loading变为ture
      this.scheduleform.selectLoading = true;
      //展开的时候需要获取数据
      //调用获取列表的方法
      // console.log(isVisible);
      if (isVisible) {
        //下拉框出现了
        //发送请求,获取班级列表
        // api.getClassesApi().then((res) => {
        //   console.log(res);
        //   this.classList = res.data.data;
        //   // console.log(this.classList);
        //   this.selectLoading = false;
        // });
      }
    },
    //远程搜索医生
    remoteMethod(query) {
      // 键盘弹起的时候获取输入值
      console.log(query);
      this.scheduleform.searchDoctorsValue = query;
      //向后台发起请求
      api.getallstaffApi(1, query, areaid).then((res) => {
        console.log(res);
        let searchDoctor = this.$x2js.xml2js(res.data);
        console.log(searchDoctor);
        if (
          searchDoctor.Response &&
          searchDoctor.Response.Data &&
          searchDoctor.Response.Data.StaffDict &&
          searchDoctor.Response.Data.StaffDict.Staff
        ) {
          this.scheduleform.doctorsList =
            searchDoctor.Response.Data.StaffDict.Staff;
          console.log(this.scheduleform.doctorsList);
        }
      });
    },
    //远程搜索护士
    remoteMethodNurses(query) {
      // 键盘弹起的时候获取输入值
      console.log(query);
      this.scheduleform.searchDoctorsValue = query;
      //向后台发起请求
      api.getallstaffApi(2, query, areaid).then((res) => {
        // console.log(res);
        let searchNurse = this.$x2js.xml2js(res.data);
        console.log(searchNurse);
        if (
          searchNurse.Response &&
          searchNurse.Response.Data &&
          searchNurse.Response.Data.StaffDict &&
          searchNurse.Response.Data.StaffDict.Staff
        ) {
          this.scheduleform.nursesList =
            searchNurse.Response.Data.StaffDict.Staff;
          console.log(this.scheduleform.nursesList);
        }
      });
    },
    // 下拉框修改触发
    classChange(query, cate = "") {
      console.log(query, cate);
      console.log(this.scheduleform.doctorsList);
      console.log(this.scheduleform.nursesList);
      //query就是选中的option
      // const {doctorsList,nursesList,...other}
      // if (!Object.values(this.scheduleform).includes(query) ) {
      //   console.log('不包含');
      // }else{
      //   console.log('包含');
      // }
      let peoplearr = [];
      let peopletype = "";
      let peoplename = "";
      if (cate.indexOf("doctor") != -1) {
        // console.log('医生');
        peoplearr = this.scheduleform.doctorsList;
      } else {
        // console.log('护士');
        peoplearr = this.scheduleform.nursesList;
      }
      console.log(111111, cate == "doctors1_1" && "doctors1_2");
      //if(cate == 'doctors1_1' || 'doctors1_2')
      //(cate == 'doctors1_1') || (cate == 'doctors1_2')
      if (cate == "doctors1_1" || cate == "doctors1_2") {
        peopletype = "一线医生";
      } else if (cate == "doctors2_1") {
        peopletype = "二线医生";
      } else if (cate == "doctors3_1") {
        peopletype = "三线医生";
      } else if (cate == "majornurse") {
        peopletype = "主责护士";
      } else if (cate == "smallnightnurse") {
        peopletype = "小夜护士";
      } else if (cate == "bignightnurse") {
        peopletype = "大夜护士";
      }
      console.log("cate", cate);
      console.log("peopletype", peopletype);
      for (let i = 0; i < peoplearr.length; i++) {
        const element = peoplearr[i];
        // console.log(element);
        if (element.EmpNo == query) {
          console.log(element.Name);
          peoplename = element.Name;
        }
      }
      this.$notify.info({
        title: "提示",
        message: `您已修改${peopletype}为${peoplename}，请点击确认发布按钮发布`,
        duration: 5000,
      });
      // }
      this.scheduleform.publishconfirm = false;
      //1.select展开的时候 需要展示所有的班级列表
      //2.选中班级列表的时候,要更新表格
      //调用早已经封装好的GET_STULIST,传递班级就可以了
      // console.log(query);
      //当query等于all的时候,表示要展示所有的班级
      // if (query === "all") {
      //   query = ""; //将query重新赋值为空 因为不传的话 后台就默认返回所有数据
      // }
      // let count, page;
      // this.getStuList((count = 5), (page = 1), query);
    },
  },
};
</script>

<style lang="less">
.select-class {
  line-height: 40px;
  text-align: left;
  margin-bottom: 20px;
}
.select-title {
  font-weight: 900;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.el-form-item {
  margin: 5px 30px;
}
.watch {
  text-align: center !important;
}
.container{
  height: 200px;
}
</style>
