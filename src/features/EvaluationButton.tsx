import { useState, useMemo, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./EvaluationButton.module.scss";

import evaluation from "@assets/images/evaluation.svg";

import { Evaluation } from "@src/types/evaluation";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";

import { useSection } from "@src/hooks/useSection";
import { useBranch } from "@src/hooks/useBranch";
import { useSse } from "@src/hooks/useSse";
import { apiClient } from "@src/utils/apiClient";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const EvaluationButton = () => {
  const { owner, name } = useParams();

  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["evaluation", owner || "", name || ""],
    [owner, name]
  );
  const { listen } = useSse(queryKey, "completion-evaluate-draft");

  const { fullContent } = useSection();
  const { initialBranch } = useBranch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const { mutate: fallbackMutation } = useMutation({
    mutationFn: async (taskId: string) => {
      return apiClient<Evaluation>(
        generateAPIEndpoint(APIEndpoint.EVALUATE_FALLBACK, taskId)
      );
    },
  });

  const { mutate: evaluateMutation } = useMutation({
    mutationFn: async (taskId: string) => {
      return apiClient<void>(
        `${generateAPIEndpoint(APIEndpoint.EVALUATE, owner || "", name || "")}?taskId=${taskId}`,
        {
          method: "POST",
          body: JSON.stringify({
            branch: effectiveBranch,
            content: fullContent,
          }),
        }
      );
    },
  });

  const handleCancel = () => {
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleEvaluation = () => {
    setIsOpen(true);

    listen<Evaluation>({
      onSuccess: () => {
        closeModalAndReset();
      },
      onError: () => {
        setIsLoading(false);
        toast.error("평가에 실패했습니다.");
      },
    });
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  const getTaskId = useCallback(() => {
    return queryClient.getQueryData<string>([...queryKey, "taskId"]);
  }, [queryClient, queryKey]);

  const closeModalAndReset = useCallback(() => {
    setIsLoading(false);
    setIsOpen(false);
  }, []);

  const handleFallback = useCallback(() => {
    const taskId = queryClient.getQueryData<string>([...queryKey, "taskId"]);

    if (!taskId) {
      toast.error("평가에 실패했습니다.");
      return;
    }

    fallbackMutation(taskId, {
      onSuccess: () => {
        closeModalAndReset();
      },
      onError: () => {
        toast.error("평가에 실패했습니다.");
        setIsLoading(false);
      },
    });
  }, [queryClient, queryKey, fallbackMutation, closeModalAndReset]);

  const handleConfirm = () => {
    setIsLoading(true);

    const taskId = getTaskId();
    if (!taskId) {
      toast.error("평가에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    evaluateMutation(taskId, {
      onSuccess: () => {
        toast.loading("평가 중입니다...", {
          duration: Infinity,
        });

        setIsOpen(false);
      },
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
  }, [queryClient, queryKey]);

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
        title="README 평가"
        description={
          <>
            <p>
              현재 작성한 README.md를 평가하며, 프로젝트의 커밋 내역, 코드,
              구조, 언어 등 여러 가지 정보를 참고하여 만들어집니다.
            </p>
            <p>
              반드시, 생성 전 프로젝트의{" "}
              <span className={styles.emphasisText}>민감한 정보</span> (API Key,
              .env 파일 등)를 제거해주세요.
            </p>
          </>
        }
        cancelButtonText="취소"
        confirmButtonText="평가 시작"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handleEvaluation}
        isLoading={isLoading}
        className={styles.evaluationBtn}
      >
        <img src={evaluation} alt="evaluation" />
        README 평가
      </LoadingButton>
    </>
  );
};

export default EvaluationButton;
