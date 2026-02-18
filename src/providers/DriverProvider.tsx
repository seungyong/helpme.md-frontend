import { ReactNode, useMemo, useEffect } from "react";
import { driver } from "driver.js";
import { useSection } from "@src/hooks/useSection";

export const DriverProvider = ({ children }: { children: ReactNode }) => {
  const { sections, isLoading: isSectionsLoading } = useSection();

  const scrollWithOffset = (element?: Element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offset = 80; // 상단 여백 (헤더 높이 + 약간의 여유)
    const targetY = rect.top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(targetY, 0),
      behavior: "smooth",
    });
  };

  const isFirst = useMemo(() => {
    return localStorage.getItem("isFirst") !== "true";
  }, []);

  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    steps: [
      {
        element: ".func-buttons",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "README 기능 버튼",
          description:
            "README 기능 버튼을 통해 기능을 사용할 수 있습니다.\n초기화, 평가, AI 초안 생성, PR 생성 기능이 있습니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".dragable-sections",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "작업 섹션 목록",
          description:
            "README 작성을 섹션 별로 분리하고 작성할 수 있습니다.\n또한, 섹션을 드래그 앤 드롭으로 순서를 변경할 수 있습니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".section-list",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "초안 섹션 목록",
          description:
            "초안 섹션 아이템을 선택하여, 초안이 작성된 섹션을 추가할 수 있습니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".w-md-editor-toolbar > ul:nth-child(1)",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "Editor 기능 도구",
          description:
            "Editor 기능 도구를 통해 문서를 편집할 수 있습니다.\n헤딩, 굵기, 기울임, 취소선, 수평선, 링크, 인용, 코드, 이미지, 리스트 등을 편집할 수 있습니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".w-md-editor-toolbar > ul:nth-child(2)",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "Editor 레이아웃",
          description:
            "Editor 레이아웃을 변경할 수 있습니다.\nPreview, Live, Edit 모드, 병합 모드, 전체 보기와 README 내용 복사 기능이 있습니다.",
          side: "left",
          align: "start",
        },
      },
      {
        element: ".w-md-editor-area",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "Editor 내용",
          description:
            "Markdown 문법을 사용하여 작성할 수 있는 Editor 영역입니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".w-md-editor-preview",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "Editor 미리보기",
          description: "작성한 문서를 미리볼 수 있는 영역입니다.",
          side: "right",
          align: "start",
        },
      },
      {
        element: ".evaluation-result",
        onHighlighted: scrollWithOffset,
        popover: {
          title: "README 평가 결과",
          description:
            "README 평가 결과를 확인할 수 있는 영역입니다.\n평가 결과는 장점, 개선 사항, 기타 코멘트로 구분됩니다.",
          side: "top",
          align: "start",
        },
      },
    ],
  });

  useEffect(() => {
    if (isFirst && !isSectionsLoading && sections?.length > 0) {
      driverObj.drive();
      localStorage.setItem("isFirst", "true");
    }
  }, [driverObj, isFirst, isSectionsLoading, sections?.length]);

  return <>{children}</>;
};
