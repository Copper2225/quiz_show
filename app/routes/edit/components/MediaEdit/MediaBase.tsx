import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import React, { useState } from "react";
import MediaUploadOrSelect from "~/routes/edit/components/MediaEdit/MediaUploadOrSelect";
import type { MediaConfig } from "~/types/adminTypes";

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
      {media && <MediaUploadOrSelect defaultData={defaultConfig} />}
    </div>
  );
};

export default MediaBase;
