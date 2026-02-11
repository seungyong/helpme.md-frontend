import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import styles from "./PRButton.module.scss";

import arrowUp from "@assets/images/arrow-up.svg";

import { ApiError } from "@src/types/error";
import { PR } from "@src/types/repository";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";

import { useBranch } from "@src/hooks/useBranch";
import { useSection } from "@src/hooks/useSection";
import { apiClient } from "@src/utils/apiClient";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const PRButton = () => {
  const { initialBranch } = useBranch();
  const { fullContent } = useSection();
  const { owner, name } = useParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const { mutate: createPRMutation } = useMutation<PR, ApiError>({
    mutationFn: async () => {
      const response = await apiClient.post<PR>(
        generateAPIEndpoint(APIEndpoint.CREATE_PR, owner || "", name || ""),
        { branch: effectiveBranch, content: fullContent }
      );

      return response.data;
    },
  });

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  const handlePR = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setIsOpen(false);
    toast.loading("PR 생성 중입니다...", {
      duration: Infinity,
    });

    createPRMutation(undefined, {
      onSuccess: (data) => {
        toast.dismiss();
        toast.success("PR 생성이 완료되었습니다.");

        if (data?.htmlUrl && window.confirm("PR 페이지를 열겠습니까?")) {
          window.open(data.htmlUrl, "_blank", "noopener,noreferrer");
        }

        setIsLoading(false);
        setIsOpen(false);
      },
      onError: () => {
        toast.dismiss();
        toast.error("PR 생성에 실패했습니다.");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <>
      <WarningModal
        isOpen={isOpen}
        isLoading={isLoading}
        onRequestClose={handleCancel}
        title="PR 생성"
        description={
          <>
            <p>PR을 생성할 브랜치를 선택해주세요.</p>
            <p>현재 작업하신 README.md 내용을 기반으로 PR을 생성합니다.</p>
            <p>
              반드시, 생성 전 프로젝트의{" "}
              <span className={styles.emphasisText}>민감한 정보</span> (API Key,
              .env 파일 등)를 제거해주세요.
            </p>
          </>
        }
        cancelButtonText="취소"
        confirmButtonText="PR 생성"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handlePR}
        isLoading={isLoading}
        className={styles.prBtn}
      >
        <img src={arrowUp} alt="arrow up" />
        PR 생성
      </LoadingButton>
    </>
  );
};

export default PRButton;
