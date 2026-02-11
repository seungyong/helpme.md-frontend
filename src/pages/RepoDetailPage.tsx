import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import styles from "./RepoDetailPage.module.scss";

import { SectionProvider } from "@src/providers/SectionProvider";

import { apiClient } from "@src/utils/apiClient";
import { useAuth } from "@src/hooks/useAuth";

import { Repository } from "@src/types/repository";
import { APIEndpoint } from "@src/types/APIEndpoint";

import Header from "@src/components/repo/Header";
import DragableSection from "@src/components/repo/DragableSection";
import Section from "@src/components/repo/Section";
import MarkdownEditor from "@src/components/repo/MarkdownEditor";
import EvaluationResult from "@src/components/repo/EvaluationResult";

const RepoDetailPage = () => {
  const { owner, name } = useParams();
  const { isLoggedIn } = useAuth();

  const { data: repo } = useQuery<Repository>({
    queryKey: ["repo", owner, name],
    queryFn: async () =>
      apiClient
        .get<Repository>(`${APIEndpoint.REPOSITORIES}/${owner}/${name}`)
        .then((response) => response.data),
    enabled: !!owner && !!name,
    refetchOnWindowFocus: false,
  });

  if (!isLoggedIn) {
    sessionStorage.setItem("redirectUrl", `/repo/${owner}/${name}`);
    window.location.replace(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.OAUTH2_LOGIN}`
    );
  }

  return (
    <SectionProvider>
      <main className={styles.main}>
        <section className={styles.mainSection}>
          {repo && (
            <>
              <Header repo={repo} />
              <div className={styles.content}>
                <aside className={styles.item}>
                  <p className="text-emphasis">Components</p>
                  <DragableSection />
                  <Section />
                </aside>
                <div className={styles.item}>
                  <p className="text-emphasis">Editor</p>
                  <MarkdownEditor />
                  <EvaluationResult />
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </SectionProvider>
  );
};

export default RepoDetailPage;
