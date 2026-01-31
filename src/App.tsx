import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@src/context/AuthProvider";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

import MainPage from "@src/pages/MainPage";
import OAuth2CallbackPage from "@src/pages/OAuth2CallbackPage";
import NotFoundPage from "@src/pages/NotFoundPage";

import Header from "@src/components/common/Header";

import styles from "./App.module.scss";

const App = () => {
  const isRepoPage = useIsRepoPage();

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
    </AuthProvider>
  );
};

export default App;
