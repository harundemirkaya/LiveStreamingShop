export const liveRoutes = [
    {
        path: "live/:roomId",
        name: "live",
        component: () => import("@/modules/live/views/AgoraVideo.vue"),
    },
    {
        path: "createtokshow",
        name: "createtokshow",
        component: () => import("@/modules/live/views/CreateTokShow.vue"),
        meta: {
            requires_auth: true,
        },
    },
]