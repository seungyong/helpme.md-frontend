import { useState, useMemo, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import styles from "./GenerationButton.module.scss";

import generate from "@assets/images/generate.svg";

import { apiClient } from "@src/utils/apiClient";

import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";
import { Sections } from "@src/types/section";

import { useSse } from "@src/hooks/useSse";
import { useBranch } from "@src/hooks/useBranch";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";
import Spinner from "@src/components/common/Spinner";
import { useSection } from "@src/hooks/useSection";

const GenerationButton = () => {
  const queryClient = useQueryClient();

  const { owner, name } = useParams();
  const { initialBranch } = useBranch();
  const queryKey = useMemo(
    () => ["generation", owner || "", name || ""],
    [owner, name]
  );
  const { refetchSections } = useSection();
  const { listen } = useSse(queryKey, "completion-generate");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const { mutate: fallbackMutation } = useMutation({
    mutationFn: async (taskId: string) => {
      return apiClient<Sections>(
        generateAPIEndpoint(APIEndpoint.GENERATE_FALLBACK, taskId)
      );
    },
  });

  const { mutate: generateMutation } = useMutation({
    mutationFn: async (taskId: string) => {
      return apiClient<void>(
        `${generateAPIEndpoint(APIEndpoint.GENERATE, owner || "", name || "")}?taskId=${taskId}`,
        {
          method: "POST",
          body: JSON.stringify({
            branch: effectiveBranch,
          }),
        }
      );
    },
  });

  const handleSelectBranch = useCallback((branch: string) => {
    setSelectedBranch(branch);
  }, []);

  const handleCancel = () => {
    setIsOpen(false);
    setIsLoading(false);
    setSelectedBranch(initialBranch);
  };

  const getTaskId = useCallback(() => {
    return queryClient.getQueryData<string>([...queryKey, "taskId"]);
  }, [queryClient, queryKey]);

  const handleResult = useCallback(() => {
    refetchSections({
      onSuccess: () => {
        setIsLoading(false);
        setIsOpen(false);
        toast.success("생성이 완료되었습니다.");
      },
      onError: () => {
        toast.error("생성에 실패했습니다.");
        setIsLoading(false);
      },
    });
  }, [refetchSections]);

  const handleFallback = useCallback(() => {
    const taskId = getTaskId();
    if (!taskId) {
      toast.error("생성에 실패했습니다.");
      return;
    }

    fallbackMutation(taskId, {
      onSuccess: () => {
        handleResult();
      },
      onError: () => {
        toast.error("생성에 실패했습니다.");
        setIsLoading(false);
      },
    });
  }, [getTaskId, fallbackMutation, handleResult]);

  const handleGeneration = () => {
    setIsOpen(true);

    listen<Sections>({
      onSuccess: () => {
        handleResult();
      },
      onError: () => {
        handleFallback();
      },
    });
  };

  const handleConfirm = () => {
    setIsLoading(true);

    const taskId = getTaskId();
    if (!taskId) {
      toast.error("생성에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    generateMutation(taskId, {
      onError: () => {
        handleFallback();
      },
    });
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [...queryKey, "taskId"],
      });
      queryClient.removeQueries({
        queryKey: [...queryKey, "error"],
      });
      queryClient.removeQueries({
        queryKey: queryKey,
      });
    };
  }, [queryClient, queryKey, handleFallback]);

  return (
    <>
      <Spinner isLoading={isLoading} message="생성 중입니다..." />
      <WarningModal
        isOpen={isOpen}
        isLoading={isLoading}
        onRequestClose={handleCancel}
        title="AI 초안 생성"
        description={
          <>
            <p>
              AI를 활용한 README 초안 생성은 프로젝트의 커밋 내역, 코드, 구조,
              언어 등 여러 가지 정보를 참고하여 만들어집니다.
            </p>
            <p>
              반드시, 생성 전 프로젝트의{" "}
              <span className={styles.emphasisText}>민감한 정보</span> (API Key,
              .env 파일 등)를 제거해주세요.
            </p>
            <p
              className={`text-description text-sub-color ${styles.descriptionText}`}
            >
              해당 작업은 20초 ~ 3분 정도 소요됩니다.
            </p>
          </>
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
