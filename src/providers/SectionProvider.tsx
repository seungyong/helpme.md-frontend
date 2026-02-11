import {
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Sections, Section } from "@src/types/section";
import { ApiError, ERROR_CODE } from "@src/types/error";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";
import {
  CreateSectionRequest,
  DeleteSectionRequest,
  InitSectionRequest,
  ReorderSectionRequest,
  UpdateSectionContentRequest,
} from "@src/types/request/repository";
import { Callback } from "@src/types/request/common";

import { apiClient } from "@src/utils/apiClient";

import { SectionContext } from "@src/hooks/useSection";

import InitSection from "@src/components/repo/InitSectionModal";

interface SectionProviderProps {
  children: ReactNode;
}

interface SectionStateManagerProps {
  initialSections: Section[];
  isLoading: boolean;
  children: React.ReactNode;
  onOpenManualModal: () => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Section[], ApiError>>;
}

export const SectionProvider = ({ children }: SectionProviderProps) => {
  const navigate = useNavigate();
  const { owner, name } = useParams();
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [hasHandledError, setHasHandledError] = useState<boolean>(false);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  const {
    data: sections,
    isError,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<Sections, ApiError, Section[]>({
    queryKey: ["sections", owner, name],
    enabled: !!owner && !!name,
    queryFn: async () => {
      const response = await apiClient.get<Sections>(
        generateAPIEndpoint(APIEndpoint.SECTIONS, owner || "", name || "")
      );
      return response.data;
    },
    select: (data) => data.sections,
    staleTime: Infinity,
    retry: false,
  });

  const shouldShowInitModal = useMemo(() => {
    return (
      isError &&
      error?.errorCode === ERROR_CODE.NOT_FOUND_SECTIONS &&
      !hasHandledError
    );
  }, [isError, error?.errorCode, hasHandledError]);

  const isInitModalOpen = useMemo(() => {
    return isManualModalOpen || shouldShowInitModal;
  }, [isManualModalOpen, shouldShowInitModal]);

  const handleOpenManualModal = useCallback(() => {
    setIsManualModalOpen(true);
  }, []);

  const handleCompleteInitSection = useCallback(async () => {
    if (debounce.current) clearTimeout(debounce.current);

    debounce.current = setTimeout(async () => {
      try {
        await refetch({ throwOnError: true });
        setHasHandledError(true);
      } catch (e) {
        const err = e instanceof ApiError ? e : null;
        if (err?.errorCode === ERROR_CODE.NOT_FOUND_SECTIONS) return;
        toast.error("생성에 실패했습니다.");
      } finally {
        setIsManualModalOpen(false);
        debounce.current = null;
      }
    }, 300);
  }, [refetch]);

  const handleRequestCloseInitModal = useCallback(() => {
    if (shouldShowInitModal && !isManualModalOpen) {
      return;
    }
    setIsManualModalOpen(false);
  }, [shouldShowInitModal, isManualModalOpen]);

  useEffect(() => {
    if (
      (isError && !(error?.errorCode === ERROR_CODE.NOT_FOUND_SECTIONS)) ||
      error?.status === 401
    ) {
      return;
    }

    if (isError) {
      toast.error("비정상적인 접근입니다.");
      navigate("/", { replace: true });
    }
  }, [isError, error, navigate]);
  useEffect(() => {
    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
    };
  }, []);

  const sectionManagerKey = useMemo(() => {
    if (!isSuccess || !sections?.length) return isSuccess ? "success" : "none";
    return `sections-${sections.map((s) => s.id).join("-")}`;
  }, [isSuccess, sections]);

  return (
    <SectionStateManager
      key={sectionManagerKey}
      initialSections={sections || []}
      isLoading={isLoading}
      onOpenManualModal={handleOpenManualModal}
      refetch={refetch}
    >
      <InitSection
        isOpen={isInitModalOpen}
        onComplete={handleCompleteInitSection}
        onClose={handleRequestCloseInitModal}
      />
      {children}
    </SectionStateManager>
  );
};

