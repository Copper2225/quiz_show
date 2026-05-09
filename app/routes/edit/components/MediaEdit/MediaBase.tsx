import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import React, { useState } from "react";
import MediaUploadOrSelect from "~/routes/edit/components/MediaEdit/MediaUploadOrSelect";
import type { MediaConfig } from "~/types/adminTypes";
import Select from "~/components/Select";

interface Props {
  defaultConfig?: MediaConfig;
}

const MediaBase = ({ defaultConfig }: Props) => {
  const [media, setMedia] = useState<boolean>(
    defaultConfig?.mediaChecked ?? false,
  );

  return (
    <div className={"flex flex-col gap-2"}>
      <div>
        <Label className={"mb-2"}>Media</Label>
        <Checkbox
          checked={media}
          defaultChecked={defaultConfig?.mediaChecked}
          name={"_check_config.media.mediaChecked"}
          id="_check_config.media.mediaChecked"
          onCheckedChange={(checked: boolean) => setMedia(checked)}
        />
      </div>
      {media && (
        <>
          <MediaUploadOrSelect
            defaultData={defaultConfig?.mediaFile}
            name={"config.media.mediaFile"}
            uploadName={"mediaFileUpload"}
          />
          <div className={"flex gap-4"}>
            <div>
              <Label className={"mb-2"}>Blur</Label>
              <Checkbox
                defaultChecked={defaultConfig?.blur}
                name={"_check_config.media.blur"}
                id="_check_config.media.blur"
              />
            </div>
            <div className={"flex flex-col gap-1"}>
              <Label className={"mb-2"}>Object Fit</Label>
              <Select
                options={[
                  { value: "contain", label: "Contain" },
                  { value: "cover", label: "Cover" },
                  { value: "fill", label: "Fill" },
                  { value: "none", label: "None" },
                  { value: "scale-down", label: "Scale Down" },
                ]}
                label={"Object Fit"}
                name={"config.media.objectFit"}
                defaultValue={defaultConfig?.objectFit ?? "contain"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaBase;
