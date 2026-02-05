import { useEffect, useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import styles from "./MarkdownEditor.module.scss";

import { useSectionContext } from "@src/context/SectionContext";

const MarkdownEditor = () => {
  const { clickedSection, updateSectionContent } = useSectionContext();

  const [content, setContent] = useState<string>(clickedSection.content);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSectionIdRef = useRef<string | number>(clickedSection.id);

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

  const handleChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

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

  return (
    <div className={styles.markdownEditor}>
      <MDEditor
        value={content}
        onChange={(value) => handleChange(value ?? "")}
        height="100%"
      />
    </div>
  );
};

export default MarkdownEditor;
