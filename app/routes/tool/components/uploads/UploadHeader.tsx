import { Upload } from "lucide-react";

interface UploadHeaderProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadHeader({ isUploading, onFileChange }: UploadHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Übersicht</h1>
        <p className="text-gray-500 mt-1">
          Verwalte deine Bilder und Mediendateien.
        </p>
      </div>
      <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors shadow-sm">
        <Upload size={20} />
        <span className="font-semibold">
          {isUploading ? "Wird hochgeladen..." : "Dateien hochladen"}
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
