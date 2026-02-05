import { useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Sections, Section } from "@src/types/section";

import { SectionContext } from "./SectionContext";

const mockSections: Sections = {
  sections: [
    {
      id: "28",
      title:
        "![image](https://github.com/user-attachments/assets/00f4c3fb-fb21-4821-8771-2092f133b9e4)",
      content:
        "![image](https://github.com/user-attachments/assets/00f4c3fb-fb21-4821-8771-2092f133b9e4)\n<h2 align=center>소리에서 시작하는 무한한 가능성</h2>\n<h1 align=center>$\\huge{\\color{#C67C4E}G}loba$</h1>\n<br /> <br />",
      orderIdx: 1,
    },
    {
      id: "30",
      title: "프로젝트 소개",
      content:
        "## 프로젝트 소개\n- AI 시장의 폭발적인 성장 및 디지털 수업을 이용한 교육 방식의 변화에 따라, AI를 활용한 STT 모바일 앱입니다.\n- STT 기술을 활용하여 사용자의 음성을 텍스트로 변환하고, 이를 기반으로 다양한 기능으 제공합니다.\n<br />",
      orderIdx: 2,
    },
    {
      id: "31",
      title: "개발 기간",
      content:
        "## 개발 기간\n- 1차 개발 (졸업 작품) : 2024.03 ~ 2024.09\n- 2차 개발 (서비스): 2025.01 ~ 2025.09\n<br />",
      orderIdx: 3,
    },
    {
      id: "32",
      title: "팀원 소개",
      content:
        '## 팀원 소개\n<div align="center">\n\n| **김승용** | **김인태** | **윤성빈** |\n| :------: |  :------: | :------: |\n| [<img src="https://avatars.githubusercontent.com/u/44765636?v=4" height=150 width=150> <br/> @seungyong](https://github.com/seungyong) | [<img src="https://avatars.githubusercontent.com/u/22989582?v=4" height=150 width=150> <br/> @dbstjdqls14](https://github.com/dbstjdqls14) | [<img src="https://avatars.githubusercontent.com/u/62525605?v=4" height=150 width=150> <br/> @HaeBun](https://github.com/HaeBun) |\n\n</div>\n\n<br />',
      orderIdx: 4,
    },
    {
      id: "33",
      title: "역할",
      content:
        "## 역할\n### 김승용 (팀장, 백엔드)\n|         구분         | 담당 내용                                                                                                                                       |\n| :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------ |\n|   🧠 **기획 및 설계**   | - 아이디어 제공<br> - DB 및 API 구조 설계 및 문서화<br> - UI/UX 디자인                                                                                                     |\n|  🗣️ **AI 기능 구현**  | - **Whisper**를 활용한 음성 인식 (STT)<br> - **Kiwi**를 통한 중요 키워드 추출<br> - **OpenAI GPT API**를 통한 요약, 단락 분리, 퀴즈 생성                                   |\n|    ⚙️ **백엔드 개발**   | - **사용자 인증 (JWT)**, 문서·댓글·공유·권한 관리 등 API 개발<br> - **우리말샘 Excel 데이터** 기반 단어 검색 기능 구현<br> - **Spring Boot API 서버 리팩토링 (Clean Architecture 적용)** |\n| ☁️ **인프라 구축 및 배포** | - **AWS EC2, RDS, SQS**를 활용한 서버 환경 구축 및 배포                                                                                                  |\n|   🧱 **기타 주요 업무**  | - 성능 최적화 및 코드 구조 개선                                                                                              |\n\n### 김인태 (프론트)\n|         구분         | 담당 내용                                                                                                                                       |\n| :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------ |\n|   📱 **Android 앱 개발**   | - Activity/Fragment 구조 설계 및 공통 UI 컴포넌트 정의<br> - 업로드, 오디오 플레이어 등 핵심 사용자 플로우 구현 |\n|  🧩 **MVVM 아키텍처 적용**  | - MVVM 아키텍처 적용<br> - DataBinding 을 활용한 UI-데이터 바인딩 적용 |\n|    🔗 **API 연동 및 데이터 처리**   | - 백엔드 API 연동 모듈 구현<br> - STT 결과, 요약, 퀴즈 데이터 등 응답 모델 정의 및 파싱<br> - 네트워크 상태/에러 처리 |\n| 🎨 **UI/UX 구현 및 개선** | - 일본어, 영어, 한국어 UI/텍스트 지원 구현<br> - 시스템 언어 변경 기능 및 리소스 관리<br> - 언어별 레이아웃, 문구 검수 및 테스트 진행 |\n|   🧪 **품질 및 성능 개선**  | - 화면 전환 및 리스트 스크롤 성능 최적화<br> - 크래시 로그 분석 및 예외 처리 보강<br> - 기기별 해상도 대응 및 실제 단말 테스트 진행 |\n\n<br />",
      orderIdx: 5,
    },
    {
      id: "34",
      title: "사용 기술",
      content:
        '## 사용 기술\n\n| 구분 | 기술 스택 |\n| :-- | :-- |\n| **Android** | <img src="https://img.shields.io/badge/Android%20(Java)-3DDC84?logo=android&logoColor=white" /> |\n| **Backend** | <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white" /> <img src="https://img.shields.io/badge/Spring%20Data%20JPA-007396?logo=spring&logoColor=white" /> <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" /> <img src="https://img.shields.io/badge/openAI/gpt-412991?logo=openai&logoColor=white" /> <img src="https://img.shields.io/badge/Whisper-4B6EAF?logo=whisper&logoColor=white" /> <img src="https://img.shields.io/badge/Kiwi-00BFFF?logoColor=white" /> |\n| **DB** | <img src="https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white" /> <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" /> |\n| **인프라 및 배포** | <img src="https://img.shields.io/badge/AWS%20EC2-FF9900?logo=amazon-aws&logoColor=white" /> <img src="https://img.shields.io/badge/AWS%20RDS-527FFF?logo=amazon-aws&logoColor=white" /> <img src="https://img.shields.io/badge/AWS%20SQS-232F3E?logo=amazon-aws&logoColor=white" /> <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" /> <img src="https://img.shields.io/badge/Docker%20Compose-2496ED?logo=docker&logoColor=white" /> |\n| **형상 관리** | <img src="https://img.shields.io/badge/Git-181717?logo=git&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white" /> |\n| **디자인** | <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" /> |\n\n<br />',
      orderIdx: 6,
    },
    {
      id: "35",
      title: "아키텍쳐",
      content:
        '## 아키텍쳐\n\n<img width="1214" height="750" alt="image" src="https://github.com/user-attachments/assets/d999e43c-c8ca-4bee-94f0-d4abec64fa00" />\n<br />',
      orderIdx: 7,
    },
    {
      id: "37",
      title: "프로젝트 구조 (Python)",
      content:
        "## 프로젝트 구조 (Python)\n\n```text\n├─analyze\n├─downloads\n├─exception\n├─log\n├─mode\n├─util\n├─Dockerfile\n├─consumer.py\n├─keyword.json\n├─main.py\n├─producer.py\n├─requirements.txt\n└─resource.txt\n```\n\n<br />",
      orderIdx: 8,
    },
    {
      id: "38",
      title: "Demo 영상",
      content:
        "## Demo 영상\n<div align=center>\n  \n[![Globa Demo Video](https://img.youtube.com/vi/NHepQN2UuM8/0.jpg)](https://youtu.be/NHepQN2UuM8)\n\n</div>",
      orderIdx: 9,
    },
  ],
};

