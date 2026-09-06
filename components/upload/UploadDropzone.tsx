"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { validateImageFile } from "@/lib/utils/validation";

interface UploadDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function UploadDropzone({ onFilesAccepted, disabled, onError }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const valid: File[] = [];
      for (const file of files) {
        const result = validateImageFile(file);
        if (!result.valid) {
          onError?.(result.error ?? "That file could not be uploaded.");
          continue;
        }
        valid.push(file);
      }
      if (valid.length) onFilesAccepted(valid);
    },
    [onFilesAccepted, onError]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      className={cn(
        "texture-grain flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-8 py-16 text-center transition-colors duration-200",
        isDragging
          ? "border-nude-blush bg-nude-blush/10"
          : "border-nude-blush/25 bg-black-cherry-700/30 hover:border-nude-blush/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-nude-blush/30 bg-black-cherry-800">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-nude-blush">
          <path
            d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-nude-blush">
          Drag &amp; drop your images here
        </p>
        <p className="mt-1 text-xs text-nude-blush/50">
          or tap to upload from your camera roll · JPG, PNG, WEBP · up to 12MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
