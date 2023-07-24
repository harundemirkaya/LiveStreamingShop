import { useAuthStore } from "@/store/auth.js";
const authStore = useAuthStore();
export const useUtils = () => {
  const getPriceFormatted = (price) => {
    return (
      authStore?.appSettings[0].currency + "" + price?.toLocaleString("en-US")
    );
  };

  return {
    getPriceFormatted,
  };
};
