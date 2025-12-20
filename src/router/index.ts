import { createRouter, createWebHistory } from "vue-router"
import Login from "@/pages/Login.vue"
import Dashboard from "@/pages/Dashboard/Dashboard.vue"
import PembayaranPage from "@/pages/Pembayaran/PembayaranPage.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login, meta: { layout: "auth", title: "Login – SMK PAKEM" } },
  { path: "/dashboard", component: Dashboard , meta: { layout: "app", requiresAuth: true, title: "Dashboard – SMK PAKEM" } },
  { path: "/pembayaran", component: PembayaranPage , meta: { layout: "app", requiresAuth: true, title: "Pembayaran – SMK PAKEM" } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = !!localStorage.getItem("token")
  
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     next("/login")
//   } else {
//     next()
//   }
// })

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  } else {
    document.title = "Jurnal-App"
  }
})
