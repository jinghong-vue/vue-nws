import Vue from "vue";
import VueRouter from "vue-router";

// 解决router导航到同一路径重复报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    console.log(err.toString());
  });
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/*webpackChunkName:'home'*/ "@/pages/Home"),
    children: [
      {
        path: "welcome",
        component: () =>
          import(/*webpackChunkName:'welcome'*/ "@/pages/Home/Welcome"),
      },
      {
        path: "releaseManagement",
        component: () =>
          import(
            /*webpackChunkName:'releaseManagement'*/ "@/pages/Home/ReleaseManagement"
          ),
        meta: {
          title: "fbgl",
          name: "项目发布管理",
        },
        children: [
          {
            path: "scheduling",
            component: () =>
              import(
                /*webpackChunkName:'scheduling'*/ "@/pages/Home/ReleaseManagement/Scheduling"
              ),
            meta: {
              title: "xmpb",
              name: "护理项目排班",
            },
          },
          {
            path: "projectEditor",
            component: () =>
              import(
                /*webpackChunkName:'projectEditor'*/ "@/pages/Home/ReleaseManagement/ProjectEditor"
              ),
            meta: {
              title: "xmbj",
              name: "护理项目编辑",
            },
          },
          {
            path: "messageEditor",
            component: () =>
              import(
                /*webpackChunkName:'messageEditor'*/ "@/pages/Home/ReleaseManagement/MessageEditor"
              ),
            meta: {
              title: "lybj",
              name: "留言编辑",
            },
          },
          {
            path: "watchEditor",
            component: () =>
              import(
                /*webpackChunkName:'watchEditor'*/ "@/pages/Home/ReleaseManagement/WatchEditor"
              ),
            meta: {
              title: "zbbj",
              name: "值班编辑",
            },
          },
        ],
      },
      {
        path: "systemSettings",
        component: () =>
          import(
            /*webpackChunkName:'systemSettings'*/ "@/pages/Home/SystemSettings"
          ),
        meta: {
          title: "xtsz",
          name: "系统设置",
        },
        children: [
          {
            path: "projectMaintenance",
            component: () =>
              import(
                /*webpackChunkName:'projectMaintenance'*/ "@/pages/Home/SystemSettings/ProjectMaintenance"
              ),
            meta: {
              title: "xmwh",
              name: "项目维护",
            },
          },
          {
            path: "bPMaintain",
            component: () =>
              import(
                /*webpackChunkName:'bPMaintain'*/ "@/pages/Home/SystemSettings/BPMaintain"
              ),
            meta: {
              title: "hjwh",
              name: "呼机维护",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: () => import(/*webpackChunkName:'log'*/ "@/pages/Login"),
  },
  {
    path: "*",
    component: () => import(/*webpackChunkName:'log'*/ "@/pages/Page404"),
  },
];

const router = new VueRouter({
  // base:"/ward_console",
  routes,
});

export default router;
