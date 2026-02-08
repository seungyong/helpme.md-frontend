import {
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Sections, Section } from "@src/types/section";
import { ApiError, ERROR_CODE } from "@src/types/error";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";

import { apiClient } from "@src/utils/apiClient";
import { SectionContext } from "../hooks/useSection";
import InitSection from "@src/components/repo/InitSectionModal";

interface SectionProviderProps {
  children: ReactNode;
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
    queryFn: () =>
      apiClient<Sections>(
        generateAPIEndpoint(APIEndpoint.SECTIONS, owner || "", name || "")
      ),
    select: (data: Sections) => data.sections,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
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
    if (isError && !(error?.errorCode === ERROR_CODE.NOT_FOUND_SECTIONS)) {
      toast.error(error?.message || "섹션을 불러오는데 실패했습니다.");
      navigate("/", { replace: true });
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  return (
    <SectionStateManager
      key={isSuccess ? "success" : "none"}
      initialSections={sections || []}
      isLoading={isLoading}
      onOpenManualModal={handleOpenManualModal}
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
}: {
  initialSections: Section[];
  isLoading: boolean;
  children: React.ReactNode;
  onOpenManualModal: () => void;
}) => {
  const { owner, name } = useParams();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [clickedSection, setClickedSection] = useState<Section>(
    initialSections[0]
  );

  const fullContent = useMemo(() => {
    return sections?.map((section) => section.content || "").join("\n\n") || "";
  }, [sections]);

  const { mutateAsync: initSectionsMutation } = useMutation<
    Sections,
    ApiError,
    { branch: string; splitMode: string }
  >({
    mutationFn: ({ branch, splitMode }) =>
      apiClient<Sections>(
        generateAPIEndpoint(
          APIEndpoint.SECTIONS_INIT,
          owner || "",
          name || ""
        ) + `?branch=${branch}&splitMode=${splitMode}`,
        {
          method: "PUT",
        }
      ),
    onSuccess: (data) => {
      setSections(data.sections);
    },
    onError: (error) => {
      toast.error(error.message || "섹션 초기화에 실패했습니다.");
    },
  });

  const initSections = useCallback(
    async (branch: string, splitMode: string) => {
      const data = await initSectionsMutation({ branch, splitMode });
      setClickedSection(data.sections[0]);
      return data;
    },
    [initSectionsMutation]
  );

  const clickSection = useCallback((section: Section) => {
    console.log("Clicked section:", section);
    setClickedSection(section);
  }, []);

  // 섹션 추가
  const createSection = useCallback((title: string, content: string | null) => {
    console.log(`${title}\n ${content} 섹션 추가됨`);
  }, []);

  // 순서 변경
  const updateSectionOrder = useCallback((reorderedSections: Section[]) => {
    setSections(reorderedSections);
    console.log("순서 변경됨:", reorderedSections);
    // TODO: API 호출로 순서 저장
  }, []);

  // 섹션 내용 수정
  const updateSectionContent = useCallback(
    (sectionId: string | number, content: string) => {
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId ? { ...section, content } : section
        )
      );
      console.log(`섹션 ${sectionId} 내용 변경됨`);
      // TODO: API 호출로 내용 저장
    },
    []
  );

  // 섹션 삭제
  const deleteSection = useCallback(
    (sectionId: string | number) => {
      if (sections.length === 1) {
        toast.error("섹션은 최소 1개 이상 유지해야 합니다.");
        return;
      }

      setSections((prev) => prev.filter((section) => section.id !== sectionId));
      console.log(`섹션 ${sectionId} 삭제됨`);
      // TODO: API 호출로 삭제
    },
    [sections.length]
  );

  // 섹션 리셋 (원본으로 되돌리기)
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
        createSection,
        updateSectionOrder,
        updateSectionContent,
        deleteSection,
        resetSection,
        initSections,
        isLoading,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