const SectionStateManager = ({
  initialSections,
  isLoading,
  children,
  onOpenManualModal,
  refetch,
}: SectionStateManagerProps) => {
  const { owner, name } = useParams();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [clickedSection, setClickedSection] = useState<Section>(
    initialSections[0]
  );

  const fullContent = useMemo(() => {
    return sections?.map((section) => section.content || "").join("\n\n") || "";
  }, [sections]);

  const { mutate: addSectionMutation } = useMutation<
    Section,
    ApiError,
    CreateSectionRequest
  >({
    mutationFn: (request) =>
      apiClient
        .post<Section>(
          generateAPIEndpoint(APIEndpoint.SECTIONS, owner || "", name || ""),
          request
        )
        .then((response) => response.data),
    onSuccess: (data) => {
      setSections((prev) => [...prev, data]);
    },
    onError: () => {
      toast.error("섹션 추가에 실패했습니다.");
    },
  });

  const { mutate: initSectionsMutation } = useMutation<
    Sections,
    ApiError,
    InitSectionRequest
  >({
    mutationFn: (request) =>
      apiClient
        .put<Sections>(
          generateAPIEndpoint(
            APIEndpoint.SECTIONS_INIT,
            owner || "",
            name || ""
          ) + `?branch=${request.branch}&splitMode=${request.splitMode}`
        )
        .then((response) => response.data),
    onSuccess: (data) => {
      setSections(data.sections);
    },
    onError: () => {
      toast.error("섹션 초기화에 실패했습니다.");
    },
  });

  const { mutate: reorderSectionsMutation } = useMutation<
    void,
    ApiError,
    ReorderSectionRequest
  >({
    mutationFn: (request) =>
      apiClient
        .put<void>(
          generateAPIEndpoint(
            APIEndpoint.SECTIONS_REORDER,
            owner || "",
            name || ""
          ),
          request
        )
        .then((response) => response.data),
    onSuccess: (_, variables) => {
      setSections((prev: Section[]) =>
        variables.sectionIds.map((id, index) => {
          const section = prev.find((s) => s.id === id)!;
          return { ...section, orderIdx: index + 1 };
        })
      );
    },
    onError: () => {
      toast.error("섹션 순서 변경에 실패했습니다.");
    },
  });

  const { mutate: updateSectionContentMutation } = useMutation<
    void,
    ApiError,
    UpdateSectionContentRequest
  >({
    mutationFn: (request) =>
      apiClient
        .patch<void>(
          generateAPIEndpoint(
            APIEndpoint.SECTIONS_CONTENT,
            owner || "",
            name || ""
          ),
          request
        )
        .then((response) => response.data),
    onSuccess: (_, variables) => {
      setSections((prev) =>
        prev.map((section) =>
          section.id === variables.sectionId
            ? { ...section, content: variables.content }
            : section
        )
      );
    },
  });

  const { mutate: deleteSectionMutation } = useMutation<
    void,
    ApiError,
    DeleteSectionRequest
  >({
    mutationFn: (request) =>
      apiClient
        .delete<void>(
          generateAPIEndpoint(
            APIEndpoint.SECTIONS_DELETE,
            owner || "",
            name || "",
            request.sectionId.toString()
          )
        )
        .then((response) => response.data),
    onSuccess: (_, variables) => {
      setSections((prev) =>
        prev.filter((section) => section.id !== variables.sectionId)
      );

      if (clickedSection.id === variables.sectionId) {
        setClickedSection(sections[0]);
      }
    },
    onError: () => {
      toast.error("섹션 삭제에 실패했습니다.");
    },
  });

  const refetchSections = useCallback(
    (callback?: Callback<void>) => {
      refetch({ throwOnError: true })
        .then(() => {
          callback?.onSuccess?.();
        })
        .catch((error) => {
          callback?.onError?.(error);
        });
    },
    [refetch]
  );

  const initSections = useCallback(
    async (request: InitSectionRequest, callback?: Callback<Sections>) => {
      await initSectionsMutation(request, {
        onSuccess: (data) => {
          callback?.onSuccess?.(data);
          setClickedSection(data.sections[0]);
        },
        onError: (error) => {
          callback?.onError?.(error);
        },
      });
    },
    [initSectionsMutation]
  );

  // 섹션 추가
  const createSection = useCallback(
    (request: CreateSectionRequest, callback?: Callback<Section>) => {
      addSectionMutation(request, {
        onSuccess: (data) => {
          callback?.onSuccess?.(data);
        },
        onError: (error) => {
          callback?.onError?.(error);
        },
      });
    },
    [addSectionMutation]
  );

  // 순서 변경
  const updateSectionReorder = useCallback(
    (request: ReorderSectionRequest, callback?: Callback<void>) => {
      reorderSectionsMutation(request, {
        onSuccess: () => {
          callback?.onSuccess?.();
        },
        onError: (error) => {
          callback?.onError?.(error);
        },
      });
    },
    [reorderSectionsMutation]
  );

  // 섹션 내용 수정
  const updateSectionContent = useCallback(
    (request: UpdateSectionContentRequest, callback?: Callback<void>) => {
      updateSectionContentMutation(request, {
        onSuccess: () => {
          callback?.onSuccess?.();
        },
        onError: (error) => {
          callback?.onError?.(error);
        },
      });
    },
    [updateSectionContentMutation]
  );

  // 섹션 삭제
  const deleteSection = useCallback(
    (request: DeleteSectionRequest, callback?: Callback<void>) => {
      if (sections.length === 1) {
        toast.error("섹션은 최소 1개 이상 유지해야 합니다.");
        return;
      }

      deleteSectionMutation(request, {
        onSuccess: () => {
          callback?.onSuccess?.();
        },
        onError: (error) => {
          callback?.onError?.(error);
        },
      });
    },
    [sections.length, deleteSectionMutation]
  );

  const clickSection = useCallback((section: Section) => {
    setClickedSection(section);
  }, []);

  // 섹션 리셋 모달
  const resetSection = useCallback(() => {
    onOpenManualModal();
  }, [onOpenManualModal]);

  return (
    <SectionContext.Provider
      value={{
        sections,
        fullContent,
        clickedSection,
        clickSection,
        refetchSections,
        createSection,
        initSections,
        updateSectionReorder,
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
