'use client';

import React, { useRef, useEffect, useState } from 'react';

interface NativeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function NativeEditor({ value, onChange }: NativeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only set initial value to prevent cursor jumping
      if (!editorRef.current.innerHTML) {
         editorRef.current.innerHTML = value || '<p><br></p>';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    handleInput();
    editorRef.current?.focus();
  };

  if (!isMounted) return <div className="border rounded-md min-h-[300px] bg-muted/20 animate-pulse" />;

  return (
    <div className="border rounded-md bg-background overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary transition-all">
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
        <button type="button" onClick={() => exec('bold')} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded font-serif font-bold" title="Bold">
          B
        </button>
        <button type="button" onClick={() => exec('italic')} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded font-serif italic" title="Italic">
          I
        </button>
        <button type="button" onClick={() => exec('underline')} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded font-serif underline" title="Underline">
          U
        </button>
        <div className="w-px bg-border mx-1 my-1" />
        <button type="button" onClick={() => exec('formatBlock', 'H2')} className="px-2 h-8 flex items-center justify-center hover:bg-background rounded font-semibold text-sm">
          H2
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="px-2 h-8 flex items-center justify-center hover:bg-background rounded font-semibold text-sm">
          H3
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'P')} className="px-2 h-8 flex items-center justify-center hover:bg-background rounded text-sm">
          P
        </button>
        <div className="w-px bg-border mx-1 my-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 h-8 flex items-center justify-center hover:bg-background rounded text-sm">
          List
        </button>
        <div className="w-px bg-border mx-1 my-1" />
        <button type="button" onClick={() => {
          const url = prompt('Enter link URL:');
          if (url) exec('createLink', url);
        }} className="px-2 h-8 flex items-center justify-center hover:bg-background rounded text-sm text-primary">
          Link
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[400px] focus:outline-none prose dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-4"
        onInput={handleInput}
        onBlur={handleInput}
      />
    </div>
  );
}
