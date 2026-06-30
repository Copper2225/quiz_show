import type { Route } from "./+types/uploads";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "~/utils/db.server";
import { useFetcher, useLoaderData } from "react-router";
import { toast } from "sonner";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { diskUploadHandler } from "~/utils/fileUploadHandler.server";
import { FileCard } from "./components/uploads/FileCard";
import { UploadHeader } from "./components/uploads/UploadHeader";
import { useEffect } from "react";

export async function loader() {
  const uploadsDir = path.resolve("public", "uploads");
  let fileNames: string[] = [];
  try {
    fileNames = await readdir(uploadsDir);
  } catch (err) {
    console.error("Failed to read uploads directory", err);
  }

  const questions = await prisma.questionEntity.findMany({
    select: { config: true },
  });

  const configStrings = questions.map((q) => JSON.stringify(q.config));

  const files = fileNames.map((fileName) => {
    const url = `/uploads/${fileName}`;
    const usages = configStrings.filter((config) => config.includes(url)).length;
    return {
      fileName,
      url,
      usages,
    };
  });

  return { files };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const fileName = formData.get("fileName") as string;
    const filePath = path.resolve("public", "uploads", fileName);

    // Verify usage again before deleting
    const url = `/uploads/${fileName}`;
    const questions = await prisma.questionEntity.findMany({
      select: { config: true },
    });
    const hasUsage = questions.some((q) => JSON.stringify(q.config).includes(url));

    if (hasUsage) {
      return { success: false, error: "Datei kann nicht gelöscht werden, da sie noch verwendet wird." };
    }

    try {
      await unlink(filePath);
      return { success: true };
    } catch (err) {
      console.error("Failed to delete file", err);
      return { success: false, error: "Fehler beim Löschen der Datei." };
    }
  }

  if (intent === "upload") {
    // Re-clone request for multi-part parsing
    const uploadRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: formData,
    });
    try {
      await unstable_parseMultipartFormData(uploadRequest, diskUploadHandler);
      return { success: true };
    } catch (err) {
      console.error("Upload failed", err);
      // Log the actual error to help debugging
      return { success: false, error: "Upload fehlgeschlagen: " + (err instanceof Error ? err.message : String(err)) };
    }
  }

  return { success: false, error: "Unbekannte Aktion" };
}

export default function UploadsOverview() {
  const { files } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        // toast.success(fetcher.formData?.get("intent") === "delete" ? "File deleted" : "Upload successful");
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const isUploading = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "upload";

  const handleDelete = (fileName: string) => {
    if (confirm(`Bist du sicher, dass du ${fileName} löschen möchtest?`)) {
      fetcher.submit(
        { intent: "delete", fileName },
        { method: "post" }
      );
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("intent", "upload");
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("mediaFileUpload", e.target.files[i]);
      }
      fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <UploadHeader isUploading={isUploading} onFileChange={onFileChange} />

      {files.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center text-gray-500 italic">
          Noch keine Dateien hochgeladen.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {files.map((file) => (
            <FileCard
              key={file.fileName}
              file={file}
              onDelete={handleDelete}
              disabled={fetcher.state !== "idle"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
