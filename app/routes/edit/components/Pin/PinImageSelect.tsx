import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import Select from "~/components/Select";
import { useFetcher } from "react-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Pin from "~/routes/edit/components/Pin/Pin";

interface Props {
  defaultData?: any;
}

const PinImageSelect = ({ defaultData }: Props) => {
  const listFetcher = useFetcher();
  const uploadFetcher = useFetcher();
  const [selected, setSelected] = useState<string>(defaultData?.image ?? "");
  const [uploaded, setUploaded] = useState<
    { value: string; label: string } | undefined
  >();

  // Marker position state (store both px and percent)
  const [unit, setUnit] = useState<"px" | "%">(
    (defaultData?.pin?.unit as "px" | "%") ?? "%",
  );
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [xPx, setXPx] = useState<number | "">(defaultData?.pin?.xPx ?? "");
  const [yPx, setYPx] = useState<number | "">(defaultData?.pin?.yPx ?? "");
  const [xPercent, setXPercent] = useState<number | "">(
    defaultData?.pin?.xPercent ??
      (defaultData?.pin?.xPx && defaultData?.pin?.imgW
        ? Math.round((defaultData.pin.xPx / defaultData.pin.imgW) * 10000) / 100
        : ""),
  );
  const [yPercent, setYPercent] = useState<number | "">(
    defaultData?.pin?.yPercent ??
      (defaultData?.pin?.yPx && defaultData?.pin?.imgH
        ? Math.round((defaultData.pin.yPx / defaultData.pin.imgH) * 10000) / 100
        : ""),
  );

  const previewImgRef = useRef<HTMLImageElement | null>(null);
  const fullImgRef = useRef<HTMLImageElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  // Load natural image size when selected changes
  useEffect(() => {
    if (!selected) {
      setNaturalSize(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      // If only percent present, backfill px; if only px present, backfill percent
      if (xPercent !== "" && yPercent !== "") {
        setXPx(Math.round(((xPercent as number) / 100) * img.naturalWidth));
        setYPx(Math.round(((yPercent as number) / 100) * img.naturalHeight));
      } else if (xPx !== "" && yPx !== "") {
        setXPercent(
          Math.round(((xPx as number) / img.naturalWidth) * 10000) / 100,
        );
        setYPercent(
          Math.round(((yPx as number) / img.naturalHeight) * 10000) / 100,
        );
      }
    };
    img.src = selected;
  }, [selected]);

  const onPreviewLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (!naturalSize) {
        setNaturalSize({
          w: e.currentTarget.naturalWidth,
          h: e.currentTarget.naturalHeight,
        });
      }
    },
    [naturalSize],
  );

  const handleDialogClick = useCallback(
    (e: React.MouseEvent) => {
      if (!fullImgRef.current || !naturalSize) return;
      const rect = fullImgRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const clampedX = Math.max(0, Math.min(clickX, rect.width));
      const clampedY = Math.max(0, Math.min(clickY, rect.height));
      const scaleX = naturalSize.w / rect.width;
      const scaleY = naturalSize.h / rect.height;
      const pxX = Math.round(clampedX * scaleX);
      const pxY = Math.round(clampedY * scaleY);
      const pctX = Math.round((pxX / naturalSize.w) * 10000) / 100;
      const pctY = Math.round((pxY / naturalSize.h) * 10000) / 100;
      setXPx(pxX);
      setYPx(pxY);
      setXPercent(pctX);
      setYPercent(pctY);
    },
    [naturalSize],
  );

  const onChangeUnit = useCallback((val: string) => {
    if (val === "%" || val === "px") setUnit(val);
  }, []);

  const changeX = useCallback(
    (val: string) => {
      if (!naturalSize) return;
      const num = val === "" ? "" : Number(val);
      if (unit === "px") {
        setXPx(num);
        if (num === "") {
          setXPercent("");
        } else {
          setXPercent(
            Math.round(((num as number) / naturalSize.w) * 10000) / 100,
          );
        }
      } else {
        setXPercent(num);
        if (num === "") {
          setXPx("");
        } else {
          setXPx(Math.round(((num as number) / 100) * naturalSize.w));
        }
      }
    },
    [naturalSize, unit],
  );

  const changeY = useCallback(
    (val: string) => {
      if (!naturalSize) return;
      const num = val === "" ? "" : Number(val);
      if (unit === "px") {
        setYPx(num);
        if (num === "") {
          setYPercent("");
        } else {
          setYPercent(
            Math.round(((num as number) / naturalSize.h) * 10000) / 100,
          );
        }
      } else {
        setYPercent(num);
        if (num === "") {
          setYPx("");
        } else {
          setYPx(Math.round(((num as number) / 100) * naturalSize.h));
        }
      }
    },
    [naturalSize, unit],
  );

  return (
    <div>
      <Label className={"mb-2"} htmlFor={"mediaFile"}>
        Media hochladen
      </Label>

      <div className={"flex gap-3"}>
        <Select
          name={"config.image"}
          label={"Media"}
          options={options}
          value={selected}
          onChange={setSelected}
          align={"start"}
          className={"w-3/4 justify-start"}
        />
        <Input
          id={"mediaFileUpload"}
          type={"file"}
          accept={"image/*"}
          onChange={upload}
        />
      </div>

      {selected && (
        <div className={"mt-4 flex flex-col gap-3"}>
          <div className={"flex items-center gap-3"}>
            <Label>Position setzen</Label>
            <Select
              name={""}
              label={"Unit"}
              options={[
                { value: "%", label: "%" },
                { value: "px", label: "px" },
              ]}
              value={unit}
              onChange={onChangeUnit}
              align={"start"}
              className={"w-32 justify-start"}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialogOpen(true)}
            >
              Fullscreen öffnen
            </Button>
          </div>

          <div className={"flex gap-3 items-end"}>
            <div className={"flex flex-col gap-1"}>
              <Label htmlFor={"pin-x"}>X ({unit})</Label>
              <Input
                id={"pin-x"}
                type={"number"}
                value={
                  unit === "px"
                    ? xPx === ""
                      ? ""
                      : xPx
                    : xPercent === ""
                      ? ""
                      : xPercent
                }
                onChange={(e) => changeX(e.target.value)}
              />
            </div>
            <div className={"flex flex-col gap-1"}>
              <Label htmlFor={"pin-y"}>Y ({unit})</Label>
              <Input
                id={"pin-y"}
                type={"number"}
                value={
                  unit === "px"
                    ? yPx === ""
                      ? ""
                      : yPx
                    : yPercent === ""
                      ? ""
                      : yPercent
                }
                onChange={(e) => changeY(e.target.value)}
              />
            </div>
          </div>

          <input
            hidden
            readOnly
            name="config.pin.xPercent"
            value={xPercent === "" ? "" : String(xPercent)}
          />
          <input
            hidden
            name="config.pin.yPercent"
            readOnly
            value={yPercent === "" ? "" : String(yPercent)}
          />
          <input
            hidden
            readOnly
            name="config.pin.imgW"
            value={naturalSize?.w ?? ""}
          />
          <input
            hidden
            readOnly
            name="config.pin.imgH"
            value={naturalSize?.h ?? ""}
          />

          <div
            className={
              "relative inline-block max-w-full w-[480px] border rounded"
            }
          >
            <img
              ref={previewImgRef}
              src={selected}
              alt="preview"
              className={"w-full h-auto block select-none"}
              onLoad={onPreviewLoad}
            />
            {xPercent !== "" && yPercent !== "" && (
              <Pin xPercent={xPercent} yPercent={yPercent} />
            )}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent
          className={
            "max-w-[98vw] max-h-[98vh] p-0 overflow-auto sm:max-w-[1600px] md:max-w-[95vw]"
          }
          showCloseButton
        >
          <DialogHeader className={"px-6 pt-6"}>
            <DialogTitle>Klicken um Marker zu setzen</DialogTitle>
          </DialogHeader>
          <div className={"p-2 md:p-4 flex items-center justify-center"}>
            <div className={"relative inline-block"}>
              <img
                ref={fullImgRef}
                src={selected}
                alt="full"
                className={
                  "max-w-[95vw] max-h-[85vh] w-auto h-auto block cursor-crosshair select-none object-contain"
                }
                onClick={handleDialogClick}
                draggable={false}
              />
              {xPercent !== "" && yPercent !== "" && (
                <Pin xPercent={xPercent} yPercent={yPercent} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PinImageSelect;
