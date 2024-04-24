import Index from "../pages/home/Index.vue";
import Audit from "../pages/audit/Audit.vue";
import Record from "../pages/record/Record.vue";
// import UserLoginPage from "../pages/userLogin/UserLoginPage.vue";

const routes = [
  { path: "/", title: "参观预约", component: Index },
  { path: "/record", title: "预约记录", component: Record },
  { path: "/audit", title: "预约审核", component: Audit },
  // { path: "/user/login", title: "登录", component: UserLoginPage },
];

export default routes;
