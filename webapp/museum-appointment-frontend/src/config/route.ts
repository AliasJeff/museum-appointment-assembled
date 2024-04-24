import Index from "../pages/home/Index.vue";
import Audit from "../pages/audit/Audit.vue";
import Record from "../pages/record/Record.vue";
import UserLoginPage from "../pages/userLogin/UserLoginPage.vue";

const routes = [
  { path: "/", component: Index },
  { path: "/record", component: Record },
  { path: "/audit", component: Audit },
  // { path: '/user/login', title: '登录', component: UserLoginPage },
];

export default routes;
