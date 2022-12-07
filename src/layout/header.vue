<template>
  <el-row type="flex" class="row-bg" justify="space-between">
    <el-col :span="4">
      <div class="shouqi left">
        <i @click="SET_COLLAPSE" :class="collapseIcon"></i>
      </div>
    </el-col>
    <el-col :span="10">
      <div class="grid-content center">
        <!-- CRM系统 -->
        {{ user.Area.AreaName }}
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content right">
        <!-- <b>{{$store.state.users.userinfo.nickname}}</b> -->
        <!-- <el-avatar shape="square"
								:size="40"
								:src="avatarUrl"></el-avatar> -->
        <span class="nickname">
          {{ user.UserName }}
        </span>
        <el-button
          icon="iconfont icon-tuichu2"
          @click.native="quit"
          circle
          class="quitbutton"
        ></el-button>

        <div>
          <i @click="quit" class="icon-tuichu2">退出</i>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations } from "vuex";
let userinfo = JSON.parse(localStorage.getItem("userinfo"));
// console.log(userinfo);
let user = userinfo.Response.Data.User;
// console.log(user);
export default {
  data() {
    return {
      userinfo: userinfo,
      user: user,
    };
  },
  computed: {
    ...mapState(["collapse"]),
    collapseIcon() {
      return this.collapse
        ? "iconfont icon-fold-right"
        : "iconfont icon-shouqi1";
    },
    avatarUrl() {
      //如果用户没有头像,就使用默认头像,如果有,就使用用户头像;
      return userinfo.headimgurl
        ? userinfo.headimgurl
        : "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";
    },
  },
  methods: {
    ...mapMutations(["SET_COLLAPSE"]),
    quit() {
      this.$confirm("确定要退出登录的账号吗", "提示")
        .then(() => {
          //清除token
          localStorage.removeItem("userinfo");
          //返回到登入页
          this.$router.push("/login");
          //清掉本地缓存
          location.reload();

          this.$message.success("退出成功");
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("已取消退出");
        });
    },

    //command (命令) 右上角下拉菜单触发事件
    command(routeName) {
      console.log(routeName);
      // console.log(allRoutes);
      //   //routeName就是下拉菜单传入的路由名字
      // if (allRoutes[0].children) {

      //   this.$router.push({name: `home-${routeName}`})
      // this.$router.push(`${routeName}`)
      // }
      if (routeName === "quit") {
        console.log(111);
        this.quit();
      }
    },
  },
};
</script>
<style scoped lang="less">
.icon-vip-i,
.icon-vip2-i,
.icon-vip_3-i {
  color: #f4c14f !important;
  font-weight: bolder !important;
}
.row-bg {
  color: #fff;
}
.el-row {
  line-height: 60px;
  height: 60px;
}
.row-el {
  height: 60px;
  line-height: 60px !important;
  background: linear-gradient(135deg, #4c67ff, #5635df);
  color: #fff;
  font-weight: bolder;
  text-align: center;

  .center {
    font-size: 30px;
  }
}
.shouqi {
  text-align: left;
  i.iconfont {
    font-size: 30px;
    cursor: pointer;
    color: #fff;
  }
}

.el-avatar {
  vertical-align: middle;
  margin-right: 10px;
}

.icon {
  width: 5em;
  height: 1.5em;
  vertical-align: middle;
}
.quitbutton {
  font-size: 10px;
  margin-left: 10px;
}

.el-dropdown-menu,
.el-dropdown-menu__item,
.el-dropdown-menu__item--divided:before {
  background-image: linear-gradient(
    135deg,
    rgb(76, 138, 235),
    rgb(68, 126, 217)
  );
  color: #fff;
  text-align: center;
  font-weight: bolder;
}
.el-dropdown-menu {
  width: 200px;
}
</style>
