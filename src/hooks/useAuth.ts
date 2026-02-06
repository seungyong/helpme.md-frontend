import { useAuthQuery } from "./useAuthQuery";

export const useAuth = () => {
  const { isSuccess } = useAuthQuery();

  const isLoggedIn = isSuccess;

  return { isLoggedIn };
};
