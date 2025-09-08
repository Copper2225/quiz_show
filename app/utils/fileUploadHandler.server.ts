import { unstable_createFileUploadHandler } from "@remix-run/node";

export const diskUploadHandler = unstable_createFileUploadHandler({
  maxPartSize: 1024 * 1024 * 1024,
  directory: "public/uploads",

  file: ({ filename }) => filename,
});
