<template>
  <!-- Table -->
  <el-dialog
    :title="title"
    @close="dialogClose"
    :visible="visible"
    :checkboxGroups="checkboxGroups"
    :checkboxGroups2="checkboxGroups2"
  >
    <el-table :data="gridData" ref="stuDialogRuleForm">
      <el-table-column
        property="date"
        label="日期"
        width="150"
      ></el-table-column>
      <el-table-column label="床号" width="200">{{
        checkboxGroups2.join(";")
      }}</el-table-column>
      <el-table-column label="项目">{{
        checkboxGroups.join(";")
      }}</el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" @click="dialogCloseOpen">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
export default {
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    checkboxGroups: {
      type: Array,
      default: function () {
        return [];
      },
    },
    checkboxGroups2: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      title: "发布项目",

      gridData: [
        {
          date: [
            // this.$moment().startOf("month").format("YYYY-MM-DD"),
            this.$moment().format("YYYY-MM-DD HH:mm"),
          ],
          name: [],
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      // dialogTableVisible: false,
      // dialogFormVisible: false,
    };
  },
  computed: {},
  methods: {
    dialogClose() {
      //dialog关闭时触发的回调
      // console.log('999');
      //通过父组件传递下来的方法,关闭dialog
      this.$emit("cancel");
    },
    dialogCloseOpen() {
      // console.log('1111');
      this.$emit("ok");
    },
  },
};
</script>
