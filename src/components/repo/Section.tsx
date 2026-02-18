import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import styles from "./Section.module.scss";

import add from "@assets/images/add.svg";

import { useSection } from "@src/hooks/useSection";

import Modal from "@src/components/common/Modal";

type PreparedSection = {
  title: string;
  content: string;
};

const preparedSections: PreparedSection[] = [
  {
    title: "주요 기능",
    content:
      "## ✨ 주요 기능\n\n- 🚀 **빠른 성능**: 최적화된 알고리즘으로 빠른 처리 속도 제공\n- 🎨 **직관적인 UI**: 사용자 친화적인 인터페이스 디자인\n- 🔒 **보안**: 업계 표준 보안 프로토콜 적용\n- 🌐 **다국어 지원**: 한국어, 영어, 일본어 등 다국어 지원\n- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원\n- ⚡ **실시간 동기화**: 여러 디바이스 간 실시간 데이터 동기화\n- 🔧 **커스터마이징**: 다양한 설정으로 자신만의 환경 구성\n- 📊 **분석 대시보드**: 상세한 통계 및 분석 기능 제공\n\n프로젝트의 핵심 기능들을 이모지와 함께 설명해주세요.",
  },
  {
    title: "기술 스택",
    content:
      "## 🛠 기술 스택\n\n| 분류 | 기술 스택 |\n| :-- | :-- |\n| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) |\n| **Styling** | ![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) |\n| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white) |\n| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) |\n| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?logo=typeorm&logoColor=white) |\n| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white) ![GitHub_Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white) |\n| **Cloud** | ![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonaws&logoColor=white) ![Google_Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?logo=googlecloud&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) |\n| **Testing** | ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white) ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white) ![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white) |\n| **Tools** | ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black) |\n\n사용된 기술들을 카테고리별로 정리하고 각 기술마다 공식 배지를 추가했습니다.",
  },
  {
    title: "스크린샷",
    content:
      '## 📸 스크린샷\n\n### 메인 화면\n<img src="https://via.placeholder.com/800x400/667eea/ffffff?text=메인+화면" alt="메인 화면" width="800"/>\n\n### 대시보드\n<img src="https://via.placeholder.com/800x400/764ba2/ffffff?text=대시보드" alt="대시보드" width="800"/>\n\n### 설정 페이지\n<img src="https://via.placeholder.com/800x400/f093fb/ffffff?text=설정+페이지" alt="설정 페이지" width="800"/>\n\n<details>\n<summary>더 많은 스크린샷 보기</summary>\n\n### 모바일 화면\n<img src="https://via.placeholder.com/400x800/4facfe/ffffff?text=모바일" alt="모바일 화면" width="300"/>\n\n### 다크 모드\n<img src="https://via.placeholder.com/800x400/1a1a1a/ffffff?text=다크+모드" alt="다크 모드" width="800"/>\n\n</details>\n\n실제 애플리케이션의 스크린샷을 추가하여 사용자에게 시각적인 정보를 제공하세요.',
  },
  {
    title: "문서",
    content:
      "## 📚 문서\n\n| 문서 | 설명 | 링크 |\n| :-- | :-- | :-- |\n| **시작하기** | 설치 및 초기 설정 가이드 | [바로가기](./docs/getting-started.md) |\n| **API 레퍼런스** | 전체 API 엔드포인트 및 사용법 | [바로가기](./docs/api-reference.md) |\n| **사용자 가이드** | 기능별 상세 사용 방법 | [바로가기](./docs/user-guide.md) |\n| **아키텍처** | 시스템 구조 및 설계 문서 | [바로가기](./docs/architecture.md) |\n| **기여 가이드** | 프로젝트 기여 방법 안내 | [바로가기](./CONTRIBUTING.md) |\n| **변경 이력** | 버전별 변경 사항 | [바로가기](./CHANGELOG.md) |\n| **보안 정책** | 보안 취약점 보고 절차 | [바로가기](./SECURITY.md) |\n\n### 추가 리소스\n- 📹 [튜토리얼 영상](https://youtube.com/playlist)\n- 💬 [커뮤니티 포럼](https://github.com/username/repo/discussions)\n- 📖 [블로그 포스트](https://blog.example.com)\n- 🎓 [온라인 강의](https://course.example.com)",
  },
  {
    title: "트러블 슈팅",
    content:
      "## 🔧 문제 해결\n\n### 자주 발생하는 문제\n\n<details>\n<summary><strong>설치 오류 (EACCES permission denied)</strong></summary>\n\n**문제:** npm 설치 시 권한 오류 발생\n\n**해결 방법:**\n```bash\n# Node.js 권한 설정\nsudo chown -R $USER /usr/local/lib/node_modules\n\n# 또는 nvm 사용 권장\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\n```\n</details>\n\n<details>\n<summary><strong>애플리케이션이 시작되지 않음</strong></summary>\n\n**문제:** 실행 시 오류 발생\n\n**해결 방법:**\n1. 환경 변수 확인\n   ```bash\n   cp .env.example .env\n   # .env 파일 수정\n   ```\n\n2. 의존성 재설치\n   ```bash\n   rm -rf node_modules package-lock.json\n   npm install\n   ```\n\n3. 포트 충돌 확인\n   ```bash\n   # 사용 중인 포트 확인 (macOS/Linux)\n   lsof -i :3000\n   \n   # 사용 중인 포트 확인 (Windows)\n   netstat -ano | findstr :3000\n   ```\n</details>\n\n<details>\n<summary><strong>데이터베이스 연결 실패</strong></summary>\n\n**문제:** 데이터베이스 연결 오류\n\n**해결 방법:**\n- 데이터베이스 서비스 실행 확인\n- 연결 정보 (호스트, 포트, 비밀번호) 재확인\n- 방화벽 설정 확인\n- 데이터베이스 로그 확인\n</details>\n\n### 도움 받기\n\n문제가 해결되지 않으면:\n- 🐛 [이슈 등록](https://github.com/username/repo/issues/new)\n- 💬 [디스코드 커뮤니티](https://discord.gg/example)\n- 📧 이메일: support@example.com\n- 💡 [GitHub Discussions](https://github.com/username/repo/discussions)",
  },
  {
    title: "로드맵",
    content:
      "## 🗺 로드맵\n\n### 2026년 1분기 (완료)\n- [x] ✅ 프로젝트 초기 설정 및 구조 설계\n- [x] ✅ 핵심 기능 구현\n- [x] ✅ 베타 버전 출시 (v0.9.0)\n- [x] ✅ 초기 사용자 피드백 수집\n\n### 2026년 2분기 (진행 중)\n- [x] ✅ 정식 버전 1.0 출시\n- [ ] 🚧 다국어 지원 추가 (영어, 일본어)\n- [ ] 🚧 성능 최적화 (로딩 속도 50% 향상)\n- [ ] 📅 모바일 앱 개발 시작\n\n### 2026년 3분기 (계획)\n- [ ] 📅 API v2 출시\n- [ ] 📅 실시간 협업 기능\n- [ ] 📅 고급 분석 대시보드\n- [ ] 📅 써드파티 통합 (Slack, Discord, Notion)\n\n### 2026년 4분기 (계획)\n- [ ] 📅 AI 기반 추천 시스템\n- [ ] 📅 엔터프라이즈 플랜 출시\n- [ ] 📅 플러그인 마켓플레이스\n- [ ] 📅 오프라인 모드 지원\n\n### 장기 계획\n- 💡 머신러닝 통합\n- 💡 블록체인 기술 도입\n- 💡 AR/VR 지원\n- 💡 IoT 디바이스 연동\n\n> 로드맵은 상황에 따라 변경될 수 있습니다. 최신 진행 상황은 [프로젝트 보드](https://github.com/username/repo/projects)에서 확인하세요.\n\n**범례**\n- ✅ 완료\n- 🚧 진행 중\n- 📅 예정",
  },
  {
    title: "라이선스",
    content:
      '## 📄 라이선스\n\n이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.\n\n### MIT License\n\n```\nMIT License\n\nCopyright (c) 2026 [프로젝트명] Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n```\n\n### 라이선스 요약\n\n✅ **허용사항**\n- 상업적 사용\n- 수정\n- 배포\n- 개인적 사용\n- 특허 사용\n\n❌ **제한사항**\n- 책임\n- 보증\n\n📋 **조건**\n- 라이선스 및 저작권 고지 포함\n\n다른 라이선스를 사용하려면 [choosealicense.com](https://choosealicense.com/)을 참조하세요.',
  },
  {
    title: "FAQ",
    content:
      "## ❓ 자주 묻는 질문 (FAQ)\n\n### 일반\n\n<details>\n<summary><strong>이 프로젝트는 무엇인가요?</strong></summary>\n<br>\n\n이 프로젝트는 [프로젝트의 주요 목적과 기능을 간단히 설명]하기 위한 오픈소스 프로젝트입니다.\n\n</details>\n\n<details>\n<summary><strong>무료로 사용할 수 있나요?</strong></summary>\n<br>\n\n네, 이 프로젝트는 MIT 라이선스 하에 무료로 제공되며 상업적 용도로도 사용 가능합니다.\n\n</details>\n\n<details>\n<summary><strong>기여는 어떻게 하나요?</strong></summary>\n<br>\n\n[기여 가이드](./CONTRIBUTING.md)를 참조해주세요. Pull Request와 Issue 제출을 환영합니다!\n\n</details>\n\n### 기술\n\n<details>\n<summary><strong>시스템 요구사항이 어떻게 되나요?</strong></summary>\n<br>\n\n**최소 사양:**\n- Node.js 18.x 이상\n- npm 9.x 또는 yarn 1.22.x 이상\n- 4GB RAM\n- 1GB 디스크 공간\n\n**권장 사양:**\n- Node.js 20.x LTS\n- 8GB RAM 이상\n- SSD 스토리지\n\n</details>\n\n<details>\n<summary><strong>어떤 브라우저를 지원하나요?</strong></summary>\n<br>\n\n| 브라우저 | 최소 버전 |\n| :-- | :-- |\n| Chrome | 90+ |\n| Firefox | 88+ |\n| Safari | 14+ |\n| Edge | 90+ |\n\n</details>\n\n<details>\n<summary><strong>모바일에서도 사용할 수 있나요?</strong></summary>\n<br>\n\n네, 반응형 디자인을 적용하여 모바일, 태블릿에서도 최적화된 화면을 제공합니다.\n\n</details>\n\n<details>\n<summary><strong>상업적 프로젝트에 사용해도 되나요?</strong></summary>\n<br>\n\n네, MIT 라이선스 조건에 따라 자유롭게 사용 가능합니다. 단, 라이선스 고지는 포함해주세요.\n\n</details>\n\n### 기능\n\n<details>\n<summary><strong>오프라인에서도 작동하나요?</strong></summary>\n<br>\n\n현재 버전은 온라인 연결이 필요합니다. 오프라인 모드는 향후 업데이트에서 지원 예정입니다.\n\n</details>\n\n<details>\n<summary><strong>데이터는 어디에 저장되나요?</strong></summary>\n<br>\n\n- **로컬 데이터**: 브라우저 LocalStorage/IndexedDB\n- **클라우드 데이터**: [사용하는 클라우드 서비스명]\n- 모든 데이터는 암호화되어 안전하게 저장됩니다.\n\n</details>\n\n### 지원\n\n<details>\n<summary><strong>문제가 발생했을 때 어디에 문의하나요?</strong></summary>\n<br>\n\n**지원 채널:**\n- 🐛 [GitHub Issues](https://github.com/username/repo/issues) - 버그 리포트\n- 💬 [GitHub Discussions](https://github.com/username/repo/discussions) - 질문 및 토론\n- 💬 [Discord](https://discord.gg/example) - 실시간 채팅\n- 📧 Email: support@example.com\n\n**응답 시간:**\n- 긴급 버그: 24시간 이내\n- 일반 문의: 2-3 영업일 이내\n\n</details>\n\n<details>\n<summary><strong>업데이트는 얼마나 자주 하나요?</strong></summary>\n<br>\n\n- **주요 버전**: 분기별 (3개월)\n- **마이너 버전**: 월별\n- **패치/보안 업데이트**: 필요시 즉시\n\n[릴리스 노트](https://github.com/username/repo/releases)에서 최신 업데이트를 확인하세요.\n\n</details>",
  },
];

