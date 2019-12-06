const routes = [
  {
    path: "/",
    component: () => import("layouts/Panel.vue"),
    children: [
      { path: "", name: "Home", component: () => import("pages/Index.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
