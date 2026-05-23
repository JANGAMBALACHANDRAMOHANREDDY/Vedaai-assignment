"use client";

import { clsx } from "clsx";
import { useRef } from "react";

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({ file, onChange, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-slate-700">
        Reference file <span className="font-normal text-slate-400">(optional PDF or text)</span>
      </span>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={clsx(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition hover:border-brand-400 hover:bg-brand-50/30",
          error ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-slate-50/50"
        )}
      >
        <svg
          className="mb-3 h-10 w-10 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {file ? (
          <p className="text-sm font-medium text-brand-700">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-slate-500">PDF or TXT up to 10MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Remove file
        </button>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
