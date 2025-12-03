import { useEffect, useRef } from "react";
import type { EditorBridge } from "@10play/tentap-editor";

type BridgeState = {
  isBoldActive: boolean;
  isItalicActive: boolean;
  isUnderlineActive: boolean;
  isStrikeActive: boolean;
  isCodeActive: boolean;
  isLinkActive: boolean;
  isTaskListActive: boolean;
  isBlockquoteActive: boolean;
  isOrderedListActive: boolean;
  isBulletListActive: boolean;
  headingLevel: number | undefined;
};

export const useToolbarStateLogger = (
  editor: EditorBridge,
  toggleEventCall?: (actionName: string) => void
): void => {
  const previousStateRef = useRef<BridgeState | null>(null);

  useEffect(() => {
    const toolbarMap: Record<keyof BridgeState, string> = {
      isBoldActive: "Bold",
      isItalicActive: "Italic",
      isUnderlineActive: "Underline",
      isStrikeActive: "Strike",
      isCodeActive: "Code",
      isLinkActive: "Link",
      isTaskListActive: "Task List",
      isBlockquoteActive: "Blockquote",
      isOrderedListActive: "Ordered List",
      isBulletListActive: "Bullet List",
      headingLevel: "Heading",
    };

    const unsubscribe = editor._subscribeToEditorStateUpdate((curr) => {
      const prev = previousStateRef.current;

      if (prev) {
        (Object.keys(toolbarMap) as Array<keyof BridgeState>).forEach((key) => {
          const label = toolbarMap[key];

          if (key === "headingLevel") {
            if (prev[key] !== curr[key]) {
              if (curr.headingLevel) {
                console.log(
                  `Toolbar Option Selected: Heading H${curr.headingLevel}`
                );
              } else {
                console.log("Toolbar Option Selected: Heading Normal");
              }

              if (curr.headingLevel) toggleEventCall?.("heading");
            }
            return;
          }

          if (prev[key] !== curr[key]) {
            // console.log(
            //   `Toolbar Option Selected: ${label}`,
            //   curr[key] ? "ON" : "OFF"
            // );

            if (curr[key]) toggleEventCall?.(label);
          }
        });
      }

      previousStateRef.current = { ...curr };
    });

    previousStateRef.current = { ...editor.getEditorState() };

    return unsubscribe;
  }, [editor, toggleEventCall]);
};
