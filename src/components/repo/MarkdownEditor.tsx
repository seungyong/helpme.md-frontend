import { useEffect, useState, useRef, useMemo } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import toast from "react-hot-toast";

import styles from "./MarkdownEditor.module.scss";

import MergeIcon from "@assets/images/merge.svg";
import EditIcon from "@assets/images/edit.svg";
import CopyIcon from "@assets/images/copy.svg";

import { useSection } from "@src/hooks/useSection";

const MarkdownEditor = () => {
  const { fullContent, clickedSection, updateSectionContent } = useSection();

  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [content, setContent] = useState<string>(clickedSection?.content || "");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSectionIdRef = useRef<number>(clickedSection?.id);

  useEffect(() => {
    // 섹션이 실제로 변경되었는지 확인
    if (prevSectionIdRef.current !== clickedSection?.id) {
      // 변경사항이 있으면 이전 섹션에 즉시 저장
      if (isDirty) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        updateSectionContent({ sectionId: prevSectionIdRef.current, content });
      }

      // 새 섹션으로 전환
      prevSectionIdRef.current = clickedSection?.id;
      // eslint-disable-next-line
      setContent(clickedSection?.content || "");
      setIsDirty(false);
    }
  }, [
    clickedSection?.id,
    clickedSection?.content,
    isDirty,
    content,
    updateSectionContent,
  ]);

  // 자동 저장 (디바운싱)
  useEffect(() => {
    if (!isDirty || !content?.trim() || !clickedSection?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateSectionContent({ sectionId: clickedSection.id, content });
      setIsDirty(false);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isDirty, clickedSection?.id, updateSectionContent]);

  const handleChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

  const mergeCommand = useMemo(
    () => ({
      name: "merge-sections",
      keyCommand: "merge-sections",
      buttonProps: {
        "aria-label": "Merge sections",
        title: "전체 섹션 병합 보기",
      },
      icon: (
        <img
          src={MergeIcon}
          alt="merge"
          style={{
            position: "relative",
            top: "0.125rem",
          }}
        />
      ),
      execute: () => {
        setIsMerging(true);
      },
    }),
    []
  );

  const editCommand = useMemo(
    () => ({
      name: "edit-sections",
      keyCommand: "edit-sections",
      buttonProps: {
        "aria-label": "Edit sections",
        title: "편집 모드로 돌아가기",
        disabled: false,
      },
      icon: (
        <img
          src={EditIcon}
          alt="edit"
          style={{
            position: "relative",
            top: "0.125rem",
          }}
        />
      ),
      execute: () => {
        setIsMerging(false);
      },
    }),
    []
  );

  const copyCommand = useMemo(
    () => ({
      name: "copy-sections",
      keyCommand: "copy-sections",
      buttonProps: { "aria-label": "Copy sections", disabled: false },
      icon: <img src={CopyIcon} alt="copy" />,
      disabled: false,
      execute: () => {
        if (isMerging) {
          navigator.clipboard.writeText(fullContent);
        } else {
          navigator.clipboard.writeText(content);
        }

        toast.success("클립보드에 복사되었습니다.");
      },
    }),
    [isMerging, fullContent, content]
  );

  const displayContent = isMerging ? fullContent : content;

  const editorCommands = useMemo(() => {
    if (isMerging) {
      return [];
    }

    return [
      commands.group(
        [commands.heading2, commands.heading3, commands.heading4],
        {
          name: "title",
          groupName: "title",
          buttonProps: { "aria-label": "Insert title" },
        }
      ),
      commands.divider,
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.divider,
      commands.link,
      commands.quote,
      commands.code,
      commands.codeBlock,
      commands.image,
      commands.divider,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand,
    ];
  }, [isMerging]);

  const editorExtraCommands = useMemo(() => {
    if (isMerging) {
      return [
        copyCommand,
        commands.divider,
        editCommand,
        commands.divider,
        commands.fullscreen,
      ];
    }

    // 일반 모드: 모든 버튼 표시
    return [
      copyCommand,
      commands.divider,
      commands.codeEdit,
      commands.codeLive,
      commands.codePreview,
      commands.divider,
      mergeCommand,
      commands.divider,
      commands.fullscreen,
    ];
  }, [isMerging, copyCommand, mergeCommand, editCommand]);

  return (
    <div className={styles.markdownEditor}>
      <MDEditor
        value={displayContent}
        onChange={(value) => !isMerging && handleChange(value ?? "")}
        height="100%"
        preview={isMerging ? "preview" : "live"}
        commands={editorCommands}
        extraCommands={editorExtraCommands}
        data-color-mode="dark"
      />
    </div>
  );
};

export default MarkdownEditor;
