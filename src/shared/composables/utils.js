import { useAuthStore } from "@/store/auth.js";
const authStore = useAuthStore();
export const useUtils = () => {
  const getPriceFormatted = (price) => {
    return (
      "₺" + price?.toLocaleString("en-US")
    );
  };

  return {
    getPriceFormatted,
  };
};
