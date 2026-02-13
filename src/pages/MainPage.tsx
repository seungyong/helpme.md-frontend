import { Link } from "react-router-dom";

import styles from "./MainPage.module.scss";

import danger from "@assets/images/danger.svg";
import { APIEndpoint } from "@src/types/APIEndpoint";

const MainPage = () => {
  const howToUseCards = [
    {
      number: "①",
      title: "Github 로그인",
      description:
        "Github OAuth Apps 로그인하고, 토큰을 암호화해 안전하게 보관합니다. 별도 비밀번호 없이 Github 계정만으로 바로 시작할 수 있습니다.",
      subDescription: "로그인 / 회원가입 통합",
    },
    {
      number: "②",
      title: "Github Repository 선택",
      description: "작성 및 분석할 Github Repository를 선택합니다.",
      subDescription: "Repository 선택",
    },
    {
      number: "③",
      title: "AI로 README.md 작성",
      description:
        "폴더 구조, 의존성 파일, 기술 스택, 코드 등을 분석해 프로젝트의 소개, 기능 설명, 사용 방법 등을 자동으로 작성합니다.",
      subDescription: "README.md 자동 생성",
    },
    {
      number: "④",
      title: "편집 · 평가 · PR",
      description:
        "Markdown Editor, Preview를 활용해 바로 수정하고, 선택한 브랜치로 Pull Request를 생성합니다. README 품질은 점수와 피드백으로 확인하세요.",
      subDescription: "편집 · 평가 · PR",
    },
  ];

  const handleGithubLogin = () => {
    sessionStorage.setItem("redirectUrl", "/repo/select");
    window.location.replace(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.OAUTH2_LOGIN}`
    );
  };

  const howToReads = [
    "폴더/파일 구조 (src, app, docs, etc.)",
    "의존성/빌드 파일 (gradle, requirements.txt, package.json, etc.)",
    "사용 언어와 주요 기술 스택",
    "주요 모듈/함수 코드",
    "커밋 내역",
    "기존 README.md 내용",
  ];

  return (
    <main className={styles.main}>
      <section className={styles.mainSection}>
        <h1 className={`text-emphasis-large ${styles.mainTitle}`}>
          정성 들인 프로젝트, <br /> 버튼 한 번이면{" "}
          <span className={styles.emphasisText}>README.md</span> 까지
        </h1>
        <p className="text-description text-sub-color">
          Github Repository의 구조와 파일을 분석해, 포트폴리오용 README.md를
          자동 생성해드립니다.
          <br />
          Markdown Editor에서 자유롭게 수정하고, 컴포넌트를 재사용해 프로젝트
          소개를 더 쉽게 만드세요.
        </p>
        <div className={styles.btnGroup}>
          <Link className={styles.githubBtn} onClick={handleGithubLogin} to="#">
            Github로 시작하기
          </Link>
          <a href="#how-to-use" className={styles.subBtn}>
            어떤 식으로 만들어져요?
          </a>
        </div>
      </section>
      <section className={styles.howToUseSection} id="how-to-use">
        <h4 className="text-emphasis-medium">README 생성, 이렇게 진행돼요</h4>
        <p className="text-description text-sub-color">
          로그인부터 Pull Request까지 개발자가 자주 하는 흐름 기준으로
          설계했습니다.
        </p>
        <ol className={styles.howToUseList}>
          {howToUseCards.map((card) => (
            <li key={card.number}>
              <div className={styles.howToUseItem}>
                <div className={styles.howToUseItemNumber}>{card.number}</div>
                <p className="text-emphasis">{card.title}</p>
                <p
                  className={`text-description text-sub-color ${styles.howToUseItemDescription}`}
                >
                  {card.description}
                </p>
                <p
                  className={`text-sub-dark-color ${styles.howToUseItemSubDescription}`}
                >
                  {card.subDescription}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h4 className="text-emphasis-medium">
          AI는 프로젝트의 어떤 부분을 읽을까요?
        </h4>
        <p className="text-description text-sub-color">
          단순 코드 요약이 아니라, 실제로 README.md를 작성하는 것처럼 프로젝트의
          구조와 기능을 이해하고 작성합니다.
        </p>
        <div className={styles.howToReadContent}>
          <div>
            <p className="text-emphasis">분석 대상 정보</p>
            <ul className={styles.howToReadList}>
              {howToReads.map((read) => (
                <li key={read} className="text-description text-sub-color">
                  {read}
                </li>
              ))}
            </ul>
            <p className={styles.danger}>
              <img src={danger} alt="danger" />
              주요 파일의 내용은 분석을 위해 활용되니, 보안이 민감한 프로젝트는
              사용을 자제해주세요.
            </p>
          </div>
          <div>
            <p className="text-emphasis">README.md 평가도 함께 제공</p>
            <p
              className={`text-description text-sub-color ${styles.howToReadDescription}`}
            >
              생성된 README.md는 가독성, 신뢰성, 용이성 등을 기준으로 5점
              만점으로 평가되고, 부족한 부분에 대한 개선 팁을 제안합니다.
            </p>
            <div className={styles.howToReadScore}>
              <p className={`text-description ${styles.howToReadScoreTitle}`}>
                Score : 3.7/5.0
              </p>
              <ul className="text-description">
                <li>
                  장점 : 코드 구조가 명확하고 이해하기 쉽게 작성되었습니다.
                </li>
                <li>개선 : 설치 / 실행 예제가 부족합니다.</li>
                <li>개선 : 기술 스택 설명이 부족합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
