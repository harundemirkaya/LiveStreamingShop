import {defineStore} from "pinia";


export const useProfileDialog = defineStore('profile-store', {
    state: () =>({
        isOpenInChat: false
    }),
    actions: {
        toggleIsOpenInChat(){
            this.isOpenInChat = !this.isOpenInChat
        }
    }
})