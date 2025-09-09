import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import Select from "~/components/Select";
import { useFetcher } from "react-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { MediaConfig } from "~/types/adminTypes";

interface Props {
  defaultData?: MediaConfig;
}

const MediaUploadOrSelect = ({ defaultData }: Props) => {
  const listFetcher = useFetcher();
  const uploadFetcher = useFetcher();
  const [selected, setSelected] = useState<string>(
    defaultData?.mediaFile ?? "",
  );
  const [uploaded, setUploaded] = useState<
    { value: string; label: string } | undefined
  >();

  useEffect(() => {
    listFetcher.load("/api/upload");
  }, []);

  useEffect(() => {
    if (uploadFetcher.data && (uploadFetcher.data as any).ok) {
      const data = uploadFetcher.data as {
        ok: true;
        url: string;
        fileName: string;
      };
      const option = { value: data.url, label: data.fileName };
      setUploaded(option);
      setSelected(option.value);
      listFetcher.load("/api/upload");
    }
  }, [uploadFetcher.data]);

  const options = useMemo(() => {
    const listed = (listFetcher.data?.files ?? []).map(
      (f: { url: string; fileName: string }) => ({
        value: f.url,
        label: f.fileName,
      }),
    );
    if (!uploaded) return listed;
    const exists = listed.some(
      (o: { value: string }) => o.value === uploaded.value,
    );
    return exists ? listed : [uploaded, ...listed];
  }, [listFetcher.data, uploaded]);

  const upload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const formData = new FormData();
        formData.append("mediaFileUpload", event.target.files[0]);
        uploadFetcher.submit(formData, {
          method: "post",
          action: "/api/upload",
          encType: "multipart/form-data",
        });
      }
    },
    [uploadFetcher],
  );

  return (
    <div>
      <Label className={"mb-2"} htmlFor={"mediaFile"}>
        Upload Media
      </Label>

      <div className={"flex gap-3"}>
        <Select
          name={"config.media.mediaFile"}
          label={"Media File"}
          options={options}
          value={selected}
          onChange={setSelected}
          align={"start"}
          className={"w-3/4 justify-start"}
        />
        <Input
          name={"mediaFileUpload"}
          id={"mediaFileUpload"}
          type={"file"}
          accept={"image/*"}
          onChange={upload}
        />
      </div>
    </div>
  );
};

export default MediaUploadOrSelect;
