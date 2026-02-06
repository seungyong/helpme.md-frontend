import { useEffect, useState, useRef, useMemo } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";

import styles from "./MarkdownEditor.module.scss";

import MergeIcon from "@assets/images/merge.svg";
import EditIcon from "@assets/images/edit.svg";

import { useSectionContext } from "@src/context/SectionContext";

const MarkdownEditor = () => {
  const { sections, clickedSection, updateSectionContent } =
    useSectionContext();

  const fullContent = useMemo(() => {
    return sections.map((section) => section.content).join("\n");
  }, [sections]);

  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [content, setContent] = useState<string>(clickedSection.content);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSectionIdRef = useRef<string | number>(clickedSection.id);

  const handleChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

  useEffect(() => {
    // 섹션이 실제로 변경되었는지 확인
    if (prevSectionIdRef.current !== clickedSection.id) {
      // 변경사항이 있으면 이전 섹션에 즉시 저장
      if (isDirty) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        updateSectionContent(prevSectionIdRef.current, content);
      }

      // 새 섹션으로 전환
      prevSectionIdRef.current = clickedSection.id;
      // eslint-disable-next-line
      setContent(clickedSection.content);
      setIsDirty(false);
    }
  }, [
    clickedSection.id,
    clickedSection.content,
    isDirty,
    content,
    updateSectionContent,
  ]);

  // 자동 저장 (디바운싱)
  useEffect(() => {
    if (!isDirty || !content?.trim()) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateSectionContent(clickedSection.id, content);
      setIsDirty(false);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isDirty, clickedSection.id, updateSectionContent]);

  const mergeCommand = useMemo(
    () => ({
      name: "merge-sections",
      keyCommand: "merge-sections",
      buttonProps: {
        "aria-label": "Merge sections",
        title: isMerging ? "편집 모드로 돌아가기" : "전체 섹션 병합 보기",
        style: isMerging
          ? {
              backgroundColor: "#3b82f621",
              border: "1px solid #60a5fa90",
            }
          : {},
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
    [isMerging]
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
      return [editCommand, commands.divider, commands.fullscreen];
    }

    // 일반 모드: 모든 버튼 표시
    return [
      commands.codeEdit,
      commands.codeLive,
      commands.codePreview,
      commands.divider,
      mergeCommand,
      commands.divider,
      commands.fullscreen,
    ];
  }, [isMerging, mergeCommand, editCommand]);

  return (
    <div className={styles.markdownEditor}>
      <MDEditor
        value={displayContent}
        onChange={(value) => !isMerging && handleChange(value ?? "")}
        height="100%"
        preview={isMerging ? "preview" : "live"}
        commands={editorCommands}
        extraCommands={editorExtraCommands}
      />
    </div>
  );
};

export default MarkdownEditor;
