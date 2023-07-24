import { reactive, ref, toRaw, toRefs } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useRouter } from "vue-router";
import { useFetch } from "@/shared/composables/Fetch.js";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSendMsg } from "@/modules/live/composables/SendMsg.js";
import AgoraRTM from "agora-rtm-sdk";
import useAgoraStore from "@/store/agoraStore.js";
import useTokshow from "@/store/useTokshow.js";
import useAuction from "../store/AuctionStore";

export const useAgora = () => {
  const RTCClientInstance = ref();
  const RTMChannel = ref();
  const { sendMsg } = useSendMsg();
  const authStore = useAuthStore();
  const { setMuted } = authStore;

  const agoraData = reactive({
    agoraInstance: null,
    videoContainer: {},
    localAudioTrack: null,
    remoteAudioTrack: null,
    videoTrack: null,
    remoteUID: "",
    agoraAppID: "",
    agoraToken: "",
    hasJoined: false,
    hasEnded: false,
    isVideoHidden: false,
    agoraLoading: false,
    //......RTM.......
    client: {},
    RTMToken: "",
    RTMChannel: {},
    loading: false,
  });

  const tokshowStore = useTokshow();
  const {
    addraisedHands,
    addSpeaker,
    isSpeaker,
    addTokshow,
    toggleSpeakerSound,
    removeSpeakerRaisedHand,
    addUserToRoom,
    endRoom,
  } = tokshowStore;
  const agoraStore = useAgoraStore();
  const auctionStore = useAuction();
  const { addAuction, startAuction } = auctionStore;
  const { incrementFollowers, decrementFollowers, saveRTMChannel } = agoraStore;
  const router = useRouter();

  const getAppSettings = async () => {
    try {
      const { data, status } = await useFetch(`/admin/app/settings`);

      if (status.value === 200) {
        agoraData.agoraAppID = data.value[0].agoraAppID;
        return data.value[0].agoraAppID;
      }
    } catch (e) {
      return e;
    }
  };

  const genToken = async ({ roomId }) => {
    try {
      const { data } = await useFetch(`/rooms/agora/rooom/generatetoken`, {
        method: "POST",
        data: {
          channel: roomId,
        },
      });
      agoraData.agoraToken = data.value?.token;
      return data.value?.token;
    } catch (e) {
      return e;
    }
  };

  const joinChannel = async ({ roomId, isOwner }) => {
    // if (!authStore.authUser?._id) router.push(`/login`);

    agoraData.agoraLoading = true;
    const agoraAppID = await getAppSettings();
    const agoraToken = await genToken({ roomId });

    await agoraData.agoraInstance?.join(
      agoraAppID,
      roomId,
      agoraToken,
      authStore.authUser?.agorauid
    );
    agoraData.hasJoined = true;

    agoraData.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    agoraData.localAudioTrack?.setMuted(true);
    if (isOwner) {
      agoraData.localAudioTrack?.setMuted(authStore.authUser?.muted);
      agoraData.videoTrack = await AgoraRTC.createCameraVideoTrack();

      await agoraData.agoraInstance?.publish([
        agoraData.videoTrack,
        agoraData.localAudioTrack,
      ]);

      agoraData.videoTrack?.play(agoraData.videoContainer);
    }

    if (isSpeaker(authStore.authUser._id)) {
      await agoraData.agoraInstance?.publish([agoraData.localAudioTrack]);
      agoraData.localAudioTrack?.setMuted(authStore.authUser?.muted);
    }

    incrementFollowers();

    agoraData.agoraLoading = false;
  };

  const leaveRTC = async ({ isOwner, roomId }) => {
    agoraData.agoraLoading = true;

    if (RTCClientInstance.value) {
      await RTCClientInstance?.value.leave();
    }

    if (agoraData.videoTrack) agoraData.videoTrack?.close();
    if (agoraData.audioTrack) agoraData.audioTrack?.close();

    if (isOwner) {
      await useFetch(`/rooms/rooms/${roomId}`, {
        method: "PUT",
        data: {
          ended: true,
        },
      });
    }

    decrementFollowers();

    agoraData.agoraLoading = false;
    agoraData.hasJoined = false;
    agoraData.hasEnded = true;
    endRoom();
  };

  const toggleSound = async (userObj = authStore.authUser) => {
    let rawObj = toRaw(userObj);
    let muted = !rawObj?.muted;
    await useFetch(`/users/${userObj._id}`, {
      method: "PUT",
      data: {
        muted: muted,
      },
    });

    if (userObj._id === authStore.authUser._id) {
      agoraData.localAudioTrack?.setMuted(muted);
      setMuted(muted);
    }
    toggleSpeakerSound(rawObj._id, muted);

    sendRTMMessage({
      message: {
        action: "remote_muted",
        userData: rawObj,
        roomId: tokshowStore.tokshow._id,
        extra: muted,
      },
    });
  };

  const toggleVideo = () => {
    agoraData.videoTrack?.setMuted(!agoraData.isVideoHidden);
    agoraData.isVideoHidden = !agoraData.isVideoHidden;
  };

  const startCall = async ({ isOwner, divId, roomId }) => {
    agoraData.agoraLoading = true;

    const agoraEngine = await AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
      role: "host",
    });

    agoraData.agoraInstance = agoraEngine;
    RTCClientInstance.value = agoraEngine;

    agoraData.videoContainer = document.getElementById(divId);

    agoraEngine.on("user-published", async (user, mediaType) => {
      await agoraEngine.subscribe(user, mediaType);

      if (mediaType === "video") {
        agoraData.videoTrack = user.videoTrack;

        agoraData.remoteAudioTrack = user.audioTrack;

        agoraData.remoteUID = user.uid.toString();

        agoraData.videoTrack?.play(agoraData.videoContainer);
      }

      if (mediaType === "audio") {
        agoraData.remoteAudioTrack = user.audioTrack;

        agoraData.remoteAudioTrack?.play();
      }
    });

    agoraEngine.on("user-joined", () => {
      incrementFollowers();
    });

    agoraEngine.on("user-left", () => {
      decrementFollowers();
    });

    await joinChannel({ roomId, isOwner });
    agoraData.agoraLoading = false;
  };

  //.............................................RTM................................................................................................

  const getRTMToken = async () => {
    agoraData.agoraLoading = true;

    const { data, status } = await useFetch(
      `/rooms/agora/rooom/rtmtoken/${authStore?.authUser?.agorauid}`
    );

    if (status.value === 200) agoraData.RTMToken = data.value.token;

    agoraData.agoraLoading = false;
  };

  const sendRTMMessage = ({ message, channel }) => {
    let activeChannel = channel || RTMChannel.value;
    if (activeChannel)
      activeChannel
        .sendMessage({ text: JSON.stringify(message) })
        .then(() => {
          console.log(
            "Channel message: " + message + " from " + activeChannel.channelId
          );
        })
        .catch((e) => {
          console.log("error", e);
        });
  };

  const initRTM = async ({ roomId, isOwner }) => {
    const appId = await getAppSettings();
    const client = AgoraRTM.createInstance(appId);

    agoraData.agoraAppId = appId;

    agoraData.client = client;

    await getRTMToken();

    let options = {
      uid: String(authStore?.authUser?.agorauid),
      token: agoraData.RTMToken,
    };

    await client.login(options);

    client.on("MessageFromPeer", function (message, peerId) {
      console.log("Message from: " + peerId + " Message: " + message);
    });

    client.on("ConnectionStateChanged", function (state, reason) {
      console.log("State changed To: " + state + " Reason: " + reason);
    });

    let channel = client.createChannel(roomId);
    agoraData.RTMChannel = channel;
    RTMChannel.value = channel;

    saveRTMChannel(channel);

    await channel.join().then(async () => {
      console.log("You have successfully joined channel " + channel.channelId);
      await useFetch(`/rooms/user/add/${tokshowStore.tokshow._id}`, {
        method: "PUT",
        data: {
          users: [authStore.authUser?._id],
        },
      });
      if (!isOwner) {
        addUserToRoom(authStore.authUser);
        await sendMsg({
          path: `chats/${roomId}/messages`,
          data: {
            date: Date.now().toString(),
            id: roomId,
            message: authStore.authUser.firstName + " has joined👋",
            seen: true,
            sender: authStore.authUser.userName,
            senderName: authStore.authUser.firstName ?? "",
            senderProfileUrl: authStore.authUser.profilePhoto ?? "",
            senderId: authStore?.authUser?._id,
          },
        });
        let rawObj = toRaw(authStore.authUser);
        sendRTMMessage({
          message: {
            action: "user_joined",
            userData: rawObj,
            roomId: tokshowStore.tokshow._id,
          },
        });
      }
    });

    channel.on("ChannelMessage", function (message, memberId) {
      console.log("Message received from: " + memberId);
      roomListeners(message, memberId);
    });
    // Display channel member stats
    channel.on("MemberJoined", function (memberId) {
      console.log(memberId + " joined the channel");
    });
    // Display channel member stats
    channel.on("MemberLeft", function (memberId) {
      console.log(memberId + " left the channel");
    });
  };

  const roomListeners = async (message, channelId) => {
    const data = JSON.parse(message.text);
    console.log(data);

    if (data.action === "leave") {
      removeSpeakerRaisedHand(data.userData?._id);
      if (data?.userData?._id === tokshowStore.tokshow.ownerId._id) {
        await leaveRTC({
          isOwner: false,
          roomId: channelId,
          userObj: authStore.authUser,
        });
      }
    }

    if (data.action === "added_raised_hands") {
      let found = tokshowStore.tokshow.raisedHands.findIndex(
        (obj) => obj._id === data?.userData?._id
      );

      if (found === -1) addraisedHands(data.userData);
    }

    if (data.action === "add_speaker") {
      console.log(data);
      if (authStore.authUser._id === data.userData._id) {
        addSpeaker(data.userData);

        await agoraData.agoraInstance?.publish([agoraData.localAudioTrack]);

        await useFetch(`/users/${data.userData._id}`, {
          method: "PUT",
          data: {
            muted: true,
          },
        });

        agoraData.localAudioTrack?.setMuted(authStore.authUser?.muted);
        setMuted(authStore.authUser?.muted);

        let { data: updateData } = await useFetch(
          `/rooms/rooms/${data.roomId}`,
          {
            method: "PUT",
            data: {
              invitedSpeakerIds: [data.userData._id],
            },
          }
        );
        addTokshow(updateData.value);
      }
    }

    if (data.action === "remote_muted") {
      let mutedState = data.extra;
      console.log(data, mutedState);
      toggleSpeakerSound(data.userData._id, mutedState);
      if (authStore.authUser._id === data.userData._id) {
        agoraData.localAudioTrack?.setMuted(mutedState);
      }
    }
    if (data.action === "remove_invited_speaker") {
      removeSpeakerRaisedHand(data.userData._id);
    }
    if (data.action === "bid") {
      console.log("bid", data);
      auctionStore.bid({
        amount: data.otherdata.amount,
        userObj: data.userData,
      });
    }
    if (data.action === "start_auction") {
      startAuction();
    }
    if (data.action === "activeauction") {
      addAuction(data.otherdata);
    }
    if (data.action === "user_joined") {
      addUserToRoom(data.userData);
    }
  };

  return {
    startCall,
    toggleVideo,
    toggleSound,
    leaveRTC,
    joinChannel,
    getAppSettings,
    initRTM,
    sendRTMMessage,
    ...toRefs(agoraData),
  };
};
