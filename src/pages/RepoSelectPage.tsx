import { useState, useEffect, useRef, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import styles from "./RepoSelectPage.module.scss";

import search from "@assets/images/search.svg";

import { useAuth } from "@src/hooks/useAuth";
import { apiClient } from "@src/utils/apiClient";

import { Installation } from "@src/types/installation";
import { APIEndpoint } from "@src/types/APIEndpoint";
import { Repositories, RepositoryItem } from "@src/types/repository";

const RepoSelectPage = () => {
  const PAGE_SIZE: number = 30;
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>("");
  const [selectedInstallationId, setSelectedInstallationId] = useState<
    string | null
  >(null);
  const { isLoggedIn } = useAuth();

  const { data: installations, refetch: refetchInstallations } = useQuery({
    queryKey: ["installations"],
    queryFn: () =>
      apiClient
        .get<Installation>(APIEndpoint.INSTALLATIONS)
        .then((response) => response.data),
    select: (data) => data.installations,
    refetchOnWindowFocus: true,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch: refetchRepositories,
  } = useInfiniteQuery<Repositories>({
    queryKey: ["repositories", selectedInstallationId],
    queryFn: ({ pageParam }) =>
      apiClient
        .get<Repositories>(
          `${APIEndpoint.REPOSITORIES}?installation_id=${selectedInstallationId}&page=${pageParam}&per_page=${PAGE_SIZE}`
        )
        .then((response) => response.data),
    enabled: !!selectedInstallationId,
    getNextPageParam: (lastPage, pages) => {
      // 마지막 페이지가 PAGE_SIZE보다 작으면 더 이상 페이지 없음
      if (lastPage.repositories.length < PAGE_SIZE) {
        return undefined;
      }

      // 지금까지 가져온 총 개수 계산
      const totalFetched = pages.reduce(
        (acc, page) => acc + page.repositories.length,
        0
      );

      if (totalFetched < lastPage.totalCount) {
        return pages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: true,
  });

  const repositories = useMemo(() => {
    return data?.pages.flatMap((page) => page.repositories) || [];
  }, [data?.pages]);

  const filteredRepositories = useMemo(() => {
    if (!keyword.trim()) {
      return repositories;
    }
    return repositories.filter((repository: RepositoryItem) =>
      repository.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [repositories, keyword]);

  const observerRef = useRef<HTMLLIElement>(null);

  const handleInstallationLink = () => {
    const popup = window.open(
      `${import.meta.env.VITE_GITHUB_INSTALLATION_URL}`,
      "_blank",
      "width=800,height=600"
    );

    // 팝업 창 닫힘 감지
    const checkPopupClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkPopupClosed);

        // 팝업 닫힌 후 API 재호출
        refetchInstallations();

        if (selectedInstallationId) {
          refetchRepositories();
        }
      }
    }, 500);

    return () => {
      clearInterval(checkPopupClosed);
    };
  };

  const handleWriteButton = (repository: RepositoryItem) => {
    navigate(`/repo/${repository.owner}/${repository.name}`);
  };

  useEffect(() => {
    if (!selectedInstallationId || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [selectedInstallationId, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isLoggedIn) {
    sessionStorage.setItem("redirectUrl", "/repo/select");
    window.location.replace(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.OAUTH2_LOGIN}`
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.mainSection}>
        <h1 className={`text-emphasis-large ${styles.mainTitle}`}>
          README를 작성할 Github Repository를 선택해주세요.
        </h1>
        <div className={styles.repoSelectGroup}>
          <div className={styles.repoSelectWrapper}>
            {selectedInstallationId && (
              <img
                src={
                  installations?.find(
                    (i) => i.installationId === selectedInstallationId
                  )?.avatarUrl
                }
                alt="avatar"
                className={styles.repoSelectAvatar}
              />
            )}
            <select
              className={styles.repoSelect}
              value={selectedInstallationId || ""}
              onChange={(e) => setSelectedInstallationId(e.target.value)}
            >
              <option value="" disabled>
                Organization 선택
              </option>
              {installations?.map((installation) => (
                <option
                  key={installation.installationId}
                  value={installation.installationId}
                >
                  {installation.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="Repository 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button>
              <img src={search} alt="search" />
            </button>
          </div>
        </div>
        <ul className={styles.repoList}>
          {isFetching && filteredRepositories.length === 0 ? (
            <li className={styles.repoItem}>
              <div className={styles.repoItemTitle}>
                <img src={search} alt="repo" />
                <p>Loading...</p>
              </div>
            </li>
          ) : filteredRepositories.length === 0 ? (
            <li className={styles.repoItem}>
              <div className={styles.repoItemTitle}>
                <p>검색 결과가 없습니다.</p>
              </div>
            </li>
          ) : (
            <>
              {filteredRepositories.map((repository: RepositoryItem) => (
                <li key={`${repository.owner}-${repository.name}`}>
                  <div className={styles.repoItem}>
                    <div className={styles.repoItemTitle}>
                      <img src={repository.avatarUrl} alt="repo" />
                      <p>{repository.name}</p>
                    </div>
                    <button onClick={() => handleWriteButton(repository)}>
                      작성
                    </button>
                  </div>
                </li>
              ))}
              {/* 무한 스크롤 트리거 */}
              {hasNextPage && (
                <li ref={observerRef} style={{ height: "1px" }} />
              )}
              {isFetchingNextPage && (
                <li className={styles.repoItem}>
                  <div className={styles.repoItemTitle}>
                    <p>더 불러오는 중...</p>
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
        <p className="text-description text-sub-color">
          연겯되지 않은 Repository가 있나요?{" "}
          <a
            className={styles.installationLink}
            onClick={handleInstallationLink}
          >
            바로 연결해보세요 →
          </a>
        </p>
      </section>
    </main>
  );
};

export default RepoSelectPage;
