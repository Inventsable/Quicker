const routes = [
  {
    path: "/",
    component: () => import("layouts/Panel.vue"),
    children: [
      {
        path: "qr",
        name: "QRCode",
        component: () => import("pages/QRCode.vue")
      },
      {
        path: "bar",
        name: "Barcode",
        component: () => import("pages/BarCode.vue")
      }
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
