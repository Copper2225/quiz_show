import { Trash2, ExternalLink, File as FileIcon } from "lucide-react";

interface FileCardProps {
  file: {
    fileName: string;
    url: string;
    usages: number;
  };
  onDelete: (fileName: string) => void;
  disabled: boolean;
}

export function FileCard({ file, onDelete, disabled }: FileCardProps) {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.fileName);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
        {isImage ? (
          <img
            src={file.url}
            alt={file.fileName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-400">
            <FileIcon size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`shrink-0 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded text-[12px] font-bold shadow-sm backdrop-blur-sm border ${
              file.usages > 0
                ? "bg-green-500/90 text-white border-green-600"
                : "bg-gray-500/90 text-white border-gray-600"
            }`}
            title={`${file.usages} ${file.usages === 1 ? "Verwendung" : "Verwendungen"}`}
          >
            {file.usages}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className="font-bold text-gray-900 break-all text-base line-clamp-2"
            title={file.fileName}
          >
            {file.fileName}
          </span>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Original öffnen"
          >
            <ExternalLink size={18} />
          </a>
          <button
            onClick={() => onDelete(file.fileName)}
            disabled={file.usages > 0 || disabled}
            className={`p-2 rounded-lg transition-colors ${
              file.usages > 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-red-500 hover:bg-red-50"
            }`}
            title={file.usages > 0 ? "Datei in Verwendung" : "Löschen"}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
