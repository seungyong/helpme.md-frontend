import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import styles from "./RepoDetailPage.module.scss";

import { Repository } from "@src/types/Repository";
import { EvaluationStatus } from "@src/types/evaluation";

import Header from "@src/components/repo/Header";
import DragableComponent from "@src/components/repo/DragableComponent";

const mockRepo: Repository = {
  avatarUrl: "https://avatars.githubusercontent.com/u/44765636?v=4",
  branches: ["master", "develop", "feature/test"],
  defaultBranch: "develop",
  components: [
    {
      id: "1",
      title: "Component 1",
      content: "Content 1",
    },
    {
      id: "2",
      title: "Component 2",
      content: "Content 2",
    },
    {
      id: "3",
      title: "Component 3",
      content: "Content 3",
    },
    {
      id: "4",
      title: "Component 4",
      content: "Content 4",
    },
    {
      id: "5",
      title: "Component 5",
      content: "Content 5",
    },
  ],
  content:
    '## 프로젝트 소개\n- 드론 실시간 영상 스트리밍 + Object Tracking + 자동 비행 제어 기능을 결합한 데모 시스템입니다.\n- 사용자는 모바일 웹 환경에서 드론 영상 스트리밍을 보며 트래킹할 객체의 영역을 직접 드래그하여 지정합니다.\n- 드론은 객체의 위치 변화에 따라 자동으로 위치를 조정하며 추적합니다.\n\n## 개발 기간\n- 2023.07 ~ 2023.09 (약 1개월 반)\n\n## 사용 기술\n| 구분 | 기술 스택 |\n| :-- | :-- |\n| **Frontend** | <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" /> |\n| **Backend** | <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" /> <img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white" /> <img src="https://img.shields.io/badge/OpenCV-5C3EE8?logo=opencv&logoColor=white" /> <img src="https://img.shields.io/badge/FFmpeg-000000?logo=ffmpeg&logoColor=white" /> |\n\n<br />\n\n## 데모 영상\nhttps://github.com/user-attachments/assets/c4bf02fd-48db-4166-8c51-e7e5b7e8b7a5\n\n',
  evaluation: {
    status: EvaluationStatus.GOOD,
    rating: null,
    contents: null,
  },
  name: "dronedronedronedronedronedronedronedrone",
  owner: "seungyong",
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
    <main className={styles.main}>
      <section className={styles.mainSection}>
        {repo && (
          <>
            <Header repo={repo} />
            <div className={styles.content}>
              <aside className={styles.sidebar}>
                <DragableComponent components={repo.components} />
              </aside>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default RepoDetailPage;
