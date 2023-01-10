<template>
  <div class="layout-container">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <Aside />
      <el-container>
        <el-header>
          <HeaderLayout />
        </el-header>
        <el-main>
          <Breadcrumb />
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import HeaderLayout from "./header.vue";
import Aside from "./aside.vue";
import Breadcrumb from "./brandcrumb.vue";
import util from "@/common/util";
export default {
  data() {
    return {};
  },
  mounted() {
    //   util.setlocaL("isShowBreadCrumb",true)
    //   console.log("isShowBreadCrumb",1111)
    //   setTimeout(() => {
    //   console.log("isShowBreadCrumb-container",util.getlocaL("isShowBreadCrumb"));
    // }, 2000)
  },
  computed: {
    isShowBreadCrumb() {
      return true;
      // this.$store.commit("BREAD_ISSHOW",{
      //   isShowBreadCrumb:
      // })
    },
  },
  components: {
    HeaderLayout,
    Aside,
    Breadcrumb,
  },
};
</script>
<style scoped lang="less">
.el-header,
.el-footer {
  /* background-color: #B3C0D1; */
  background: linear-gradient(
    135deg,
    rgb(76, 138, 235),
    rgb(68, 126, 217)
  ) !important;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #fff;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  // overflow: hidden;
  .el-breadcrumb {
    margin-top: 20px;
    margin-bottom: 30px;
  }
}

.el-container {
  margin-bottom: 40px;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