const Section = () => {
  const { createSection } = useSection();
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sections = useMemo(() => {
    return preparedSections.filter((section) => section.title.includes(title));
  }, [title]);

  const handleModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setNewSectionTitle("");
    setIsOpen(false);
  };

  const handleCreateSection = () => {
    if (newSectionTitle.trim() === "") {
      toast.error("섹션 이름을 입력해주세요.");
      return;
    }

    createSection(
      { title: newSectionTitle, content: null },
      {
        onSuccess: () => {
          toast.success("섹션 추가되었습니다.");
          setNewSectionTitle("");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("섹션 추가에 실패했습니다.");
        },
      }
    );
  };

  const handleAddSection = (title: string, content: string) => {
    createSection(
      { title, content },
      {
        onSuccess: () => {
          toast.success("섹션 추가되었습니다.");
        },
        onError: () => {
          toast.error("섹션 추가에 실패했습니다.");
        },
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        width="30rem"
      >
        <div className={styles.modalContent}>
          <h2 className="text-emphasis-large">섹션 추가</h2>
          <div className="input-field">
            <input
              type="text"
              placeholder="섹션 이름"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </div>
          <div className={styles.btnGroup}>
            <button
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              <p>취소</p>
            </button>
            <button
              className={`${styles.btn} ${styles.addBtn}`}
              onClick={handleCreateSection}
            >
              <p>섹션 추가</p>
            </button>
          </div>
        </div>
      </Modal>
      <div className={`input-field ${styles.inputField}`}>
        <input
          type="text"
          placeholder="섹션 검색"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.btnGroup}>
        <button
          className={`${styles.btn} ${styles.addBtn}`}
          onClick={handleModal}
        >
          <img src={add} alt="add" />
          <p>섹션 추가</p>
        </button>
      </div>
      <ul className={`${styles.sectionList} section-list`}>
        {sections.map((section) => (
          <li
            key={section.title}
            className={styles.sectionItem}
            onClick={() => handleAddSection(section.title, section.content)}
          >
            <p>{section.title}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Section;
