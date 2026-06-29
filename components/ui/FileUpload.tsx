'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, FileText, Image, Video, File } from 'lucide-react';
import { cn, formatFileSize, validateFiles } from '@/lib/utils';
import { UploadProgress } from '@/types';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploadProgresses?: UploadProgress[];
  disabled?: boolean;
  error?: string;
  accept?: string;
  allowedTypes?: Record<string, string[]>;
  placeholderText?: string;
  multiple?: boolean;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-sky-500" />;
  if (type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
  if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}

export default function FileUpload({
  files,
  onFilesChange,
  uploadProgresses,
  disabled,
  error,
  accept,
  allowedTypes,
  placeholderText,
  multiple = true,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFiles = useCallback(
    (incoming: File[]) => {
      const { valid, errors } = validateFiles(incoming, allowedTypes);
      setValidationErrors(errors);
      if (valid.length > 0) {
        if (!multiple) {
          // If not multiple, replace current files with the first valid incoming file
          onFilesChange([valid[0]]);
        } else {
          // Deduplicate by name
          const existing = new Set(files.map((f) => f.name));
          const newFiles = valid.filter((f) => !existing.has(f.name));
          onFilesChange([...files, ...newFiles]);
        }
      }
    },
    [files, onFilesChange, allowedTypes, multiple],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [disabled, handleFiles],
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const getProgress = (fileName: string): UploadProgress | undefined =>
    uploadProgresses?.find((p) => p.fileName === fileName);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-gold-500 bg-gold-100'
            : 'border-gray-200 bg-gray-50 hover:border-gold-500 hover:bg-gold-100/30',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-400',
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Area upload file"
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          title="Pilih file untuk diunggah"
          aria-label="Pilih file untuk diunggah"
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
          accept={accept || ".jpg,.jpeg,.png,.gif,.webp,.pdf,.mp4,.mov,.doc,.docx,.xls,.xlsx"}
          disabled={disabled}
        />
        <UploadCloud
          className={cn(
            'w-10 h-10 mx-auto mb-3 transition-colors',
            isDragging ? 'text-gold-500' : 'text-gray-400',
          )}
        />
        <p className="text-sm font-semibold text-navy-900">
          Seret & lepas file di sini, atau{' '}
          <span className="text-gold-500 underline">klik untuk memilih</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {placeholderText || "JPG, PNG, PDF, MP4, DOCX, XLSX — maks. 25 MB per file"}
        </p>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
          {validationErrors.map((err, i) => (
            <p key={i} className="text-xs text-red-600">⚠ {err}</p>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-navy-900">
            {files.length} file dipilih
          </p>
          {files.map((file, idx) => {
            const progress = getProgress(file.name);
            return (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
              >
                <FileIcon type={file.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    {progress && (
                      <>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={cn(
                              'h-1.5 rounded-full transition-all duration-300',
                              progress.status === 'done'
                                ? 'bg-emerald-500'
                                : progress.status === 'error'
                                ? 'bg-red-500'
                                : 'bg-gold-500',
                              progress.progress >= 100 ? 'w-full' :
                              progress.progress >= 90 ? 'w-[90%]' :
                              progress.progress >= 80 ? 'w-[80%]' :
                              progress.progress >= 75 ? 'w-[75%]' :
                              progress.progress >= 70 ? 'w-[70%]' :
                              progress.progress >= 60 ? 'w-[60%]' :
                              progress.progress >= 50 ? 'w-[50%]' :
                              progress.progress >= 40 ? 'w-[40%]' :
                              progress.progress >= 30 ? 'w-[30%]' :
                              progress.progress >= 20 ? 'w-[20%]' :
                              progress.progress >= 10 ? 'w-[10%]' : 'w-0'
                            )}
                            data-progress={progress.progress}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {progress.status === 'done' ? '✓' : `${progress.progress}%`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!progress || progress.status !== 'uploading' ? (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                    onClick={() => removeFile(idx)}
                    aria-label={`Hapus ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
