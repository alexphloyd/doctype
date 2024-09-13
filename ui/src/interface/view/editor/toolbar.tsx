import { Divider, Kbd, Paper } from '@mantine/core';
import {
  CodeIcon,
  TextIcon,
  HeadingIcon,
  ActivityLogIcon,
  CheckboxIcon,
  Link1Icon,
} from '@radix-ui/react-icons';
import { useCurrentEditor } from '@tiptap/react';
import { ComponentType, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export function EditorToolbar() {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }

  return (
    <Paper
      shadow="sm"
      className="px-3 py-2 fixed bottom-8 left-[50%] transform -translate-x-[50%] space-x-4 flex items-center justify-center z-50 overflow-hidden"
    >
      <Kbd className="h-7">
        <p className="-mt-[5px] text-[18px]">⌥</p>
      </Kbd>
      <Divider variant="solid" orientation="vertical" className="h-[22px] m-auto" />
      <Button
        action={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        IconSlot={HeadingIcon}
        shortcutKey="Digit1"
      />
      <Button
        action={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        IconSlot={TextIcon}
        shortcutKey="Digit2"
      />
      <Button
        action={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        IconSlot={CodeIcon}
        shortcutKey="Digit3"
      />
      <Button
        action={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        IconSlot={CheckboxIcon}
        shortcutKey="Digit4"
      />
    </Paper>
  );
}

function Button({
  shortcutKey,
  action,
  IconSlot,
  isActive,
}: {
  shortcutKey: string;
  action: () => void;
  isActive?: boolean;
  IconSlot: ComponentType<Parameters<typeof ActivityLogIcon>[0]>;
}) {
  const numberLabel = shortcutKey.at(-1);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === shortcutKey;
      if (triggered) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <button onClick={action} className="relative w-5 h-5">
      <IconSlot className={twMerge('w-[18px] h-[18px]', isActive && 'text-accent')} />
      <span className="absolute -bottom-[4px] -right-[5px] text-[9px] text-gray-500">
        {numberLabel}
      </span>
    </button>
  );
}
