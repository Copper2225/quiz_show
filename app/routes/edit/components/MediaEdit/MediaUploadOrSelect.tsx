import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import Select from "~/components/Select";
import { useFetcher } from "react-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  defaultData?: string;
  withLabel?: boolean;
  name: string;
  uploadName: string;
}

const MediaUploadOrSelect = ({
  defaultData,
  withLabel,
  name,
  uploadName,
}: Props) => {
  const listFetcher = useFetcher();
  const uploadFetcher = useFetcher();
  const [selected, setSelected] = useState<string>(defaultData ?? "");
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
    <div className={"flex-1"}>
      {withLabel && (
        <Label className={"mb-2"} htmlFor={"mediaFile"}>
          Media hochladen
        </Label>
      )}

      <div className={"flex gap-3"}>
        <div className="flex-1 flex gap-2">
          <Select
            name={name}
            label={"Media"}
            options={options}
            value={selected}
            onChange={setSelected}
            align={"start"}
            className={"flex-1 justify-start overflow-hidden"}
          />
          <Input
            placeholder="Oder URL eingeben..."
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1"
          />
        </div>
        <Input
          name={uploadName}
          id={"mediaFileUpload"}
          type={"file"}
          accept={"image/*"}
          onChange={upload}
          className="w-1/4"
        />
      </div>
    </div>
  );
};

export default MediaUploadOrSelect;
