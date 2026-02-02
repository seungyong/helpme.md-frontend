import { useAuthQuery } from "./useAuthQuery";

export const useAuthContext = () => {
  const { isSuccess } = useAuthQuery();

  const isLoggedIn = isSuccess;

  return { isLoggedIn };
};