interface SectionProviderProps {
  children: ReactNode;
}

export const SectionProvider = ({ children }: SectionProviderProps) => {
  const { owner, name } = useParams();

  const { data, isLoading } = useQuery<Sections>({
    queryKey: ["sections", owner, name],
    queryFn: () => Promise.resolve(mockSections),
    enabled: !!owner && !!name,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <SectionStateManager
      key={isLoading ? "loading" : "loaded"}
      initialSections={data?.sections || []}
      isLoading={isLoading}
    >
      {children}
    </SectionStateManager>
  );
};

const SectionStateManager = ({
  initialSections,
  isLoading,
  children,
}: {
  initialSections: Section[];
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [clickedSection, setClickedSection] = useState<Section>(
    initialSections[0]
  );

  const clickSection = (section: Section) => {
    console.log("Clicked section:", section);
    setClickedSection(section);
  };

  // 섹션 추가
  const createSection = (title: string, content: string) => {
    console.log(`${title}\n ${content} 섹션 추가됨`);
  };

  // 순서 변경
  const updateSectionOrder = (reorderedSections: Section[]) => {
    setSections(reorderedSections);
    console.log("순서 변경됨:", reorderedSections);
    // TODO: API 호출로 순서 저장
  };

  // 섹션 내용 수정 (Editor에서 사용)
  const updateSectionContent = (
    sectionId: string | number,
    content: string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      )
    );
    console.log(`섹션 ${sectionId} 내용 변경됨`);
    // TODO: API 호출로 내용 저장
  };

  // 섹션 삭제
  const deleteSection = (sectionId: string | number) => {
    if (sections.length === 1) {
      toast.error("섹션은 최소 1개 이상 유지해야 합니다.");
      return;
    }

    setSections((prev) => prev.filter((section) => section.id !== sectionId));
    console.log(`섹션 ${sectionId} 삭제됨`);
    // TODO: API 호출로 삭제
  };

  // 섹션 리셋 (원본으로 되돌리기)
  const resetSection = (splitMode: string) => {
    console.log("Reset section with split mode:", splitMode);
  };

  return (
    <SectionContext.Provider
      value={{
        sections,
        clickedSection,
        clickSection,
        createSection,
        updateSectionOrder,
        updateSectionContent,
        deleteSection,
        resetSection,
        isLoading,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
