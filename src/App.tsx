import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";

import { ApiError } from "./types/error";

import { AuthProvider } from "@src/context/AuthProvider";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

import MainPage from "@src/pages/MainPage";
import OAuth2CallbackPage from "@src/pages/OAuth2CallbackPage";
import NotFoundPage from "@src/pages/NotFoundPage";

import Header from "@src/components/common/Header";

import styles from "./App.module.scss";

const AppContent = () => {
  const isRepoPage = useIsRepoPage();

  return (
    <div className={`${isRepoPage ? styles.repo : ""}`}>
      <Header />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 401 에러 발생 시 auth 캐시를 undefined로 설정 (로그아웃 상태)
      // auth 쿼리 자체의 401 에러는 제외 (무한 루프 방지)
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        query.queryKey[0] !== "auth"
      ) {
        queryClient.removeQueries({ queryKey: ["auth"] });
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (_failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        // 다른 에러는 최대 3번까지 재시도
        return _failureCount < 3;
      },
    },
    mutations: {
      retry: (_failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        return false;
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              backgroundColor: "#020617",
              color: "#e5e7eb",
              border: "1px solid #24283a",
              borderRadius: "6px",
            },
            success: {
              style: {
                backgroundColor: "#020617",
                color: "#e5e7eb",
                border: "1px solid #008c33",
                borderRadius: "6px",
              },
              iconTheme: {
                primary: "#008c33",
                secondary: "#e5e7eb",
              },
            },
            error: {
              style: {
                backgroundColor: "#020617",
                color: "#e5e7eb",
                border: "1px solid #f97373",
                borderRadius: "6px",
              },
              iconTheme: {
                primary: "#f97373",
                secondary: "#e5e7eb",
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
