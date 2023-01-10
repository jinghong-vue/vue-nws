<template>
  <el-breadcrumb separator="/" v-if="flag">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <!-- <el-breadcrumb-item><a href="/">信息发布管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>护理项目排班</el-breadcrumb-item>
        <el-breadcrumb-item>护理项目编辑</el-breadcrumb-item> -->
    <el-breadcrumb-item
      :to="{ path: item.path }"
      v-for="item in crumb"
      :key="item.meta.title"
    >
      {{ item.meta.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      flag: true,
    };
  },
  mounted() {
    // console.log("window.location.path",window.location);
  },
  computed: {
    ...mapState("permission", ["crumb"]),
  },
  // watch:{
  //     immediate:true, // 首次加载的时候执行函数
  //     $route(newVal){
  //         console.log('==============',newVal)
  //         if(newVal.path=="/ReleaseManagement/Scheduling" || newVal.path=="/SystemSettings/ProjectMaintenance"){
  //             this.flag = false
  //         }else{
  //             this.flag =  true
  //         }
  //     }

  // }
  
  // vue 会依次使用 mutaitionObserver Promise setImmediate setTimeout

  watch: {
    $route: {
      // 监听路由参数
      handler(newVal) {
        console.log("==============", newVal, this.flag);
        if (
          newVal.path == "/ReleaseManagement/Scheduling" ||
          newVal.path == "/SystemSettings/ProjectMaintenance"
        ) {
          this.flag = false;
        } else {
          this.flag = true;
        }
      },
      immediate: true, //立即执行
    },
  },
};
</script>
