import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import styles from "./GenerationButton.module.scss";

import generate from "@assets/images/generate.svg";

import { apiClient } from "@src/utils/apiClient";

import { ApiError } from "@src/types/error";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";
import { Sections } from "@src/types/section";

import { useSse } from "@src/hooks/useSse";
import { useBranch } from "@src/hooks/useBranch";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const GenerationButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { owner, name } = useParams();
  const { initialBranch } = useBranch();
  const { listen } = useSse(
    ["generation", owner || "", name || ""],
    "completion-generate"
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const handleGeneration = () => {
    setIsLoading(true);
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleConfirm = () => {
    listen();
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  const showResult = (data: Sections) => {
    console.log(data);
    setIsLoading(false);
  };

  const handleFallback = useCallback(async () => {
    const taskId = queryClient.getQueryData([
      "generation",
      owner,
      name,
      "taskId",
    ]) as string;

    if (!taskId) {
      toast.error("생성에 실패했습니다.");
      return;
    }

    try {
      const fallbackData = await apiClient<Sections>(
        generateAPIEndpoint(APIEndpoint.GENERATE_FALLBACK, taskId)
      );

      if (fallbackData) {
        showResult(fallbackData);
      }
    } finally {
      toast.error("생성에 실패했습니다.");
      setIsLoading(false);
    }
  }, [owner, name, queryClient]);

  useEffect(() => {
    const error = queryClient.getQueryData([
      "generation",
      owner,
      name,
      "error",
    ]) as ApiError;

    if (error) {
      handleFallback();
      return;
    }

    const data = queryClient.getQueryData(["generation", owner, name]);

    if (data) {
      showResult(data as Sections);
    }

    return () => {
      queryClient.removeQueries({
        queryKey: ["generation", owner, name],
      });
    };
  }, [owner, name, queryClient, handleFallback]);

  if (!owner || !name) {
    toast.error("잘못된 접근입니다.");
    navigate("/");
    return;
  }

  return (
    <>
      <WarningModal
        isOpen={isLoading}
        onRequestClose={handleCancel}
        title="AI 초안 생성"
        description={
          <p>
            AI를 활용한 README 초안 생성은 프로젝트의 커밋 내역, 코드, 구조,
            언어 등 여러 가지 정보를 참고하여 만들어집니다.
          </p>
        }
        cancelButtonText="취소"
        confirmButtonText="생성 시작"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handleGeneration}
        isLoading={isLoading}
        className={styles.generationBtn}
      >
        <img src={generate} alt="generation" />
        AI 초안 생성
      </LoadingButton>
    </>
  );
};

export default GenerationButton;
