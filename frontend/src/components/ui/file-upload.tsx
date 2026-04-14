import { useCallback, useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  onFile: (file: File) => void;
  label?: string;
  currentFile?: string | null;
  onClear?: () => void;
  className?: string;
}

export function FileUpload({ accept, maxSizeMb = 10, onFile, label, currentFile, onClear, className }: FileUploadProps): JSX.Element {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): boolean => {
      if (accept) {
        const allowed = accept.split(',').map((t) => t.trim());
        if (!allowed.some((t) => file.type === t || file.name.endsWith(t))) {
          setError(`File type not allowed. Accepted: ${accept}`);
          return false;
        }
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File must be under ${maxSizeMb}MB`);
        return false;
      }
      setError(null);
      return true;
    },
    [accept, maxSizeMb],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) onFile(file);
    },
    [validate, onFile],
  );

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      )}

      {currentFile ? (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--elements)] px-3.5 py-2.5">
          <FileText size={16} className="text-[var(--muted)]" />
          <span className="flex-1 truncate text-sm text-[var(--foreground)]">{currentFile}</span>
          {onClear && (
            <button onClick={onClear} className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors',
            dragOver
              ? 'border-[var(--border)] bg-[var(--background)]'
              : 'border-[var(--border)] bg-[var(--elements)] hover:border-[var(--foreground)]',
          )}
        >
          <Upload size={20} className="text-[var(--muted)]" />
          <p className="text-xs text-[var(--muted)]">Drop file here or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />
        </div>
      )}

      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}
