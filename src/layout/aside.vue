<template>
  <el-aside width="200">
    <h1 class="logo"></h1>
    <el-menu
      :default-active="$route.path"
      :router="true"
      ref="sideMenu"
      :collapse="collapse"
      class="el-menu-vertical-demo"
      background-color="##f7f7f7"
      text-color="##3d72c1"
      active-text-color="#E47833"
    >
      <el-submenu index="ReleaseManagement">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>信息发布管理</span>
        </template>
        <el-menu-item-group>
          <template slot="title"></template>
          <el-menu-item index="/ReleaseManagement/Scheduling"
            >护理项目排班</el-menu-item
          >
          <!-- <el-menu-item index="/ReleaseManagement/ProjectEditor">护理项目编辑</el-menu-item> -->
          <!-- <el-menu-item index="/ReleaseManagement/MessageEditor">留言编辑</el-menu-item> -->
          <el-menu-item index="/ReleaseManagement/WatchEditor"
            >值班编辑</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" >
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
            </el-menu-item> -->
      <el-submenu index="/systemSettings">
        <template slot="title">
          <i class="el-icon-location el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item-group>
          <template slot="title"></template>
          <el-menu-item index="/SystemSettings/ProjectMaintenance"
            >项目维护</el-menu-item
          >
          <!-- <el-menu-item index="/SystemSettings/BPMaintain">呼机维护</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["collapse"]),
  },
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-aside {
  background: linear-gradient(135deg, rgb(76, 138, 235), rgb(68, 126, 217));
  color: #333;
  text-align: center;
  /* // line-height: 200px; */
}
.el-aside[data-v-7a3f8c96] {
  line-height: 60px !important;
  color: #fff;
}
// .logo{
//     // min-width: 64px;
// }
.logo {
  min-height: 60px;
  //  background-image: url(http://chst.vip:8081/stu2/img/logo.be8bbddf.png);
  background-image: url(../assets/video/logo1.png);
  background-size: 80%;
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: 40%;
  height: 60px;
}
/deep/.el-submenu__title,
.el-menu-item is-active,
.el-menu-item,
/deep/.el-menu-item.is-disabled,
/deep/.el-submenu__title,
.el-submenu .el-menu-item,
/deep/.el-menu-item-group .el-menu-item-group__title {
  background-color: rgb(247, 247, 247) !important;
  color: rgb(68, 126, 217) !important;
}

.el-menu-vertical-demo,
.el-menu {
  background-color: rgb(247, 247, 247) !important;
}

/deep/.el-submenu__title:hover,
.el-menu-item:hover {
  background-color: #cad8ef !important;
}
</style>
