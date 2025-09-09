import type { Route } from "./+types/fileUpload";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { diskUploadHandler } from "~/utils/fileUploadHandler.server";
import { readdir } from "node:fs/promises";
import path from "node:path";

export async function loader(_args: Route.LoaderArgs) {
  const uploadsDir = path.resolve("public", "uploads");
  try {
    const fileNames = await readdir(uploadsDir);
    const files = fileNames.map((fileName) => ({
      fileName,
      url: `/uploads/${fileName}`,
    }));
    return { files };
  } catch (_err) {
    return { files: [] };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await unstable_parseMultipartFormData(
    request,
    diskUploadHandler,
  );

  // Get the file object
  const file = formData.get("mediaFileUpload") as File;
  return { ok: true, url: `/uploads/${file.name}`, fileName: file.name };
}
