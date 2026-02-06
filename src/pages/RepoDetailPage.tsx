import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import styles from "./RepoDetailPage.module.scss";

import { SectionProvider } from "@src/providers/SectionProvider";

import { Repository } from "@src/types/repository";

import Header from "@src/components/repo/Header";
import DragableSection from "@src/components/repo/DragableSection";
import Section from "@src/components/repo/Section";
import MarkdownEditor from "@src/components/repo/MarkdownEditor";

const mockRepo: Repository = {
  name: "dronedronedronedronedronedronedronedrone",
  owner: "seungyong",
  avatarUrl: "https://avatars.githubusercontent.com/u/44765636?v=4",
  defaultBranch: "develop",
};

const RepoDetailPage = () => {
  const { owner, name } = useParams();

  const { data: repo } = useQuery<Repository>({
    queryKey: ["repo", owner, name],
    queryFn: () => {
      return Promise.resolve(mockRepo);
      // apiClient<Repository>(`${APIEndpoint.REPOSITORIES}/${owner}/${name}`),
    },
    enabled: !!owner && !!name,
    refetchOnWindowFocus: false,
  });

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
