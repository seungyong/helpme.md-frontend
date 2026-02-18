# helpme.md — Frontend

## 소개

helpme.md 프론트엔드 애플리케이션은 GitHub 리포지토리의 README를 기준으로 섹션을 자동 생성 · 편집하고, AI 초안 생성 및 PR을 돕는 생산성 도구입니다. 사용자는 리포지토리를 선택하여 README 기반으로 섹션을 분리 / 병합하고, 섹션 순서 변경, 편집, 평가, AI 초안 생성 및 PR 생성 등의 흐름을 직관적으로 수행할 수 있습니다.

## 주요 기능

- GitHub OAuth2 기반 인증/리디렉션 및 로그인 상태 관리
- 토큰 재발급(reissue) 처리: axios interceptor + 요청 큐(lock)로 401 동시 재발급 문제 해결
- 리포지토리 선택(installation 기반 조회), 검색, 무한 스크롤 지원
- README를 기준으로 섹션 자동 분리(InitSection), 섹션 병합 기능
- 섹션 CRUD: 추가, 편집(Markdown editor + Preview), 삭제
- 섹션 드래그 앤 드롭(순서 변경) 및 고정/최소 높이 지정
- AI 초안 생성 API 연동(초안 생성 버튼), PR 생성 API 연동
- 평가(Evaluation) 워크플로우: 백그라운드 작업 전환 + SSE로 진행 상태 수신
- SSE 연결 관리(useSse): 컴포넌트별 SSE 1회 연결 제한, 이벤트 콜백 처리
- 공통 UI 컴포넌트: LoadingButton, Spinner, Modal, WarningModal 등
- Vercel 배포 설정

## 기술 스택

| 구분 | 기술 스택 |
|------|-----------|
| Frontend | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=TypeScript&logoColor=white) |
| 번들/빌드 | ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) |
| 스타일링 | ![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white) |
| HTTP / 클라이언트 | ![Axios](https://img.shields.io/badge/Axios-007FFF?logo=axios&logoColor=white) |
| 상태/데이터 패칭 | ![React_Query](https://img.shields.io/badge/React_Query-2F80ED?logo=reactquery&logoColor=white) |
| 실시간 | ![SSE](https://img.shields.io/badge/SSE-333333?logo=stream&logoColor=white) |
| 배포 | ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) |

## 프로젝트 인원

| 이름 | 역할 | 기능 |
|------|------|------|
|   김승용   |   Frontend   |   기획, 개발, 배포   |

## 시스템 구조 및 아키텍처

프로젝트 주요 파일/폴더 트리(요약):

- package.json — 의존성 및 스크립트
- index.html — Vite 엔트리 HTML
- vite.config.js — Vite 설정(필수 env 검사 포함)
- vercel.json — Vercel 배포 설정
- tsconfig.json — TypeScript 설정
- src/
  - main.tsx — 앱 진입점, 전역 Provider 등록
  - App.tsx — 라우팅 및 전역 레이아웃
  - components/
    - common/ — 공통 UI 컴포넌트(Header, Footer, Modal, Spinner, LoadingButton 등)
    - repo/ — 리포지토리 상세/섹션 관련 컴포넌트(Section, MarkdownEditor, DragableSection 등)
  - features/ — 기능별 버튼 컴포넌트(GenerationButton, EvaluationButton, PRButton 등)
  - hooks/ — 재사용 훅(useAuth, useSection, useBranch, useSse, useIsRepoPage 등)
  - pages/ — 라우트 단위 화면(MainPage, RepoSelectPage, RepoDetailPage, Settings 등)
  - providers/ — Context / Provider(AuthProvider, SectionProvider)
  - styles/ — 전역 SCSS 및 에디터 관련 스타일
  - types/ — 타입 정의(APIEndpoint, repository, section 등)
  - utils/
    - apiClient.ts — axios 인스턴스, interceptor(토큰 재발급, 요청 큐) 구현

폴더 역할(요약):

- src/components: UI 컴포넌트 모음 — 재사용 가능한 프리미티브와 리포지토리 관련 컴포넌트 포함
- src/features: 비즈니스 버튼/행동을 캡슐화한 컴포넌트(각 API와 로직 분리)
- src/hooks: 커스텀 훅(인증, 섹션 관리, SSE 관리 등)
- src/pages: 화면 단위 컴포넌트(라우팅 기준)
- src/providers: Context 기반 상태 관리(섹션/인증 등 전역 상태)
- src/utils: 공용 유틸(axios 클라이언트, API 호출 래퍼 등)

진입점 파일

- src/main.tsx — React DOM 렌더링 및 Provider(예: AuthProvider, SectionProvider) 등록
- src/App.tsx — 라우터, 전역 레이아웃 및 페이지 연결
- src/utils/apiClient.ts — 전역 axios 인스턴스(재발급 로직 포함)

아키텍처 요약

- 인증: OAuth2 흐름 + /auth/check, useAuth 훅 및 AuthProvider로 상태 관리
- API: axios 인스턴스에 interceptor 적용하여 401 발생 시 재발급(reissue) 처리 및 요청 큐(lock)로 동시성 제어
- 실시간/백그라운드: SSE(useSse 훅)로 서버 작업 진행 상태 수신, 평가(Evaluation) 및 AI 생성 작업에 사용
- 섹션 관리: SectionProvider + useSection 훅으로 섹션 목록/클릭, 상태/재요청 관리를 안전하게 처리

## 라이선스 (License)

This project is licensed under the MIT License.

## 추가 정보 및 개발 노트

- 해당 README는 Helpme.md의 **AI 초안 생성**으로 생성된 내용입니다.
- 주요 훅: useAuth, useSection, useSse — 각각 인증 흐름, 섹션 상태관리, SSE 연결 관리를 담당합니다.
- 주요 유틸: apiClient.ts — axios 기반 공용 클라이언트(재발급 로직 포함)
- UI/UX: Markdown 편집기(MarkdownEditor)와 Preview, 드래그 가능한 섹션, 모달을 통한 섹션 초기화/추가/삭제 UX가 포함되어 있습니다.
- 커밋 로그에서 확인되는 지속적 개선 포인트: 모바일 에디터 CSS, 섹션 로딩 타이밍, 팝업/타임아웃 관리, 버그(404/대소문자) 보수 등입니다.