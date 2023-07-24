export const messagingRoutes = [
  {
    path: "messaging",
    name: "messaging",
    component: () => import("@/modules/messaging/views/Messaging.vue"),
    children: [
      {
        path: ":chatId",
        name: "inbox",
        component: () => import("@/modules/messaging/views/Inbox.vue"),
      },
      {
        path: "",
        name: "newmsg",
        component: () => import("@/modules/messaging/views/NewMessage.vue"),
      },
    ],
    meta: {
      requires_auth: true,
    },
  },
];
