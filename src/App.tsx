import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@src/context/AuthProvider";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

import MainPage from "@src/pages/MainPage";
import OAuth2CallbackPage from "@src/pages/OAuth2CallbackPage";
import NotFoundPage from "@src/pages/NotFoundPage";

import Header from "@src/components/common/Header";

import styles from "./App.module.scss";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ApiError } from "./types/error";
import { useAuthContext } from "./hooks/useAuthContext";

const AppContent = () => {
  const isRepoPage = useIsRepoPage();
  const { setIsLoggedIn } = useAuthContext();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) {
          setIsLoggedIn(false);
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (_failureCount, error) => {
          // AUTH_40103 에러인 경우 재시도하지 않음 (apiClient에서 처리)
          if (error instanceof ApiError && error.errorCode === "AUTH_40103") {
            return false;
          }
          // 다른 에러는 최대 3번까지 재시도
          return _failureCount < 3;
        },
      },
      mutations: {
        retry: (_failureCount, error) => {
          // AUTH_40103 에러인 경우 재시도하지 않음
          if (error instanceof ApiError && error.errorCode === "AUTH_40103") {
            return false;
          }
          return false; // mutation은 기본적으로 재시도하지 않음
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

const App = () => {
  return (
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
  );
};

export default App;
