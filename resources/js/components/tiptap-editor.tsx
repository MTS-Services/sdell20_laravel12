import type { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    CodeXml,
    Heading,
    Image as ImageIcon,
    Italic,
    List,
    ListOrdered,
    Link as LinkIcon,
    ListTodo,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Table as TableIcon,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef } from 'react';

type TiptapEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
    disabled?: boolean;
};

export default function TiptapEditor({
    value,
    onChange,
    placeholder,
    className,
    editorClassName,
    disabled,
}: TiptapEditorProps) {
    type HeadingLevel = 1 | 2 | 3;

    const handleToolbarMouseDown = (e: React.MouseEvent): void => {
        e.preventDefault();
    };

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: 'noopener noreferrer nofollow',
                    target: '_blank',
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Write something…',
            }),
        ],
        content: value || '',
        editable: !disabled,
        editorProps: {
            attributes: {
                class:
                    editorClassName ??
                    'prose prose-sm max-w-none focus:outline-none min-h-32',
            },
        },
        onUpdate: ({ editor }: { editor: Editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const current = editor.getHTML();
        const next = value || '';

        if (current !== next) {
            editor.commands.setContent(next, false);
        }
    }, [editor, value]);

    if (!editor) {
        return (
            <div
                className={
                    className ??
                    'w-full rounded-md border border-text-gray-300 bg-bg-white px-3 py-2 text-sm text-text-body'
                }
            />
        );
    }

    const toolbarButtonClass =
        'inline-flex h-9 w-9 items-center justify-center rounded-md text-text-title hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

    const toolbarButtonActiveClass = 'bg-gray-100';

    const selectClass =
        'h-9 rounded-md border border-text-gray-300 bg-bg-white px-2 text-sm text-text-title focus:outline-none';

    const handleSetLink = (): void => {
        if (!editor) {
            return;
        }

        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('URL', previousUrl ?? '');

        if (url === null) {
            return;
        }

        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    const uploadImage = async (file: File): Promise<void> => {
        if (!editor) {
            return;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(route('admin.editor.upload'), {
            method: 'POST',
            headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : undefined,
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const json = (await response.json()) as { url?: string };

        if (!json.url) {
            throw new Error('Upload response missing url');
        }

        editor.chain().focus().setImage({ src: json.url }).run();
    };

    const handlePickImage = (): void => {
        imageInputRef.current?.click();
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const file = e.target.files?.[0];
        e.target.value = '';

        if (!file) {
            return;
        }

        try {
            await uploadImage(file);
        } catch {
            window.alert('Image upload failed');
        }
    };

    return (
        <div
            className={
                className ??
                'w-full rounded-md border border-text-gray-300 bg-bg-white'
            }
        >
            <div className="flex flex-wrap items-center gap-1 border-b border-text-gray-300 p-2">
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={disabled}
                />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Undo"
                >
                    <Undo2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Redo"
                >
                    <Redo2 className="h-4 w-4" />
                </button>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <div className="inline-flex items-center gap-1">
                    <Heading className="h-4 w-4 text-text-title" />
                    <select
                        className={selectClass}
                        disabled={disabled}
                        value={
                            editor.isActive('heading', { level: 1 })
                                ? 'h1'
                                : editor.isActive('heading', { level: 2 })
                                  ? 'h2'
                                  : editor.isActive('heading', { level: 3 })
                                    ? 'h3'
                                    : 'p'
                        }
                        onChange={(e) => {
                            const val = e.target.value;
                            const chain = editor.chain().focus();

                            if (val === 'p') {
                                chain.setParagraph().run();
                                return;
                            }

                            const parsedLevel = Number(val.replace('h', ''));
                            const level = (parsedLevel >= 1 && parsedLevel <= 3
                                ? parsedLevel
                                : 1) as HeadingLevel;

                            chain.toggleHeading({ level }).run();
                        }}
                    >
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('bold') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('italic') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('underline') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('strike') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('code') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Inline code"
                >
                    <Code className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('codeBlock') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Code block"
                >
                    <CodeXml className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Horizontal rule"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('bulletList') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Bullet list"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('orderedList') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Numbered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('blockquote') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('taskList') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Task list"
                >
                    <ListTodo className="h-4 w-4" />
                </button>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={handleSetLink}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive('link') ? toolbarButtonActiveClass : ''}`}
                    aria-label="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Unlink"
                >
                    <LinkIcon className="h-4 w-4 opacity-50" />
                </button>

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={handlePickImage}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Insert image"
                >
                    <ImageIcon className="h-4 w-4" />
                </button>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive({ textAlign: 'left' }) ? toolbarButtonActiveClass : ''}`}
                    aria-label="Align left"
                >
                    <AlignLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive({ textAlign: 'center' }) ? toolbarButtonActiveClass : ''}`}
                    aria-label="Align center"
                >
                    <AlignCenter className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive({ textAlign: 'right' }) ? toolbarButtonActiveClass : ''}`}
                    aria-label="Align right"
                >
                    <AlignRight className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    disabled={disabled}
                    className={`${toolbarButtonClass} ${editor.isActive({ textAlign: 'justify' }) ? toolbarButtonActiveClass : ''}`}
                    aria-label="Align justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </button>

                <div className="mx-1 h-6 w-px bg-text-gray-300" />

                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Insert table"
                >
                    <TableIcon className="h-4 w-4" />
                </button>
                {/* <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Add column before"
                >
                    <TableIcon className="h-4 w-4 opacity-60" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Add row after"
                >
                    <TableIcon className="h-4 w-4 opacity-60" />
                </button>
                <button
                    type="button"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    disabled={disabled}
                    className={toolbarButtonClass}
                    aria-label="Delete table"
                >
                    <TableIcon className="h-4 w-4 opacity-40" />
                </button> */}
            </div>

            <div className="p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
