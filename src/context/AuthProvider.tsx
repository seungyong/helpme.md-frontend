import { ReactNode } from "react";
import { useAuthQuery } from "@src/hooks/useAuthQuery";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 백그라운드에서 인증 체크만 수행 (로딩 화면 없음)
  useAuthQuery();

  return <>{children}</>;
};
